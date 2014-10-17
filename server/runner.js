var _ = require('underscore'),
    spawn = require('child_process').spawn,
    exec = require('child_process').exec,
    Game = require('../game/game.js').Game,
    asyncblock = require('asyncblock');

function AI(executionCommand, parameters, wholeExecutionCommand, workingDir, pauseCommand, unpauseCommand, index, addLog) {
    this.pauseCommand = pauseCommand;
    this.unpauseCommand = unpauseCommand;
    this.index = index;
    this.addLog = addLog;
    this.commands = [];
    this.ready = false;
    this.available = true;
    this.timeout = null;
    this.clearEventHandlers();

    this.process = spawn(executionCommand, parameters, { cwd: workingDir });

    var self = this;

    this.process.stdout.on('data', function (data) {
        self.addLog('AI' + self.index + '>>' + 'STDOUT: ' + data);
        self.onStdout(data);
    });

    this.process.stderr.on('data', function (data) {
        self.addLog('AI' + self.index + '>>' + 'STDERR: ' + data, self.index);
    });

    this.process.on('close', function (code) {
        self.addLog('AI' + self.index + '>>' + 'Child process exited with code ' + code);
        self.clearTimer();
        self.available = false;
        self.onExit();
    });

    this.process.on('error', function (error) {
        console.error(error);
        self.addLog('AI' + self.index + '>>' + 'Failed to run "' + wholeExecutionCommand + '"', self.index);
        self.available = false;
    });
}

AI.prototype.setTimer = function (timeLimit) {
    var self = this;
    self.clearTimer();
    self.timeout = setTimeout(function () {
        self.addLog('AI' + self.index + '>>' + 'Killing due to TLE');
        self.process.kill('SIGINT');
    }, timeLimit);
};

AI.prototype.clearTimer = function () {
    clearTimeout(this.timeout);
    this.timeout = null;
};

AI.prototype.pause = function (callback, self) {
    this.executeCommand(this.pauseCommand, callback, self);
};

AI.prototype.unpause = function (callback, self) {
    this.executeCommand(this.unpauseCommand, callback, self);
};

AI.prototype.executeCommand = function (command, callback, self) {
    asyncblock(function (flow) {
        if (command) {
            exec(command, flow.add());
            flow.wait();
        }
        if (callback) {
            callback.call(self || this);
        }
    });
};

AI.prototype.clearEventHandlers = function () {
    this.onStdout = function (data) { };
    this.onExit = function () { };
}

AI.prototype.write = function (message) {
    try {
        this.process.stdin.write(message);
    } catch (error) {
        // we'll receive a 'close' message soon
    }
};

function Runner(executionCommands, workingDirs, seed, pauseCommands, unpauseCommands) {
    this.executionCommands = executionCommands;
    var defaultArray = _.map(executionCommands, function () {
        return undefined;
    });
    this.workingDirs = workingDirs || defaultArray;
    this.seed = isNaN(seed) ? undefined : seed;
    this.pauseCommands = pauseCommands || defaultArray;
    this.unpauseCommands = unpauseCommands || defaultArray;
}

Runner.LOG_FOR_EVERYONE = -1;

Runner.prototype.runGame = function (done) {
    var self = this;

    this.done = done;
    var seed = this.seed || new Date().getTime();
    this.game = new Game(seed);
    this.game.initialize();

    this.gameResult = {
        log: [],
        winner: '',
        replay: {
            seed: seed,
            commands: [],
        },
    };

    this.ais = [];
    _(this.game.getNumPlayers()).times(function (i) {
        var commandAndParameters = this.executionCommands[i].split(' ');
        var command = _.first(commandAndParameters);
        var parameters = _.rest(commandAndParameters);
        this.ais.push(new AI(command, parameters, this.executionCommands[i], this.workingDirs[i], this.pauseCommands[i], this.unpauseCommands[i], i, function (message, aiIndex) {
            addLog.call(self, message, aiIndex);
        }));
    }, this);

    _.each(getAvailableAIs.call(this), function (ai) {
        ai.onStdout = function (data) {
            if (data.toString().trim().toLowerCase() == 'ready') {
                ai.ready = true;
                ai.clearTimer();
                onReadyForBeginning.call(self);
            }
        };
        ai.onExit = function () {
            onReadyForBeginning.call(self);
        }
        ai.setTimer(5000);
    });
};

function onReadyForBeginning() {
    if (isEveryoneReady.call(this)) {
        _.each(this.ais, function (ai) {
            ai.clearEventHandlers();
        }, this);

        pauseAIs.call(this, function () {
            beginTurn.call(this);
        });
    }
}

function isEveryoneReady() {
    return _.isEmpty(getUnreadyAIs.call(this));
}

function addLog(logMessage, aiIndex) {
    if (aiIndex === undefined) {
        aiIndex = Runner.LOG_FOR_EVERYONE;
    }
    this.gameResult.log.push({ target: aiIndex, message: logMessage.trim() });
}

function onReady() {
    if (isEveryoneReady.call(this)) {
        var commands = _.map(this.ais, function (ai) {
            return ai.commands;
        });
        this.game.processTurn(commands);
        addLog.call(this, 'Turn finished. Game status:');
        addLog.call(this, this.game.getStatus());

        if (this.game.isFinished()) {
            finish.call(this);
        } else {
            beginTurn.call(this);
        }
    } else {
        processNextAI.call(this);
    }
}

function beginTurn() {
    addLog.call(this, '');
    addLog.call(this, 'Turn ' + this.game.turn);

    var availableAIs = getAvailableAIs.call(this);
    if (_.isEmpty(availableAIs)) {
        onReady.call(this);
    } else {
        _.each(availableAIs, function (ai) {
            ai.ready = false;
            ai.commands = [];
        }, this);
        processNextAI.call(this);
    }
}

function finish() {
    addLog.call(this, '');
    addLog.call(this, 'Game finished');

    unpauseAIs.call(this, function () {
        _.each(getAvailableAIs.call(this), function (ai) {
            ai.clearEventHandlers();
            var terminationText = this.game.getTerminationText();
            if (terminationText) {
                ai.write(terminationText);
            }
            ai.setTimer(1000);
        }, this);

        this.gameResult.replay = this.game.getReplay();
        this.gameResult.winner = this.game.getWinner();
        addLog.call(this, 'Winner: ' + this.gameResult.winner);
        this.done();
    });
};

function getAvailableAIs() {
    return _.filter(this.ais, function (ai) {
        return ai.available;
    });
}

function getUnreadyAIs() {
    return _.filter(getAvailableAIs.call(this), function (ai) {
        return !ai.ready;
    });
}

function pauseAIs(callback) {
    pauseOrUnpauseAIs.call(this, AI.prototype.pause, callback);
}

function unpauseAIs(callback) {
    pauseOrUnpauseAIs.call(this, AI.prototype.unpause, callback);
}

function pauseOrUnpauseAIs(controllFunction, callback) {
    var self = this;
    asyncblock(function (flow) {
        _.each(self.ais, function (ai) {
            controllFunction.call(ai, flow.add());
        });
        _.each(self.ais, function (ai) {
            flow.wait();
        });
        callback.call(self);
    });
}

function processNextAI() {
    var ai = _.first(getUnreadyAIs.call(this));
    var self = this;

    var onReadyWithCurrentAI = function (currentAI) {
        currentAI.clearEventHandlers();
        currentAI.pause(function () {
            onReady.call(this);
        }, this);
    }
    ai.onStdout = function (data) {
        ai.commands = data.toString().trim().split(' ');
        ai.ready = true;
        ai.clearTimer();
        onReadyWithCurrentAI.call(self, ai);
    };
    ai.onExit = function () {
        onReadyWithCurrentAI.call(self, ai);
    };

    ai.unpause(function () {
        addLog.call(this, 'AI' + ai.index + '>>' + 'Writing to stdin, waiting for stdout');
        if (this.game.isInitialState()) {
            var initialInformation = this.game.getInitialInformation();
            ai.write(initialInformation);
            addLog.call(this, initialInformation);
        }
        var turnInformation = this.game.getTurnInformation(ai.index);
        ai.write(turnInformation);
        addLog.call(this, turnInformation);

        ai.setTimer(1000);
    }, this);
}

exports.Runner = Runner;
