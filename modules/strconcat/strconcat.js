
var valueFor = function (val, input) {
    var value;
    if (val.hasOwnProperty("value")) {
        value = val.value;
    } else if (val.hasOwnProperty("terminal")) {
        value = input[val.terminal];
    } else if (val.hasOwnProperty("subkey")) {
        value = input.item[val.subkey];
    }
    return value;
};

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input),
        t = "";

    input.part.forEach(function (p) {
        t += valueFor(p, input);
    });

    task.respondCompleted({
        _OUTPUT: t
    });

};

