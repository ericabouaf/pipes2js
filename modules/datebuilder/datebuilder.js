var strftime = require('strftime');

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    var utime = Date.parse(input.DATE);
    var d = new Date(utime);

    var n = d.getDate();
    var suff = ["th", "st", "nd", "rd", "th"]; // suff for suffix
    var ord = n < 21 ? (n < 4 ? suff[n] : suff[0]) : (n % 10 > 4 ? suff[0] : suff[n % 10]);


    var response = {
        "hour": d.getHours(),
        "timezone": strftime("%Z", d),
        "second": d.getSeconds(),
        "month": d.getMonth() + 1,
        "month_name": strftime("%B", d),
        "minute": d.getMinutes(),
        "utime": utime / 1000,
        "day": n,
        "day_ordinal_suffix": ord,
        "day_of_week": d.getDay(),
        "day_name": strftime("%A", d),
        "year": d.getFullYear()
    };

    task.respondCompleted({
        _OUTPUT: response
    });

};

