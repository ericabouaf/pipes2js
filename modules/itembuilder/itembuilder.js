/*

var valueFor = function (val, input) {
    var value;
    if (val.hasOwnProperty("value")) {
        value = val.value;
    } else if (val.hasOwnProperty("terminal")) {
        value = input[val.terminal];
    }
    return value;
};
*/

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    var item = {},
        k;

    for (k in input.attrs) {
        if (input.attrs.hasOwnProperty(k)) {
            item[input.attrs[k].key] = input.attrs[k].value;
        }
    }

    task.respondCompleted({
        _OUTPUT: [item]
    });

};

