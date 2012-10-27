
var request = require('request'),
    xml2js = require('xml2js-expat');

var valueFor = function (val, input) {
    var value;
    if (val.hasOwnProperty("value")) {
        value = val.value;
    } else if (val.hasOwnProperty("terminal")) {
        value = input[val.terminal];
    }
    return value;
};


exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input),
        url = valueFor(input.URL, input);

    console.log(url);

    request(url, function (error, response, body) {

        console.log("Got response. Code = " + response.statusCode);

        if (!error && response.statusCode === 200) {
            var r = body;
            var contentType = response.headers["content-type"].split(';')[0];
            if (contentType) {

                console.log("contentType = " + contentType);

                // Parsing JSON
                var json_content_types = ["application/json", "text/javascript", "application/javascript"];
                if (json_content_types.indexOf(contentType) !== -1) {
                    r = JSON.parse(body);
                }

                // Parsing XML
                if (contentType === "text/xml") {
                    var parser = new xml2js.Parser();
                    parser.addListener('end', function (r) {

                        var result = r.channel.item;

                        // TODO: beurk
                        if (JSON.stringify(result).length > 32768) {
                            result = result.slice(0, 3);
                        }

                        task.respondCompleted(result);
                    });
                    parser.parseString(body);
                    return;
                }
            }

            task.respondCompleted(r);
        }
    });


};

