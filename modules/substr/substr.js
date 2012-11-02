
exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    var str = input._INPUT;

    task.respondCompleted({
        _OUTPUT: str.substr(input.from, input.length)
    });

};
