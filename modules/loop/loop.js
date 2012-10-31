var async = require('async'),
    path = require('path');

var getItemSubkey = function (item, subkey) {

    var destPath = subkey.split('.');
    var src = item, i;

    if (destPath.length > 1) {
        for (i = 0; i < destPath.length - 1; i += 1) {
            src = src[destPath[i]];
        }
    }

    return src[destPath[destPath.length - 1]];
};

var walk_subkey_values = function (conf, item) {
    var i, k;
    if (Array.isArray(conf)) {
        for (i = 0; i < conf.length; i += 1) {
            if (conf[i].hasOwnProperty('subkey')) {
                conf[i] = getItemSubkey(item, conf[i].subkey);
            } else {
                walk_subkey_values(conf[i], item);
            }
        }
    } else if (typeof conf === 'object') {
        for (k in conf) {
            if (conf.hasOwnProperty(k)) {
                if (conf[k].hasOwnProperty('subkey')) {
                    conf[k] = getItemSubkey(item, conf[k].subkey);
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

        // Handling with attribute
        console.log("TODO, with:", input.with);
        if (input.with) {
          submoduleInput._INPUT = item[input.with];
        }

        worker({
            config: {
                input: JSON.stringify(submoduleInput)
            },

            respondCompleted: function (results) {
                loop_results.push(results._OUTPUT);
                item[input.assign_to] = results._OUTPUT;
                cb(null, results);
            }
        });


    }, function () {
        task.respondCompleted({
            _OUTPUT: input._INPUT // TODO: or return loop_results
        });
    });

};

