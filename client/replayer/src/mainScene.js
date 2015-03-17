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

        var players = this.game.tmpRanking;
        var largestPopularity = Game.getLargestPopularity(players);
        largestPopularity = largestPopularity <= 15 ? 15 : largestPopularity <= 30 ? 30 : 45;

        _(this.game.getNumPlayers()).times(function (playerIndex) {
            var playerPanel = this.getPlayerPanel(playerIndex);
            playerPanel.setBackGroundImage(res.image.info.playerBackgrounds[playerIndex]);

            playerPanel.getChildByName('PopularityPanel').setBackGroundImage(res.image.info['popularityMeasure' + largestPopularity]);
            var winningPopularityBar = playerPanel.getChildByName('WinningPopularityBar');
            var losingPopularityBar = playerPanel.getChildByName('LosingPopularityBar');
            winningPopularityBar.loadTexture(res.image.info.winningPopularityBar);
            losingPopularityBar.loadTexture(res.image.info.losingPopularityBar);
            var popularity = players[playerIndex].getPopularity();
            winningPopularityBar.setPercent(Math.max(popularity, 0) / largestPopularity * 100);
            losingPopularityBar.setPercent(Math.max(-popularity, 0) / largestPopularity * 100);
        }, this);
    },

    setLovePanelMode: function (mode) {
        this._super(mode);
        this.setupPlayerPanels();
    },
});
