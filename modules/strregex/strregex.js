
var apply_rule = function (str, rule) {
    str = str.replace(new RegExp(rule.match/*, "g"*/), rule.replace);
    return str;
};

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    var str = input._INPUT;

    input.RULE.forEach(function (rule) {
        str = apply_rule(str, rule);
    });

    task.respondCompleted({
        _OUTPUT: str
    });

};
