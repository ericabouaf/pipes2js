

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    var a = input._INPUT,
        b = parseFloat(input.OTHER),
        op = input.OP;

    var result;
    
    if (op === 'modulo') {
        result = a % b;
    } else if (op === 'subtract') {
        result = a - b;
    } else {
        throw "OP not known: " + op;
    }

    task.respondCompleted({
        _OUTPUT: result
    });

};

