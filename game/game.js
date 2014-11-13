(function () {

    var _ = require('underscore');
    MersenneTwister = require('./mersenne-twister').MersenneTwister;

    Game = exports.Game = (function () {
        function Game(seed) {
            this.heroines = [];
            this.initialTurn = 1;
            this.lastTurn = 9;
            this.turn = this.initialTurn;
            this.mt = new MersenneTwister(seed);
            this.replay = {
                seed: seed,
                commands: [],
            };
        }

        Game.prototype.initialize = function (numPlayers, numHeroines) {
            this.numPlayers = numPlayers || 4;
            this.populateHeroines(numHeroines || this.numPlayers * 1.5);
        };

        Game.prototype.populateHeroines = function (numHeroines) {
            this.heroines = [];
            for (var i = 0; i < numHeroines; i++) {
                var enthusiasm = Math.floor(this.mt.random() * 4) + 3;
                this.heroines.push(new Heroine(enthusiasm, this.numPlayers));
            }
        };

        Game.prototype.isWeekday = function () {
            return this.turn % 2 == 1;
        };

        Game.prototype.getNumRequiredCommands = function () {
            return this.isWeekday() ? 5 : 2;
        };

        Game.prototype.getNumHeroines = function () {
            return this.heroines.length;
        };

        Game.prototype.getNumPlayers = function () {
            return this.numPlayers;
        };

        Game.prototype.getNumTurns = function () {
            return this.lastTurn - this.initialTurn + 1;
        };

        Game.prototype.processTurn = function (commands) {
            _.each(this.heroines, function (heroine) {
                heroine.refresh();
            });

            this.replay.commands.push(_.map(_.range(this.getNumPlayers()), function () {
                return [];
            }, this));

            _(this.numPlayers).times(function (playerIndex) {
                _(this.getNumRequiredCommands()).times(function (i) {
                    var targetHeroineIndex = parseInt(commands[playerIndex][i]);
                    if (!(targetHeroineIndex >= 0 && targetHeroineIndex < this.heroines.length)) {
                        targetHeroineIndex = 0;
                    }
                    this.heroines[targetHeroineIndex].date(playerIndex, this.isWeekday());
                    this.replay.commands[this.turn - 1][playerIndex].push(targetHeroineIndex);
                }, this);
            }, this);

            if (this.turn == 5) {
                _.each(this.heroines, function (heroine) {
                    heroine.revealedLove = heroine.realLove.slice(0);
                }, this);
            }

            this.turn += 1;
        };

        Game.prototype.isInitialState = function () {
            return this.turn == this.initialTurn;
        };

        Game.prototype.isFinished = function () {
            return this.turn > this.lastTurn;
        };

        Game.prototype.getInitialInformation = function () {
            var lines = [];

            lines.push([this.lastTurn - this.initialTurn + 1, this.numPlayers, this.heroines.length].join(' '));
            lines.push(_.map(this.heroines, function (heroine) {
                return heroine.enthusiasm;
            }).join(' '));

            return lines.join('\n') + '\n';
        };

        Game.prototype.getTurnInformation = function (playerIndex) {
            var lines = [];

            lines.push([this.turn, this.isWeekday() ? 'D' : 'N'].join(' '));

            _.each(this.heroines, function (heroine) {
                var enemyIndices = _.reject(_.range(this.numPlayers), function (index) {
                    return index == playerIndex;
                });
                var enemyLove = _.map(enemyIndices, function (index) {
                    return heroine.revealedLove[index];
                });
                lines.push(_.flatten([heroine.revealedLove[playerIndex], enemyLove]).join(' '));
            }, this);

            lines.push(_.map(this.heroines, function (heroine) {
                return heroine.realLove[playerIndex];
            }).join(' '));

            if (this.isWeekday()) {
                lines.push(_.map(this.heroines, function (heroine) {
                    return heroine.datedCount;
                }).join(' '));
            }

            return lines.join('\n') + '\n';
        };

        Game.prototype.getStatus = function () {
            var lines = [];

            lines.push('Military Strength:');
            lines.push(_.map(this.heroines, function (heroine) {
                return heroine.enthusiasm;
            }).join(' '));

            lines.push('Real Intimacy:');
            _.each(this.heroines, function (heroine) {
                lines.push(heroine.realLove.join(' '));
            });

            if (this.isWeekday()) {
                lines.push('Negotiation Count:');
                lines.push(_.map(this.heroines, function (heroine) {
                    return heroine.datedCount;
                }).join(' '));
            }

            lines.push('Ranking:');
            _.each(this.getRanking(), function (player) {
                lines.push('Daimyo ' + player.index + ': ' + player.getPopularity() + ' total military strength');
            });

            return lines.join('\n') + '\n';
        };

        Game.prototype.getTerminationText = function (playerIndex) {
            return null;
        };

        Game.prototype.getRanking = function () {
            var playersWithWinningPopularity = this.getPlayersWithTotalPopularity(true, true);
            var playersWithLosingPopularity = this.getPlayersWithTotalPopularity(false, true);

            _(this.getNumPlayers()).times(function (playerIndex) {
                playersWithWinningPopularity[playerIndex].integerPopularity -= playersWithLosingPopularity[playerIndex].integerPopularity;
            });

            return playersWithWinningPopularity.sort(Player.compareTo);
        };

        Game.prototype.getPlayersWithTotalPopularity = function (winning, real) {
            var players = _.map(_.range(this.getNumPlayers()), function (playerIndex) {
                return new Player(playerIndex, this.getNumPlayers());
            }, this);

            _.each(this.heroines, function (heroine) {
                var func = winning ? Math.max : Math.min;
                var targetPlayers = heroine.filterPlayersByLove(players, func, real);
                _.each(targetPlayers, function (targetPlayer) {
                    targetPlayer.addPopularity(heroine.enthusiasm, _.size(targetPlayers));
                });
            });

            return players;
        };

        Game.prototype.getWinner = function () {
            var ranking = this.getRanking();
            if (ranking[0].getPopularity() == ranking[1].getPopularity()) {
                return '';
            } else {
                return ranking[0].index;
            }
        };

        Game.prototype.getReplay = function () {
            return this.replay;
        };

        Game.prototype.getMaxLove = function () {
            var allLove = _.flatten(_.map(this.heroines, function (heroine) {
                return heroine.realLove;
            }));
            return _.max(allLove);
        };

        Game.getLargestPopularity = function (players) {
            return _.max(_.map(players, function (player) {
                return Math.abs(player.getPopularity());
            }, this));
        };

        return Game;
    })();

    var Player = (function () {
        function Player(index, numPlayers) {
            this.index = index;
            this.integerPopularity = 0;
            this.multiplier = this.factorial(numPlayers);
        }

        Player.compareTo = function (self, other) {
            return self.integerPopularity > other.integerPopularity ? -1 : 1;
        };

        Player.prototype.addPopularity = function (numerator, denominator) {
            this.integerPopularity += numerator * this.multiplier / denominator;
        };

        Player.prototype.getPopularity = function () {
            return this.integerPopularity / this.multiplier;
        };

        Player.prototype.factorial = function (n) {
            if (n <= 0) {
                return 1;
            } else {
                return n * this.factorial(n - 1);
            }
        };

        return Player;
    })();

    var Heroine = (function () {
        function Heroine(enthusiasm, numPlayers) {
            this.enthusiasm = enthusiasm;
            this.revealedLove = [];
            this.realLove = [];
            for (var i = 0; i < numPlayers; i++) {
                this.revealedLove.push(0);
                this.realLove.push(0);
            }
            this.datedCount = 0;
        }

        Heroine.prototype.date = function (playerIndex, isWeekday) {
            if (isWeekday) {
                this.realLove[playerIndex] += 1;
                this.revealedLove[playerIndex] += 1;
            } else {
                this.realLove[playerIndex] += 2;
            }
            this.datedCount += 1;
        };

        Heroine.prototype.filterPlayersByLove = function (players, func, real) {
            var allLove = real ? this.realLove : this.revealedLove;
            var targetLove = func.apply(null, allLove);
            var targetPlayers = [];
            _.each(players, function (player) {
                if (allLove[player.index] === targetLove) {
                    targetPlayers.push(player);
                }
            }, this);
            return targetPlayers;
        };

        Heroine.prototype.refresh = function () {
            this.datedCount = 0;
        };

        return Heroine;
    })();

}).call(this);
