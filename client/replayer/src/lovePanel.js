var LovePanel = ccui.Layout.extend({
    ctor: function (panelResource) {
        this._super();

        this.setName('LovePanel');

        this.innerPanel = ccs.uiReader.widgetFromJsonFile(panelResource);
        this.addChild(this.innerPanel);
    },

    setLove: function (revealedLove, realLove) {
    },
});