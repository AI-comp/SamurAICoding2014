var InformationScene = ReplayerScene.extend({
    ctor: function (game) {
        this._super();
        this.game = game;

        this.sceneNode = this.createSceneNode();
        this.addChild(this.sceneNode);

        this.setupHeroinePanels();
        this.setupPlayerPanels();
        this.setupControlPanel();

        return true;
    },

    createSceneNode: function () {
        // Override me
    },

    getHeroinePanel: function (heroineIndex) {
        return this.getPanel(heroineIndex);
    },

    getPlayerPanel: function (playerIndex) {
        return this.getPanel(10 + playerIndex);
    },

    getPanel: function (tag) {
        var panelNode = this.sceneNode.getChildByTag(tag);
        return panelNode.getChildByTag(0);
    },

    setupPlayerPanels: function () {
        _(this.game.getNumPlayers()).times(function (playerIndex) {
            var playerPanel = this.getPlayerPanel(playerIndex);
            playerPanel.getChildByName('Icon').loadTexture(res.image.info.playerIcons[playerIndex]);
            playerPanel.getChildByName('Name').setString(this.getPlayerName(playerIndex));
        }, this);
    },

    getPlayerName: function (playerIndex) {
        if (typeof (playerNames) == 'undefined') {
            return 'Player ' + playerIndex;
        } else {
            return playerNames[playerIndex];
        }
    },

    setupHeroinePanels: function () {
        _(this.game.getNumHeroines()).times(function (heroineIndex) {
            var heroine = this.game.heroines[heroineIndex];
            var heroinePanel = this.getHeroinePanel(heroineIndex);

            var heroineBackgroundImage = res.image.info.heroineBackgrounds[this.getHeroineId(heroineIndex)];
            heroinePanel.setBackGroundImage(heroineBackgroundImage);
            var heroineImage = res.image.info.heroines[this.getHeroineId(heroineIndex)];
            heroinePanel.getChildByName('HeroineImage').loadTexture(heroineImage);
            heroinePanel.getChildByName('EnthusiasmImage').loadTexture(res.image.info.enthusiasms[heroine.enthusiasm]);
        }, this);

        this.setupDatedImages();
        this.setupLovePanels();
    },

    setupDatedImages: function () {
        if (this.getLovePanelMode() == ReplayerScene.HEART_LOVE_PANEL_MODE && this.game.isWeekday()) {
            _(this.game.getNumHeroines()).times(function (heroineIndex) {
                var heroine = this.game.heroines[heroineIndex];
                var heroinePanel = this.getHeroinePanel(heroineIndex);
                var datedCount = heroine.getDatedCount();
                heroinePanel.getChildByName('DatedImage').loadTexture(res.image.info.datedCounts[datedCount]);
            }, this);
        }
    },

    setupLovePanels: function () {
        _(this.game.getNumHeroines()).times(function (heroineIndex) {
            var heroine = this.game.heroines[heroineIndex];
            var heroinePanel = this.getHeroinePanel(heroineIndex);

            _(this.game.getNumPlayers()).times(function (playerIndex) {
                var loveArea = heroinePanel.getChildByName('LoveArea' + playerIndex);
                loveArea.removeAllChildren(true);

                switch (this.getLovePanelMode()) {
                    case ReplayerScene.HEART_LOVE_PANEL_MODE:
                    default:
                        var lovePanel = new HeartLovePanel(playerIndex);
                        break;
                    case ReplayerScene.BAR_LOVE_PANEL_MODE:
                        var lovePanel = new BarLovePanel(playerIndex, this.game.getMaxLove());
                        break;
                }
                lovePanel.setName('LovePanel');
                loveArea.addChild(lovePanel);
                lovePanel.setLove(heroine.revealedLove[playerIndex], heroine.realLove[playerIndex]);
            }, this);
        }, this);
    },

    setupControlPanel: function () {
        var controlPanelNode = this.sceneNode.getChildByTag(100);
        var controlPanel = controlPanelNode.getChildByTag(0);

        var proceedButton = controlPanel.getChildByName('ProceedButton');
        var previousButton = controlPanel.getChildByName('PreviousButton');
        var nextButton = controlPanel.getChildByName('NextButton');
        var firstButton = controlPanel.getChildByName('FirstButton');
        var lastButton = controlPanel.getChildByName('LastButton');
        var heartButton = controlPanel.getChildByName('HeartButton');
        var barButton = controlPanel.getChildByName('BarButton');

        this.addTouchEventListenerToButton(proceedButton, this.transitToDateScene);
        this.addTouchEventListenerToButton(previousButton, _.partial(this.transitToSpecificTurn, this.game.turn - 1));
        this.addTouchEventListenerToButton(nextButton, _.partial(this.transitToSpecificTurn, this.game.turn + 1));
        this.addTouchEventListenerToButton(firstButton, _.partial(this.transitToSpecificTurn, this.game.initialTurn));
        this.addTouchEventListenerToButton(lastButton, _.partial(this.transitToSpecificTurn, this.game.lastTurn + 1));
        this.addTouchEventListenerToButton(heartButton, _.partial(this.setLovePanelMode, ReplayerScene.HEART_LOVE_PANEL_MODE));
        this.addTouchEventListenerToButton(barButton, _.partial(this.setLovePanelMode, ReplayerScene.BAR_LOVE_PANEL_MODE));

        if (this.game.turn <= this.game.initialTurn) {
            previousButton.setBright(false);
            previousButton.setTouchEnabled(false);
            firstButton.setBright(false);
            firstButton.setTouchEnabled(false);
        }
        if (this.game.turn > this.game.lastTurn) {
            proceedButton.setBright(false);
            proceedButton.setTouchEnabled(false);
            nextButton.setBright(false);
            nextButton.setTouchEnabled(false);
            lastButton.setBright(false);
            lastButton.setTouchEnabled(false);
            heartButton.setBright(false);
            heartButton.setTouchEnabled(false);
            barButton.setBright(false);
            barButton.setTouchEnabled(false);
        }

        var turnText = this.game.turn <= this.game.lastTurn ? 'Turn ' + this.game.turn : 'Finished';
        controlPanel.getChildByName('TurnLabel').setString(turnText);
    },

    addTouchEventListenerToButton: function (button, callback) {
        button.addTouchEventListener(function (object, eventType) {
            if (eventType == ccui.Widget.TOUCH_ENDED) {
                callback.call(this);
            }
        }, this);
    },

    transitToDateScene: function () {
        if (!this.game.isFinished()) {
            var transition = cc.TransitionFadeBL.create(0.5, new DateScene(this.game));
            cc.director.runScene(transition);
        }
    },

    transitToSpecificTurn: function (turn) {
        if (turn < this.game.initialTurn || turn > this.game.lastTurn + 1) {
            return;
        }

        var game = new Game(this.game.replay.seed);
        game.initialize();
        while (game.turn < turn) {
            game.processTurn(this.getCurrentCommands(game));
        }

        cc.director.runScene(this.getNextInformationScene(game));
    },
});
