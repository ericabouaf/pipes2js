
exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input),
        result = {
            _OUTPUT: input._INPUT
        };

    task.respondCompleted(result);

};

