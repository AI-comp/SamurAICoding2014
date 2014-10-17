var MainScene = InformationScene.extend({
    ctor: function (game) {
        this._super(game);
        return true;
    },

    createSceneNode: function () {
        return ccs.sceneReader.createNodeWithSceneFile(res.json.mainScene);
    },

    setupPlayerPanels: function () {
        this._super();

        var real = this.getLovePanelMode() == ReplayerScene.BAR_LOVE_PANEL_MODE;
        var playersWithWinningPopularity = this.game.getPlayersWithTotalPopularity(true, real);
        var playersWithLosingPopularity = this.game.getPlayersWithTotalPopularity(false, real);
        var largestPopularity = Math.max(Game.getLargestPopularity(playersWithWinningPopularity), Game.getLargestPopularity(playersWithLosingPopularity));
        largestPopularity = largestPopularity <= 15 ? 15 : largestPopularity <= 30 ? 30 : 45;

        _(this.game.getNumPlayers()).times(function (playerIndex) {
            var playerPanel = this.getPlayerPanel(playerIndex);
            playerPanel.setBackGroundImage(res.image.info.playerBackgrounds[playerIndex]);

            playerPanel.getChildByName('PopularityPanel').setBackGroundImage(res.image.info['popularityMeasure' + largestPopularity]);
            var winningPopularityBar = playerPanel.getChildByName('WinningPopularityBar');
            var losingPopularityBar = playerPanel.getChildByName('LosingPopularityBar');
            winningPopularityBar.loadTexture(res.image.info.winningPopularityBar);
            losingPopularityBar.loadTexture(res.image.info.losingPopularityBar);
            winningPopularityBar.setPercent(playersWithWinningPopularity[playerIndex].getPopularity() / largestPopularity * 100);
            losingPopularityBar.setPercent(playersWithLosingPopularity[playerIndex].getPopularity() / largestPopularity * 100);
        }, this);
    },

    setLovePanelMode: function (mode) {
        this._super(mode);
        this.setupPlayerPanels();
    },
});
