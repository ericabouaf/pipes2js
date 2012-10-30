
var apply_rule = function (item, rule) {

    var destPath = rule.newval.split('.');
    var val = item[rule.field];

    var dest = item, i;
    if (destPath.length > 1) {
        for (i = 0; i < destPath.length - 1; i += 1) {
            if (!dest[destPath[i]]) {
                dest[destPath[i]] = {};
            }
            dest = dest[destPath[i]];
        }
    }

    dest[destPath[destPath.length - 1]] = val;

    if (rule.op === 'copy') {
        //dest[destPath[destPath.length - 1]] = val;
    } else if (rule.op === 'rename') {
        delete dest[rule.field];
    } else {
        throw 'unknown op ' + rule.op;
    }

};


exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    /*
    "RULE": [
                {
                    "field": "title",
                    "op": "copy",
                    "newval": "extra.originaltitle"
                },
                {
                    "field": "title",
                    "op": "copy",
                    "newval": "extra.creator"
                }
            ]
    */

    input._INPUT.forEach(function (item) {
        input.RULE.forEach(function (rule) {
            apply_rule(item, rule);
        });
    });


    task.respondCompleted({
        _OUTPUT: input._INPUT
    });

};
