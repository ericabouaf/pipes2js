
exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    task.respondCompleted({
        _OUTPUT: input._INPUT.split(input["to-str"]).map(function (i) { return {content: i}; })
    });

};
