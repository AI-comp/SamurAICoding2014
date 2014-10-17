var Runner = require('./runner').Runner,
    _ = require('underscore');
var argv = require('optimist')
    .string('a')
    .string('w')
    .string('r')
    .string('p')
    .string('u')
    .argv;

var numAIs = 4;
var aiCommands = argv.a,
    workingDirs = argv.w,
    seed = parseInt(argv.r);
    pauseCommands = argv.p,
    unpauseCommands = argv.u,
aiCommands = fixArgument(aiCommands, 'node SampleAI/JavaScript/SampleAI.js', numAIs);
workingDirs = fixArgument(workingDirs, '', numAIs);
pauseCommands = fixArgument(pauseCommands, '', numAIs);
unpauseCommands = fixArgument(unpauseCommands, '', numAIs);

console.warn('AI Commands: ' + JSON.stringify(aiCommands));
console.warn('Working Dirs: ' + JSON.stringify(workingDirs));
console.warn('Pause Commands: ' + JSON.stringify(pauseCommands));
console.warn('Unpause Commands: ' + JSON.stringify(unpauseCommands));

var runner = new Runner(aiCommands, workingDirs, seed, pauseCommands, unpauseCommands);
runner.runGame(function () {
    console.log(JSON.stringify(runner.gameResult));
});

function fixArgument(argument, defaultValue, numAIs) {
    var fixedArgument = argument || [];
    if (!_.isArray(fixedArgument)) {
        fixedArgument = [fixedArgument];
    }
    while (fixedArgument.length < numAIs) {
        fixedArgument.push(defaultValue);
    }
    return fixedArgument;
}
