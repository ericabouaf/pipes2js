var vows = require('vows'),
    assert = require('assert');

var subkey = require('../lib/subkey').subkey;

vows.describe('Test subkey method').addBatch({

    'should get the subkey': {
        topic: function () {

            return subkey({
                "attrs": {
                    "key": {
                        "value": "guid",
                        "type": "text"
                    },
                    "value": {
                        "value": "1932",
                        "type": "text"
                    }
                }
            }, "attrs.key.value");

        },

        'subkey results': function (result) {
            assert.equal(result, 'guid');
        }
    }

}).export(module);