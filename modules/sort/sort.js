var subkey = require('../../lib/subkey').subkey;

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input),
        results = input._INPUT;

    //input.KEY.forEach(function (sortKey) {

    // TODO: currently handling only first sort field

    var sortKey = input.KEY[0];

        var sort_order = (sortKey.dir === 'ASC') ? -1 : 1;
        results = results.sort(function (a, b) {
            var valA = subkey(a, sortKey.field),
                valB = subkey(b, sortKey.field);
            return (valA < valB ? 1 : -1) * sort_order;
        });

    //});


    task.respondCompleted({
        _OUTPUT: results
    });

};
