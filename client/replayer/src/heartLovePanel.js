var HeartLovePanel = LovePanel.extend({
    ctor: function (playerIndex) {
        this._super(res.json.heartLovePanel);
        this.heartResource = res.image.info.hearts[playerIndex];
    },

    setLove: function (revealedLove, realLove) {
        this._super(revealedLove, realLove);

        if (revealedLove >= 10) {
            this.innerPanel.getChildByName('Heart10').loadTexture(this.heartResource);
        }
        _(revealedLove % 10).times(function (heartIndex) {
            this.innerPanel.getChildByName('Heart' + (heartIndex + 1)).loadTexture(this.heartResource);
        }, this);
    },
});