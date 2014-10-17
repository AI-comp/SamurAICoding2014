var ResultScene = InformationScene.extend({
    popularityBarManagers: new Array(),

    ctor: function (game) {
        this._super(game);
        return true;
    },

    onEnterTransitionDidFinish: function () {
        this.schedule(this.updatePopularityBars, ResultScene.INTERVAL, cc.REPEAT_FOREVER, 0);
    },

    createSceneNode: function () {
        return ccs.sceneReader.createNodeWithSceneFile(res.json.resultScene);
    },

    getLovePanelMode: function () {
        return ReplayerScene.BAR_LOVE_PANEL_MODE;
    },

    getPopularityBar: function (playerPanel, popularity) {
        var popularityBarName = (popularity >= 0 ? 'PositivePopularityBar' : 'NegativePopularityBar');
        return playerPanel.getChildByName(popularityBarName);
    },

    setupPlayerPanels: function () {
        this._super();
        this.showMeasure();

        var rankedPlayers = this.game.getRanking();
        var largestPopularity = Game.getLargestPopularity(rankedPlayers);
        _.each(rankedPlayers, function (player) {
            var playerPanel = this.getPlayerPanel(player.index);
            var popularityBar = this.getPopularityBar(playerPanel, player.getPopularity());
            popularityBar.loadTexture(res.image.info.revealedBars[player.index]);
            popularityBar.setPercent(0);

            var popularityBarManager = new PopularityBarManager(popularityBar, player.getPopularity(), largestPopularity);
            this.popularityBarManagers.push(popularityBarManager);
        }, this);
    },

    updatePopularityBars: function () {
        var positiveBarManagers = _.filter(this.popularityBarManagers, function (barManager) {
            return barManager.isPositive() && !barManager.isFinished();
        }, this);
        var negativeBarManagers = _.filter(this.popularityBarManagers, function (barManager) {
            return !barManager.isPositive() && !barManager.isFinished();
        }, this);

        var targetBarManagers;
        if (_.size(negativeBarManagers) > 0) {
            targetBarManagers = negativeBarManagers;
        } else if (_.size(positiveBarManagers) > 0) {
            targetBarManagers = positiveBarManagers;
        } else {
            this.unschedule(this.updatePopularityBars);
            this.showWinner();
            return;
        }

        _.each(targetBarManagers, function (barManager) {
            barManager.increasePercent();
        }, this);
    },

    showWinner: function () {
        var winner = this.game.getWinner();
        if (winner === '') {
            var drawImage = this.sceneNode.getChildByTag(200);
            drawImage.setVisible(true);
        } else {
            var winnerPanel = this.getPlayerPanel(winner);
            var winnerImage = winnerPanel.getChildByName('WinnerImage');
            winnerImage.setVisible(true);
            var pulseSequence = new cc.Sequence(new Array(
                new cc.FadeTo(ResultScene.PULSE_INTERVAL, 100),
                new cc.FadeOut(ResultScene.PULSE_INTERVAL, 255)
            ));
            winnerImage.runAction(new cc.RepeatForever(pulseSequence));
        }
    },

    showMeasure: function () {
        var largestPopularity = Game.getLargestPopularity(this.game.getRanking());
        _(this.game.getNumPlayers()).times(function (playerIndex) {
            var playerPanel = this.getPlayerPanel(playerIndex);
            _.each([-1, 1], function (direction) {
                var popularityBar = this.getPopularityBar(playerPanel, direction);
                var width = popularityBar.getSize().width;
                var left = popularityBar.getLeftInParent();
                var right = left + width;
                var start = direction == -1 ? right : left;
                _.each(_.range(1, Math.floor(largestPopularity) + 1), function (popularity) {
                    var measureLine = ccs.uiReader.widgetFromJsonFile(res.json['measureLine' + (popularity % 5 == 0 ? '5' : '1')]);
                    playerPanel.addChild(measureLine);
                    var distanceFromStart = width * (popularity / largestPopularity);
                    measureLine.setPositionX(start + direction * distanceFromStart - measureLine.getSize().width / 2);
                }, this);
            }, this);
        }, this);
    },

    setupLovePanels: function () {
        this._super();
        _(this.game.getNumHeroines()).times(function (heroineIndex) {
            var heroine = this.game.heroines[heroineIndex];
            var heroinePanel = this.getHeroinePanel(heroineIndex);

            _.each([true, false], function (max) {
                var playersWithMaxLove = heroine.filterPlayersByLove(this.game.getRanking(), max ? Math.max : Math.min, true);
                _.each(playersWithMaxLove, function (player) {
                    var loveArea = heroinePanel.getChildByName('LoveArea' + player.index);
                    loveArea.getChildByName('LovePanel').emphasize(max);
                }, this);
            }, this);
        }, this);
    }
});

ResultScene.INTERVAL = 0.03;
ResultScene.PULSE_INTERVAL = 0.6;
