# pipes2js

Compile Yahoo! Pipes to Javascript (Node.js)


## Design

This tool lets you import Yahoo! Pipes and run them on any machine with Node.js.

The pipe is converted to a javascript file, called *decider.js*, which controls the execution logic of the workflow.

Each Yahoo module is coded as a separate Javascript module.

 * The pipe can be executed localy through a simple run engine (called by the generated run.js)
 * or executed on Amazon SimpleWorkflow (SWF)
 * The rsulting modules can be used for other Amazon SWF projects through the [aws-swf library](https://github.com/neyric/aws-swf)

## Installation

    $ [sudo] npm install -g pipes2js

## Usage

Import the pipe :

    $ pipes2js xOE_1Z8C3RGmkQrul7okhQ

This will create a pipes/xOE_1Z8C3RGmkQrul7okhQ/ directory, which contains an npm package.
The resulting package depends on the pipes2js package. Let's install it :

    $ cd pipes/xOE_1Z8C3RGmkQrul7okhQ/
    $ npm install .

You can then run it :

    $ node run.js

## More

[Current module implementations](https://github.com/neyric/pipes2js/wiki/Yahoo-Pipes-modules)

[EXPERIMENTAL: Running imported pipes on Amazon SimpleWorkflow (SWF)](https://github.com/neyric/pipes2js/wiki/Running-on-Amazon-SimpleWorkflow-SWF)

## Tests

Run tests :


    npm test


will perform :


    vows --spec modules/*/test.js tests/*


 [![build status](https://secure.travis-ci.org/neyric/pipes2js.png)](http://travis-ci.org/neyric/pipes2js)

 
## Credits

Inspired by [pipe2py](https://github.com/ggaughan/pipe2py)

