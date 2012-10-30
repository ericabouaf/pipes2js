var vows = require('vows'),
    assert = require('assert');

var worker = require('./uniq').worker;

vows.describe('Test uniq module').addBatch({

    'should uniq the array': {
        topic: function () {

            var that = this;
            worker({
                config: {
                    input: JSON.stringify({
                        _INPUT: [
                            {
                                guid: '12345',
                                title: 'First post'
                            },
                            {
                                guid: '123456',
                                title: 'Second post'
                            },
                            {
                                guid: '12345',
                                title: 'First post bis'
                            }
                        ],
                        field: 'guid'
                    })
                },
                respondCompleted: function (results) {
                    that.callback(null, results);
                }
            });

        },

        'uniq results': function (err, result) {
            assert.equal(result._OUTPUT.length, 2);


            assert.equal(result._OUTPUT[0].guid, '12345');
            assert.equal(result._OUTPUT[0].title, 'First post');
            assert.equal(result._OUTPUT[0]['y:repeatcount'], 2);

            assert.equal(result._OUTPUT[1].guid, '123456');
            assert.equal(result._OUTPUT[1].title, 'Second post');
            assert.equal(result._OUTPUT[1]['y:repeatcount'], 1);
        }
    }

}).export(module);