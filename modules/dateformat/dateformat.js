var strftime = require('strftime');

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    var d;
    if (typeof input._INPUT === 'object') {
        var pipesDate = input._INPUT;
        d = new Date(pipesDate.year, pipesDate.month - 1, pipesDate.day, pipesDate.hour, pipesDate.minute, pipesDate.second);
    } else {
        var utime = Date.parse(input._INPUT);
        d = new Date(utime);
    }

    var str = strftime(input.format, d);

    task.respondCompleted({
        _OUTPUT: str
    });

};

