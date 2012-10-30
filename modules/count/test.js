var vows = require('vows'),
    assert = require('assert');

var worker = require('./count').worker;

vows.describe('Test count module').addBatch({

    'should return 3': {
        topic: function () {

            var that = this;
            worker({
                config: {
                    input: JSON.stringify({
                        _INPUT: [1, 2, 3]
                    })
                },
                respondCompleted: function (results) {
                    that.callback(null, results);
                }
            });

        },

        'count results': function (err, result) {
            assert.equal(result._OUTPUT, 3);
        }
    }

}).export(module);