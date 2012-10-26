
var request = require('request'),
    xml2js = require('xml2js-expat');

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);
    var url = input.URL.value;

	request(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var r = body;
            var contentType = response.headers["content-type"].split(';')[0];
            if (contentType) {

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
                            result = result.slice(2);
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

