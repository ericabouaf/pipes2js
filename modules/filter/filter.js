
var subkey = require('../../lib/subkey').subkey;

var apply_rule = function (item, rule) {

    var a = subkey(item, rule.field),
        b = rule.value;

    if (rule.op === 'contains') {
        return a.match(b);
    } else if (rule.op === 'doesnotcontain') {
        return !a.match(b);
    } else if (rule.op === 'matches') {
        return a.match(new RegExp(b));
    } else if (rule.op === 'greater') {
        return a > b;
    } else if (rule.op == 'is') {
        return a == b;
    } else if (rule.op === 'less') {
        return a < b;
    } else {
        // TODO: after
        //       before
        throw "unknown op "+rule.op;
    }

};

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    var results = [];
    var combineFcts = {
        'or': function(a,b) { return !!a || !!b; },
        'and': function(a,b) { return !!a && !!b; }
    };

    input._INPUT.forEach(function (item) {

        var rules_matches = input.RULE.map(function (rule) {
            return apply_rule(item, rule);
        });

        var matching = rules_matches.reduce(combineFcts[input.COMBINE]);

        if ( (matching && input.MODE === "permit") || (input.MODE === 'block' && !matching) ) {
            results.push(item);
        }
    });

    task.respondCompleted({
        _OUTPUT: results
    });

};
