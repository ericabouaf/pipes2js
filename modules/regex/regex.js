
var apply_rule = function (item, rule) {

    var destPath = rule.field.split('.');
    var src = item, i;

    if (destPath.length > 1) {
        for (i = 0; i < destPath.length - 1; i += 1) {
            src = src[destPath[i]];
        }
    }

    var lastKey = destPath[destPath.length - 1];

    if (rule.replace) {
        src[lastKey] = src[lastKey].replace(new RegExp(rule.match), rule.replace);
    }

};

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    input._INPUT.forEach(function (item) {
        input.RULE.forEach(function (rule) {
            apply_rule(item, rule);
        });
    });


    task.respondCompleted({
        _OUTPUT: input._INPUT
    });

};
