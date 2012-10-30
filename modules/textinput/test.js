var vows = require('vows'),
    assert = require('assert');

var worker = require('./textinput').worker;

vows.describe('Test textinput module').addBatch({

    'should textinput the array': {
        topic: function () {

            var that = this;
            worker({
                config: {
                    input: JSON.stringify({
                        "name": "Prefix",
                        "prompt": "Prefix: ",
                        "position": "",
                        "default": "This will be legen...",
                        "debug": ""
                    })
                },
                respondCompleted: function (results) {
                    that.callback(null, results);
                }
            });

        },

        'textinput results': function (err, result) {
            assert.equal(result._OUTPUT, "This will be legen...");
        }
    }

}).export(module);