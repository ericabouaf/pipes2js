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
        base = valueFor(input.BASE, input),
        url_path = valueFor(input.PATH, input),
        url = base + ((base.length > 0 && base[base.length - 1] !== '/' && url_path.length > 0 && url_path[0] !== '/') ? '/' : '') + url_path,
        q = {};

    input.PARAM.forEach(function (p) {
        q[p.key.value] = valueFor(p.value, input);
    });

    url += '?' + querystring.stringify(q);

    task.respondCompleted({
        _OUTPUT: url
    });

};

