var querystring = require('querystring'),
    request = require('request');

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    var search_location = require('../locationbuilder/locationbuilder').search_location;

    search_location(input.default || input.debug, function (response) {

        task.respondCompleted({
            _OUTPUT: response
        });

    });

};

