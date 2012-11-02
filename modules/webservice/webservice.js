
var request = require('request');
var subkey = require('../../lib/subkey').subkey;

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    request({
        method: 'POST',
        url: input.url,
        form: {data: JSON.stringify(input._INPUT)}
    }, function (error, response, body) {

        var r = JSON.parse(body);
        var items = subkey(r, input.path);

        task.respondCompleted({
            _OUTPUT: items
        });

    });

};

