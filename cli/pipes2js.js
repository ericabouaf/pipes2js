
var pipe2js = require('../lib/index');

if (process.argv.length < 3) {
    throw "Please provide a pipeId !";
}
var pipeId = process.argv[2];

pipe2js.importPipe(pipeId);
