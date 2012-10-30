var async = require('async'),
    path = require('path');

// Method to walk the submodule config to get the list of incoming wires
var walk_wire_values = function (conf) {
    var terminals = [], i, k;

    if (Array.isArray(conf)) {
        for (i = 0; i < conf.length; i += 1) {
            terminals = terminals.concat(walk_wire_values(conf[i]));
        }
    } else {
        for (k in conf) {
            if (conf.hasOwnProperty(k)) {
                if (k === "terminal") {
                    terminals.push(conf[k]);
                } else if (typeof conf[k] === "object") {
                    terminals = terminals.concat(walk_wire_values(conf[k]));
                }
            }
        }
    }
    return terminals;
};

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    var submodule = input.embed.value;

    var activityType = submodule.type;
    var worker = require(path.join(process.cwd(), 'modules', activityType)).worker;

    // Wires incoming to the submodule :
    var terminals = walk_wire_values(submodule.conf);


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

        // Copy wires values into new config
        terminals.forEach(function (t) {
            submoduleInput[t] = input[t];
        });

        // add item values
        submoduleInput.item = item;

        worker({
            config: {
                input: JSON.stringify(submoduleInput)
            },

            respondCompleted: function (results) {

                loop_results.push(results._OUTPUT);
                item[input.assign_to.value] = results._OUTPUT;

                cb(null, results);
            }
        });


    }, function () {

        task.respondCompleted({
            _OUTPUT: input._INPUT // TODO: or return loop_results
        });

    });

};

