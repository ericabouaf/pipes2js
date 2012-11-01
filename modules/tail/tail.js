
exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    var items = input._INPUT;

    task.respondCompleted({
        _OUTPUT: items.slice(items.length - input.count)
    });

};
