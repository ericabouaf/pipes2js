
exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    var items = input._INPUT;

    for(var k in input) {
        if (k.indexOf('_OTHER') === 0) {
            items = items.concat(input[k]);
        }
    }

    task.respondCompleted({
        _OUTPUT: items
    });

};

