var querystring = require('querystring'),
    request = require('request');

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    var url = 'http://maps.googleapis.com/maps/api/geocode/json';

    var q = {
        sensor: 'false',
        address: input.default || input.debug
    };

    url += '?' + querystring.stringify(q);


    request(url, function (error, response, body) {

        var gmapsResults = JSON.parse(body).results[0];

        // TODO
        //console.log(JSON.stringify(gmapsResults, null, 3));

        var response = {
            "country": "United States",
            "postal": "44114",
            "state": "OH",
            "city": "Cleveland",
            "lat": "41.508315",
            "lon": "-81.681363",
            "quality": "60"
        };

        task.respondCompleted({
            _OUTPUT: response
        });

    });

    
};

