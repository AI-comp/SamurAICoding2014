var Runner = require('./runner').Runner;

module.exports = function (ws) {

    /*var id = setInterval(function() {
        ws.send(JSON.stringify(process.memoryUsage()), function() { });
    }, 1000);
    console.log('started client interval');*/

    ws.on('message', function (message) {
        var data = JSON.parse(message);
        var runner = new Runner(data.commands, data.workingDirs, data.seed);
        runner.runGame(function () {
            var response = JSON.stringify(runner.gameResult);
            ws.send(response, function () { /* No error handling yet */ });
        });
    });

    ws.on('close', function () {
        console.log('Closing WS connection');
    });

};