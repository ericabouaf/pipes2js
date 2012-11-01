
var request = require('request'),
    querystring = require('querystring');

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    var q = {
        q: input.yqlquery,
        format: "json",
        diagnostics: (input.raw === "results") ? "false" : "true",
        callback: "",
        env: input.envURL
    };

    var url = "http://query.yahooapis.com/v1/public/yql?" + querystring.stringify(q);

    request(url, function (error, response, body) {

        console.log("Got response. Code = " + response.statusCode);

        if (!error && response.statusCode === 200) {

            var results = JSON.parse(body);
            if (input.raw === 'results') {
                results = results.query.results;
                results = results[Object.keys(results)[0]];
                results = results.map(function (i) {
                    if (typeof i === 'object' && i.hasOwnProperty('content')) {
                        return {content: i.content};
                    }
                    return {content: i};
                });
            }

            task.respondCompleted({
                _OUTPUT: results
            });

        }
    });


};

