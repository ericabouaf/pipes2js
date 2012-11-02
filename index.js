
var engine = require('./lib/engine'),
    importPipe = require('./lib/import-pipe');

exports.run = engine.run;

exports.importPipe = importPipe.importPipe;
exports.fetchPipe = importPipe.fetchPipe;
exports.pipe2decider = importPipe.pipe2decider;
exports.conf2input = importPipe.conf2input;
exports.pathsForTerminals = importPipe.pathsForTerminals;
