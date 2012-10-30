var vows = require('vows'),
    assert = require('assert');

var worker = require('./urlinput').worker;

vows.describe('Test urlinput module').addBatch({

    'should urlinput the array': {
        topic: function () {

            var that = this;
            worker({
                config: {
                    input: JSON.stringify({
                        "name": "FeedURL",
                        "prompt": "FeedURL",
                        "position": "",
                        "default": "http://neyric.com/feed",
                        "debug": ""
                    })
                },
                respondCompleted: function (results) {
                    that.callback(null, results);
                }
            });

        },

        'urlinput results': function (err, result) {
            assert.equal(result._OUTPUT, "http://neyric.com/feed");
        }
    }

}).export(module);