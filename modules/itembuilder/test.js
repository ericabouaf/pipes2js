var vows = require('vows'),
    assert = require('assert');

var worker = require('./itembuilder').worker;

vows.describe('Test itembuilder module').addBatch({

    'should create an item': {
        topic: function () {

            var that = this;
            worker({
                config: {
                    input: JSON.stringify({
                        attrs: [
                            {
                                key: 'foo',
                                value: 'bar'
                            }
                        ]
                    })
                },
                respondCompleted: function (results) {
                    that.callback(null, results);
                }
            });

        },

        'itembuilder results': function (err, result) {
            assert.equal(result._OUTPUT[0].foo, 'bar');
        }
    }

}).export(module);