var querystring = require('querystring');

var valueFor = function (val, input) {
    var value;
    if (val.hasOwnProperty("value")) {
        value = val.value;
    } else if (val.hasOwnProperty("terminal")) {
        value = input[val.terminal];
    }
    return value;
};

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input),
        url = valueFor(input.BASE, input) + valueFor(input.PATH, input),
        q = {};

    input.PARAM.forEach(function (p) {
        q[p.key.value] = valueFor(p.value, input);
    });

    url += '?' + querystring.stringify(q);

    task.respondCompleted({
        _OUTPUT: url
    });

};

