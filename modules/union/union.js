
exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    var items = input._INPUT || [], k;

    for (k in input) {
        if (input.hasOwnProperty(k)) {
            if (k.indexOf('_OTHER') === 0) {
                items = items.concat(input[k]);
            }
        }
    }

    task.respondCompleted({
        _OUTPUT: items
    });

};

