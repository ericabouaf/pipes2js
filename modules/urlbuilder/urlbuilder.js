var querystring = require('querystring');

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input),
        base = input.BASE,
        url_path = input.PATH,
        url = base + ((base.length > 0 && base[base.length - 1] !== '/' && url_path.length > 0 && url_path[0] !== '/') ? '/' : '') + url_path,
        q = {};

    input.PARAM.forEach(function (p) {
        q[p.key] = p.value;
    });

    url += '?' + querystring.stringify(q);

    task.respondCompleted({
        _OUTPUT: url
    });

};

