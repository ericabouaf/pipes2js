
var valueFor = function (val, input) {
    var value;
    if (typeof val === 'number') {
        value = val;
    } else if (val.hasOwnProperty("value")) {
        value = val.value;
    } else if (val.hasOwnProperty("terminal")) {
        value = input[val.terminal];
    }
    return value;
};

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    var length = valueFor(input.count);

    task.respondCompleted({
        _OUTPUT: input._INPUT.slice(0, length)
    });

};

