
var request = require('request'),
    htmlparser = require("htmlparser"),
    async = require('async'),
    xml2js = require('xml2js-expat');

var feed_auto_discovery = function (url, cb) {
    request(url,  function (error, response, body) {
        var handler = new htmlparser.DefaultHandler(function (err, dom) {
            if (err) {
                cb(err, []);
            } else {
                var links = htmlparser.DomUtils.getElements({tag_name: 'link', rel: "alternate", type: 'application/rss+xml' }, dom);

                var urls = links.map(function (l) {
                    return l.attribs.href;
                });

                cb(null, urls);
            }
        }, { verbose: false, ignoreWhitespace: true });
        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(body);
    });
};
exports.feed_auto_discovery = feed_auto_discovery;

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    // fetch must be able to get multiple URLs 
    var urls = [];
    if (Array.isArray(input.URL)) {
        input.URL.forEach(function (u) {
            urls.push(u);
        });
    } else {
        urls.push(input.URL);
    }

    var feed_urls = [];
    async.forEachSeries(urls, function (url, cb) {

        feed_auto_discovery(url, function (err, results) {
            if (results.length > 0) {
                feed_urls.push(results[0]);
            }
            cb(err, results);
        });

    }, function () {

        var fetch_feeds = require('../fetch/fetch').fetch_feeds;

        console.log(feed_urls);

        fetch_feeds(feed_urls, function (err, items) {
            task.respondCompleted({
                _OUTPUT: items
            });
        });
        
    });

};

