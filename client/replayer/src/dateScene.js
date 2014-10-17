var DateScene = ReplayerScene.extend({
    ctor: function (game) {
        this._super();
        this.game = game;

        this.sceneNode = ccs.sceneReader.createNodeWithSceneFile(res.json.dateScene);
        this.addChild(this.sceneNode);

        this.setupDatePanels();

        return true;
    },

    onEnterTransitionDidFinish: function () {
        this._super();

        this.schedule(this.switchToNextDate, DateScene.INTERVAL_BETWEEN_DATES, cc.REPEAT_FOREVER, DateScene.INTERVAL_BETWEEN_DATES / 2);
    },

    onExitTransitionDidStart: function () {
        this._super();

        _(this.game.getNumPlayers()).times(function (playerIndex) {
            var datePanel = this.getDatePanel(playerIndex);
            _.each(['ScreenArea', 'WeekdayTargetPanel', 'HolidayTargetPanel'], function (panelName) {
                datePanel.getChildByName(panelName).setClippingEnabled(false);
            }, this);
        }, this);
    },

    transitToInformationScene: function () {
        this.game.processTurn(this.getCurrentCommands(this.game));
        var transition = cc.TransitionFadeTR.create(0.5, this.getNextInformationScene(this.game));
        cc.director.runScene(transition);
    },

    getDatePanel: function (playerIndex) {
        var datePanelNode = this.sceneNode.getChildByTag(playerIndex);
        return datePanelNode.getChildByTag(0);
    },

    getTargetPanel: function (datePanel) {
        if (this.game.isWeekday()) {
            return datePanel.getChildByName('WeekdayTargetPanel');;
        } else {
            return datePanel.getChildByName('HolidayTargetPanel');
        }
    },

    setupDatePanels: function () {
        this.cursors = [];
        this.cursorPosition = -1;
        _(this.game.getNumPlayers()).times(function (playerIndex) {
            var datePanel = this.getDatePanel(playerIndex);
            datePanel.getChildByName('PlayerIcon').loadTexture(res.image.info.playerIcons[playerIndex]);
            this.setupTargetPanels(datePanel, playerIndex);
            this.cursors.push(this.createCursor(datePanel));
        }, this);
    },

    setupTargetPanels: function (datePanel, playerIndex) {
        datePanel.getChildByName('WeekdayTargetPanel').setVisible(this.game.isWeekday());
        datePanel.getChildByName('HolidayTargetPanel').setVisible(!this.game.isWeekday());
        var targetPanel = this.getTargetPanel(datePanel);
        targetPanel.setBackGroundImage(res.image.date.targetBackgrounds[playerIndex]);

        _(this.game.getNumRequiredCommands()).times(function (commandIndex) {
            var targetHeroine = this.getCommand(this.game, playerIndex, commandIndex);
            var targetHeroineImage = res.image.date.targets[this.filterImageId(this.getHeroineId(targetHeroine))];
            targetPanel.getChildByName('Heroine' + commandIndex).loadTexture(targetHeroineImage);
        }, this);
    },

    createCursor: function (datePanel) {
        var cursor = ccs.uiReader.widgetFromJsonFile(res.json.cursor);
        cursor.setAnchorPoint(0.5, 0.5);
        cursor.setVisible(false);
        var targetPanel = this.getTargetPanel(datePanel);
        targetPanel.addChild(cursor);
        return cursor;
    },

    switchToNextDate: function () {
        this.cursorPosition++;
        if (this.cursorPosition == this.game.getNumRequiredCommands()) {
            this.unscheduleAllCallbacks();
            this.transitToInformationScene();
        } else {
            _(this.game.getNumPlayers()).times(function (playerIndex) {
                var datePanel = this.getDatePanel(playerIndex);
                this.showNextScreenImage(datePanel, playerIndex);
                this.moveCursorToNextTarget(datePanel, playerIndex);
            }, this);
        }
    },

    showNextScreenImage: function (datePanel, playerIndex) {
        var screenArea = datePanel.getChildByName('ScreenArea');
        var targetHeroine = this.getCommand(this.game, playerIndex, this.cursorPosition);

        var nextScreen = ccs.uiReader.widgetFromJsonFile(res.json.dateScreen);
        var backgroundImage = this.getBackgroundImage(this.game, playerIndex, this.cursorPosition);
        nextScreen.getChildByName('BackgroundImage').loadTexture(backgroundImage);
        var heroineImage = res.image.date.heroines[this.filterImageId(this.getHeroineId(targetHeroine))];
        nextScreen.getChildByName('HeroineImage').loadTexture(heroineImage);
        nextScreen.setPosition(new cc.Point(0, -screen.height));
        screenArea.addChild(nextScreen);

        var moveTo = cc.MoveTo.create(DateScene.SLIDE_DURATION, new cc.Point(0, 0));
        nextScreen.runAction(cc.EaseOut.create(moveTo, DateScene.SLIDE_EASEOUT_RATE));
    },

    moveCursorToNextTarget: function (datePanel, playerIndex) {
        var targetPanel = this.getTargetPanel(datePanel);
        var targetHeroineImage = targetPanel.getChildByName('Heroine' + this.cursorPosition);

        if (this.cursorPosition == 0) {
            var targetHeroinePosition = targetHeroineImage.getPosition();
            this.cursors[playerIndex].setPosition(targetHeroinePosition.x, targetHeroinePosition.y + targetHeroineImage.getSize().height);
            this.cursors[playerIndex].setVisible(true);
        }

        var moveTo = cc.MoveTo.create(DateScene.SLIDE_DURATION, targetHeroineImage.getPosition());
        this.cursors[playerIndex].runAction(cc.EaseOut.create(moveTo, DateScene.SLIDE_EASEOUT_RATE));
    },

    getBackgroundImage: function (game, playerIndex, commandIndex) {
        var backgroundId = this.getElement(this.backgroundIds, game, playerIndex, commandIndex);
        return res.image.date.backgrounds[this.filterImageId(backgroundId)];
    },

    filterImageId: function (imageId) {
        if (this.getLovePanelMode() == ReplayerScene.HEART_LOVE_PANEL_MODE && !this.game.isWeekday()) {
            return 'secret';
        } else {
            return imageId;
        }
    },
});

DateScene.INTERVAL_BETWEEN_DATES = 1;
DateScene.SLIDE_DURATION = 0.3;
DateScene.SLIDE_EASEOUT_RATE = 3;