# pipes2js

Compile Yahoo! Pipes to Javascript (Node.js)


## Design

This tool lets you import Yahoo! Pipes into a custom script written in javascript, which controls the execution logic of the workflow.

This has two advantages :

 * The resulting workflow can be executed on Amazon SimpleWorkflow (SWF)
 * The modules developed for this experiment can be used for other Amazon SWF projects



## More

[Running on Amazon SimpleWorkflow (SWF)](https://github.com/neyric/pipes2js/wiki/Running-on-Amazon-SimpleWorkflow-SWF)

[Current module implementations](https://github.com/neyric/pipes2js/wiki/Yahoo-Pipes-modules)


## Tests


Run tests :


    npm test


will perform :


    vows --spec modules/*/test.js tests/*


 [![build status](https://secure.travis-ci.org/neyric/pipes2js.png)](http://travis-ci.org/neyric/pipes2js)

 