
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

            task.respondCompleted({
                _OUTPUT: JSON.parse(body)
            });

        }
    });


};

