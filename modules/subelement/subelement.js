
var subkey = require('../../lib/subkey').subkey;

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    var items = input._INPUT;

    var results = items.map(function (item) {
        return {
            content: subkey(item, input.path)
        };
    });

    task.respondCompleted({
        _OUTPUT: results
    });

};
