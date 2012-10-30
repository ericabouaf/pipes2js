
var fs = require('fs'),
    path = require('path'),
    vm = require('vm');


if (process.argv.length < 3) {
    console.log('Please provide a pipe');
    process.exit(1);
}


var decide = function (deciderCode, state) {

    var decisions = null;

    var sandbox = {

        just_started: (Object.keys(state).length === 0),

        schedule: function (id, params) {
            if (!decisions) { decisions = []; }
            decisions.push({
                id: id,
                params: params
            });
        },
        scheduled: function (id) {
            return !!state[id];
        },
        waiting_for: function () {
            if (!decisions) { decisions = []; }
        },
        completed: function (id) {
            return !!state[id] && state[id].state === 'completed';
        },
        stop: function () {
        },
        results: function (id) {
            return state[id].results;
        },
        workflow_input: function () {
        }
    };

    vm.runInNewContext(deciderCode, sandbox, 'pipe.vm');
    return decisions;
};



var Task = function (id, cb) {
    this.id = id;
    this.cb = cb;
};
Task.prototype = {
    respondCompleted: function (result) {
        this.cb(this.id, result);
    }
};


var run = function (state, deciderCode, cb) {

    var decisions = decide(deciderCode, state);

    if (!decisions) { return; }

    var respondCompleted = function (id, result) {
        state[id].state = 'completed';
        state[id].results = result;
        run(state, deciderCode, cb);
    };
    var i;
    for (i = 0; i < decisions.length; i += 1) {
        var decision = decisions[i];

        state[decision.id] = {
            state: 'started'
        };

        var activityType = decision.params.activityType;
        var input = JSON.stringify(decision.params.input);

        var task = new Task(decision.id, respondCompleted);
        task.config = {
            input: input
        };

        var worker = require(path.join(process.cwd(), 'modules', activityType)).worker;
        console.log("Running " + decision.id + " (" + activityType + ")");
        worker(task);

        if (decision.id === "_OUTPUT") {
            cb(null, state._OUTPUT.results._OUTPUT, state);
        }
    }

};


var pipe = process.argv[2];
console.log("Running pipe: " + pipe);
var deciderCode = fs.readFileSync(path.join(process.cwd(), 'pipes', pipe, pipe + '.js'), 'utf8');
run({}, deciderCode, function (err, results, state) {
    console.log(JSON.stringify(results, null, 3));
    //console.log(JSON.stringify(state));
});

