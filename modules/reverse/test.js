var vows = require('vows'),
    assert = require('assert');

var worker = require('./reverse').worker;

vows.describe('Test reverse module').addBatch({

    'should reverse the array': {
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

        'reverse results': function (err, result) {
            assert.equal(result._OUTPUT[0], 3);
            assert.equal(result._OUTPUT[1], 2);
            assert.equal(result._OUTPUT[2], 1);
        }
    }

}).export(module);