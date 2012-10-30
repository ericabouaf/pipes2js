var vows = require('vows'),
    assert = require('assert');

var worker = require('./locationinput').worker;

vows.describe('Test locationinput module').addBatch({

    'should get a location': {
        topic: function () {

            var that = this;
            worker({
                config: {
                    input: JSON.stringify({
                        "name": "locationinput1",
                        "prompt": "ZipCode:",
                        "position": "2",
                        "default": "44114",
                        "debug": "44114"
                    })
                },
                respondCompleted: function (results) {
                    that.callback(null, results);
                }
            });

        },

        'locationinput results': function (err, result) {

            assert.equal(result._OUTPUT.country, 'United States');
// TODO
/*country United States
lat 41.508315
postal 44114
state OH
city Cleveland
lon -81.681363
quality 60
*/
        }
    }

}).export(module);