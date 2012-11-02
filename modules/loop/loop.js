var async = require('async'),
    path = require('path'),
    subkey = require('../../lib/subkey').subkey;

var walk_subkey_values = function (conf, item) {
    var i, k;
    if (Array.isArray(conf)) {
        for (i = 0; i < conf.length; i += 1) {
            if (conf[i].hasOwnProperty('subkey')) {
                conf[i] = subkey(item, conf[i].subkey);
            } else {
                walk_subkey_values(conf[i], item);
            }
        }
    } else if (typeof conf === 'object') {
        for (k in conf) {
            if (conf.hasOwnProperty(k)) {
                if (conf[k].hasOwnProperty('subkey')) {
                    conf[k] = subkey(item, conf[k].subkey);
                } else {
                    walk_subkey_values(conf[k], item);
                }
            }
        }
    }
};

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);
    var submodule = input.embed;
    var activityType = submodule.type;
    var worker = require(path.join(process.cwd(), 'modules', activityType)).worker;

    /*"emit_part": {
      "type": "text",
      "value": "all"
   },
   "mode": {
      "type": "text",
      "value": "assign"
   },
   "assign_part": {
      "type": "text",
      "value": "all"
   },
   "assign_to": {
      "value": "title",
      "type": "text"
   },
    */

    var submoduleJsonConf = JSON.stringify(submodule.conf);
    var loop_results = [];

    async.forEachSeries(input._INPUT, function (item, cb) {

        var submoduleInput = JSON.parse(submoduleJsonConf);

        walk_subkey_values(submoduleInput, item);

        // Handling "with" attribute
        if (input.with) {
            submoduleInput._INPUT = item[input.with];
        } else {
            submoduleInput._INPUT = item;
        }

        worker({
            config: {
                input: JSON.stringify(submoduleInput)
            },

            respondCompleted: function (results) {

                if (Array.isArray(results._OUTPUT)) {
                    loop_results = loop_results.concat(results._OUTPUT);
                } else {
                    loop_results.push(results._OUTPUT);
                }

                item[input.assign_to] = results._OUTPUT;
                cb(null, results);
            }
        });


    }, function () {
        task.respondCompleted({
            _OUTPUT: (input.mode === 'EMIT') ? loop_results : input._INPUT
        });
    });

};

