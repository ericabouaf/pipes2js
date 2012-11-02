
var fs = require('fs'),
    path = require('path');

if (process.argv.length < 3) {
    console.log('Please provide a pipe');
    process.exit(1);
}


var pipe = process.argv[2];

console.log("Running pipe: " + pipe);

var deciderCode = fs.readFileSync(path.join(process.cwd(), 'pipes', pipe, pipe + '.js'), 'utf8');

var run = require('../lib/engine').run;

run({}, deciderCode, function (err, results, state) {

    console.log(JSON.stringify(results, null, 3));

});

