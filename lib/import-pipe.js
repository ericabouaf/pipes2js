
var fs = require('fs'),
    request = require('request');


var pipe2js = {

    importPipe: function (pipeId) {

        pipe2js.fetchPipe(pipeId, function (pipe) {

            var deciderCode = pipe2js.pipe2decider(pipe);

            try {
                fs.mkdirSync('pipes');
            } catch (ex) {}

            try {
                console.log("Writing module in pipes/" + pipeId);
                fs.mkdirSync('pipes/' + pipeId);
            } catch (ex) {}

            fs.writeFileSync('pipes/' + pipeId + '/package.json', JSON.stringify({
                "name" : pipeId,
                "main" : "./run.js",
                "version": "0.0.1",
                "dependencies": {
                    "pipes2js": "0.0.1"
                }
            }, null, 3));

            fs.writeFileSync('pipes/' + pipeId + '/decider.js', deciderCode);


            // run.js
            var runCode = [];
            runCode.push("var fs = require('fs'), path = require('path');");
            runCode.push("");
            runCode.push("var deciderCode = fs.readFileSync(path.join(__dirname, 'decider.js'), 'utf8');");
            runCode.push("");
            runCode.push("var run = require('pipes2js').run;");
            runCode.push("");
            runCode.push("run({}, deciderCode, function (err, results, state) {");
            runCode.push("  console.log(JSON.stringify(results, null, 3));");
            runCode.push("});");

            fs.writeFileSync('pipes/' + pipeId + '/run.js', runCode.join('\n'));

        });

    },

    fetchPipe: function (pipeId, cb) {
        request('http://pipes.yahoo.com/pipes/pipe.info?_id=' + pipeId + '&_out=json&format=json', function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var pipe = JSON.parse(JSON.parse(body).PIPE.working);
                cb(pipe);
            }
        });
    },

    conf2input: function (conf) {
        var i, k;
        if (Array.isArray(conf)) {
            for (i = 0; i < conf.length; i += 1) {
                if (conf[i].hasOwnProperty("terminal")) { // we remove config with "terminal"
                    conf[i] = null;
                } else {
                    conf[i] = pipe2js.conf2input(conf[i]);
                }
            }
        } else if (conf.hasOwnProperty('type') && conf.hasOwnProperty("value")) {
            return conf.value;
        } else if (typeof conf === 'object') {
            for (k in conf) {
                if (conf.hasOwnProperty(k)) {

                    if (conf[k].hasOwnProperty("terminal")) { // we remove config with "terminal"
                        conf[k] = undefined;
                    } else {
                        if (k === 'embed') {
                            conf[k] = {
                                type: conf[k].value.type,
                                id: conf[k].value.id,
                                conf: pipe2js.conf2input(conf[k].value.conf),
                                parentModuleId: conf[k].value.parentModuleId
                            };
                        } else {
                            conf[k] = pipe2js.conf2input(conf[k]);
                        }
                    }
                }
            }
        }

        return conf;
    },

    /**
     * Returns the following structure for each module config :
     *
     * {
     *    '1_part': {
     *          path: ['embed', 0, 'value'],
     *          subkey: 'description'
     *    }
     * }
     *
     */
    pathsForTerminals: function (conf, pathItems, pathsForTerminals) {

        if (!pathItems) { pathItems = []; }
        if (!pathsForTerminals) { pathsForTerminals = {}; }

        var i, k;
        if (Array.isArray(conf)) {
            for (i = 0; i < conf.length; i += 1) {
                if (conf[i].hasOwnProperty("terminal")) {
                    pathsForTerminals[conf[i].terminal] = { path: pathItems.concat(i), subkey: conf[i].subkey };
                } else {
                    pipe2js.pathsForTerminals(conf[i], pathItems.concat(i), pathsForTerminals);
                }
            }
        } else if (conf.hasOwnProperty('type') && conf.hasOwnProperty('terminal')) {
            pathsForTerminals[conf.terminal] = {path: pathItems.concat([]), subkey: conf.subkey };
        } else if (typeof conf === 'object') {
            for (k in conf) {
                if (conf.hasOwnProperty(k)) {
                    if (conf[k].hasOwnProperty("terminal")) {
                        pathsForTerminals[conf[k].terminal] = { path: pathItems.concat(k), subkey: conf[k].subkey };
                    } else {
                        pipe2js.pathsForTerminals(conf[k], pathItems.concat(k), pathsForTerminals);
                    }
                }
            }
        }

        return pathsForTerminals;
    },

    pipe2decider: function (pipe) {

        /**
         * Build a structure representing the modules (activities) and input and output wires
         */
        var modules = pipe.modules;

        var modulesById = {},
            embeddedModulesById = {};

        modules.forEach(function (m) {
            // Index modules by Id
            modulesById[m.id] = m;

            // initialize wires list
            m.inputWires = [];
            m.outputWires = [];

            if (m.type === "loop") {
                var submodule = m.conf.embed.value;
                embeddedModulesById[submodule.id] = submodule;
                submodule.parentModuleId = m.id;
            }

        });

        var wires = pipe.wires;
        wires.forEach(function (w) {
            modulesById[w.src.moduleid].outputWires.push(w);

            if (modulesById[w.tgt.moduleid]) {
                modulesById[w.tgt.moduleid].inputWires.push(w);
            } else if (embeddedModulesById[w.tgt.moduleid]) {
                modulesById[embeddedModulesById[w.tgt.moduleid].parentModuleId].inputWires.push(w);
            }
        });


        /**
         * Generate decider code
         */

        var deciderCode = [];

        deciderCode.push("/*globals just_started,schedule,scheduled,completed,workflow_input,stop,results,waiting_for */");

        // Modules to run whren just_started = modules with no input wire
        deciderCode.push("if (just_started) {");
        modules.filter(function (m) {
            if (m.inputWires.length === 0) {

                var params = {
                    activityType: m.type,
                    input: pipe2js.conf2input(m.conf)
                };

                deciderCode.push("    schedule(" + JSON.stringify(m.id) + ", " + JSON.stringify(params, null, 4).replace(/\n/g, '\n    ') + ");");
            }
        });
        deciderCode.push("}");



        // For Each module with inputs
        modules.filter(function (m) {
            if (m.inputWires.length > 0) {

                var conditionLine = "if (!scheduled(" + JSON.stringify(m.id) + ")";

                // For each incoming module :
                var incomingValues = {};
                m.inputWires.map(function (w) {
                    var m = modulesById[w.src.moduleid];
                    conditionLine += " && completed(" + JSON.stringify(m.id) + ")";

                    // prepare the incomingValues structure
                    incomingValues[w.tgt.id] = w.src;
                });

                conditionLine += ") {";
                deciderCode.push(conditionLine);

                // walk the m.conf to find "type": "terminal" and remember the path
                // Important: do this before calling conf2input(m.conf) which change the config structure
                var pathsForTerminals = pipe2js.pathsForTerminals(m.conf);

                var params = {
                    activityType: m.type,
                    input: pipe2js.conf2input(m.conf)
                };

                deciderCode.push("    var params = " + JSON.stringify(params, null, 4).replace(/\n/g, '\n    ') + ";");

                // Add the incomingValues
                var k;
                var pathify = function (i) { return '[' + JSON.stringify(i) + ']'; };
                for (k in incomingValues) {
                    if (incomingValues.hasOwnProperty(k)) {
                        var src = incomingValues[k];
                        var pathToItem;
                        // generate path to item
                        if (!pathsForTerminals[k]) {
                            pathToItem = '[' + JSON.stringify(k) + ']';
                        } else {
                            if (pathsForTerminals[k].path.length > 0 && pathsForTerminals[k].path[0] === 'embed') {
                                pathsForTerminals[k].path = ['embed'].concat(pathsForTerminals[k].path.slice(2));
                            }
                            pathToItem = pathsForTerminals[k].path.map(pathify).join('');
                        }

                        var srcPathToItem = [src.id];

                        // if subkey, add it to the path
                        if (!!pathsForTerminals[k] && pathsForTerminals[k].subkey) {
                            srcPathToItem.push(pathsForTerminals[k].subkey);
                        }

                        var srcPathStr = srcPathToItem.map(pathify).join('');

                        deciderCode.push("    params.input" + pathToItem + " = results(" + JSON.stringify(src.moduleid) + ")" + srcPathStr + ";");
                    }
                }

                deciderCode.push("    schedule(" + JSON.stringify(m.id) + ", params);");

                deciderCode.push("}");


                // TODO
                /*if (m.inputWires.length > 1) {
                    deciderCode.push("if ( (scheduled('sw-61') && !completed('sw-61')) || (scheduled('sw-228') && !completed('sw-228')) || (scheduled('sw-232') && !completed('sw-232')) ) {");
                    deciderCode.push("    waiting_for('sw-61', 'sw-228', 'sw-232');"); // TODO: fix in aws-swf, if decisions, dont override this.decisions = [];
                    deciderCode.push("}");
                }*/

            }
        });

        // Stop = module _OUTPUT completed
        // TODO: find the id of the activityType === 'output'
        deciderCode.push("if (completed('_OUTPUT')) {");
        deciderCode.push("    stop('finished !');");
        deciderCode.push("}");

        return deciderCode.join('\n');
    }


};


exports.importPipe = pipe2js.importPipe;
exports.fetchPipe = pipe2js.fetchPipe;
exports.pipe2decider = pipe2js.pipe2decider;
exports.conf2input = pipe2js.conf2input;
exports.pathsForTerminals = pipe2js.pathsForTerminals;
