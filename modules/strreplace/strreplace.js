
function replaceLastInstance(find, replace, str) {
    var charpos = str.lastIndexOf(find);
    if (charpos < 0) { return str; }
    var ptone = str.substring(0, charpos);
    var pttwo = str.substring(charpos + find.length);
    return ptone + replace + pttwo;
}

var apply_rule = function (str, rule) {

    var modifiers;
    if (rule.param === "1") {
        str = str.replace(rule.find, rule.replace);
    } else if (rule.param === "2") {
        str = replaceLastInstance(rule.find, rule.replace, str);
    } else if (rule.param === "3") {
        str = str.replace(new RegExp(rule.find, "g"), rule.replace);
    }

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
