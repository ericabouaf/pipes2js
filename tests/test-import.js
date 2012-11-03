var vows = require('vows'),
    assert = require('assert');

var pipe2js = require('../index');

vows.describe('Test conf2input method').addBatch({

    'should simplify the config': {
        topic: function () {

            return pipe2js.conf2input({
                "attrs": [
                    {
                        "key": {
                            "value": "guid",
                            "type": "text"
                        },
                        "value": {
                            "value": "1932",
                            "type": "text"
                        }
                    },
                    {
                        "key": {
                            "value": "title",
                            "type": "text"
                        },
                        "value": {
                            "value": "First post",
                            "type": "text"
                        }
                    }
                ],
                "field": {
                    "value": "name",
                    "type": "text"
                }
            });

        },

        'conf2input results': function (input) {
            assert.equal(input.attrs[0].key, 'guid');
            assert.equal(input.attrs[0].value, '1932');

            assert.equal(input.attrs[1].key, 'title');
            assert.equal(input.attrs[1].value, 'First post');

            assert.equal(input.field, 'name');
        }
    }

}).export(module);