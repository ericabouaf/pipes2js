
exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    task.respondCompleted({
        _OUTPUT: input._INPUT,
        _OUTPUT2: input._INPUT,
        _OUTPUT3: input._INPUT,
        _OUTPUT4: input._INPUT,
        _OUTPUT5: input._INPUT
    });

};

