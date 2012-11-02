#!/usr/bin/env node

var path = require('path'),
    pipe2js = require(path.join(__dirname, '..', 'index'));

function usage() {
    console.log("Usage: pipes2js (pipeId)");
}

if (process.argv.length < 3) {
    usage();
    process.exit(0);
}
var pipeId = process.argv[2];

pipe2js.importPipe(pipeId);
