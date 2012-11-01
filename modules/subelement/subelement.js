
exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    var items = input._INPUT;

    var results = items.map(function (item) {
        return {
            content: item[input.path] // TODO: path may contain '.'
        };
    });

    task.respondCompleted({
        _OUTPUT: results
    });

};
