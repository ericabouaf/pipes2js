# AWS-SWF Pipes import

WARNING: EXPERIMENTAL !!

Transform Yahoo! pipes into Amazon Simple Workflows (SWF)

## Usage

First we need to register a domain :

````sh
$ swf-register -k domain aws-swf-pipes-import
````

Finally, we will register all activity types for pipes :

````sh
$ cd modules
$ swf-register
````

### Step1: register all components

Import the pipe into a workflow :

````sh
$ node import.js 59738c010bb144a36d54a1697aab7d0d
````

Then, register the workflow :

````sh
$ swf-register -k workflow 59738c010bb144a36d54a1697aab7d0d
````


### Step2: run the decider, and the activity poller

Launch a decider Poller:

````sh
$ cd pipes/
$ swf-decider
````

Launch an Activity Poller:

````sh
$ cd modules/
$ swf-activity
````

### Step3: Start the workflow !

````sh
$ swf-start 59738c010bb144a36d54a1697aab7d0d
````
