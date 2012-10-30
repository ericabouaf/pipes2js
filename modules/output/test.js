var vows = require('vows'),
    assert = require('assert');

var worker = require('./output').worker;

vows.describe('Test output module').addBatch({

    'should return the same value': {
        topic: function () {

            var that = this;
            worker({
                config: {
                    input: JSON.stringify({
                        _INPUT: "foo-bar"
                    })
                },
                respondCompleted: function (results) {
                    that.callback(null, results);
                }
            });

        },

        'output results': function (err, result) {
            assert.equal(result._OUTPUT, 'foo-bar');
        }
    }

}).export(module);