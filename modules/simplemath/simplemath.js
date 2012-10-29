
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

    var a = input._INPUT,
        b = parseFloat(valueFor(input.OTHER, input)),
        op = input.OP.value;

    var result;
    if (op === 'modulo') {
        result = a % b;
    }
    else if (op === 'subtract') {
        result = a - b;
    }
    else {
        throw "OP not known: "+op;
    }

    task.respondCompleted({
        _OUTPUT: result
    });

};

