var PopularityBarManager = cc.Class.extend({
    ctor: function (popularityBar, popularity, largestPopularity) {
        this.popularityBar = popularityBar;
        this.popularity = popularity;
        this.largestPopularity = largestPopularity;
    },

    getTargetPercent: function () {
        if (this.largestPopularity > 0) {
            return Math.abs(this.popularity) / this.largestPopularity * 100;
        } else {
            return 0;
        }
    },

    isFinished: function () {
        return this.popularityBar.getPercent() >= this.getTargetPercent();
    },

    isPositive: function () {
        return this.popularity > 0;
    },

    increasePercent: function () {
        var newPercent = this.popularityBar.getPercent() + PopularityBarManager.INCREMENT;
        this.popularityBar.setPercent(Math.min(newPercent, this.getTargetPercent()));
    },
});

PopularityBarManager.INCREMENT = 3;