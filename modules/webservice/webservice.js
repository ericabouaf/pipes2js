
var request = require('request');

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    request({
        method: 'POST',
        url: input.url,
        form: {data: JSON.stringify(input._INPUT)}
    }, function (error, response, body) {

        var r = JSON.parse(body);
        var items = r[input.path]; // TODO: lame

        task.respondCompleted({
            _OUTPUT: items
        });

    });

};

