var res = {
    json: {
        mainScene: 'res/MainScene.json',
        dateScene: 'res/DateScene.json',
        resultScene: 'res/ResultScene.json',
        heroinePanel: 'res/publish/HeroinePanel.json',
        datePanel: 'res/publish/DatePanel.json',
        playerPanel: 'res/publish/PlayerPanel.json',
        controlPanel: 'res/publish/ControlPanel.json',
        heartLovePanel: 'res/publish/HeartLovePanel.json',
        barLovePanel: 'res/publish/BarLovePanel.json',
        playerResultPanel: 'res/publish/PlayerResultPanel.json',
        cursor: 'res/publish/Cursor.json',
        dateScreen: 'res/publish/DateScreen.json',
        measureLine1: 'res/publish/MeasureLine1.json',
        measureLine5: 'res/publish/MeasureLine5.json',
    },
    image: {
        info: {
            loveMeasure15: 'res/info/bar/measure15.png',
            loveMeasure30: 'res/info/bar/measure30.png',
            loveMeasure45: 'res/info/bar/measure45.png',
            maxLoveHighlight: 'res/info/bar/maxLoveHighlight.png',
            minLoveHighlight: 'res/info/bar/minLoveHighlight.png',
            popularityMeasure15: 'res/info/popularityBar/measure15.png',
            popularityMeasure30: 'res/info/popularityBar/measure30.png',
            popularityMeasure45: 'res/info/popularityBar/measure45.png',
            winningPopularityBar: 'res/info/popularityBar/winningBar.png',
            losingPopularityBar: 'res/info/popularityBar/losingBar.png',
        },
        date: {
        },
    },
    settings: {
    },
};

var g_resources = [
    res.json.mainScene,
    res.json.dateScene,
    res.json.resultScene,
    res.json.heroinePanel,
    res.json.datePanel,
    res.json.playerPanel,
    res.json.controlPanel,
    res.json.heartLovePanel,
    res.json.barLovePanel,
    res.json.playerResultPanel,
    res.json.cursor,
    res.json.dateScreen,
    res.json.measureLine1,
    res.json.measureLine5,
    res.image.info.loveMeasure15,
    res.image.info.loveMeasure45,
    res.image.info.popularityMeasure15,
    res.image.info.popularityMeasure45,
    res.image.info.maxLoveHighlight,
    res.image.info.minLoveHighlight,
    res.image.info.winningPopularityBar,
    res.image.info.losingPopularityBar,
];

function addNumberedResources(directory, range, extension) {
    var resources = {};
    _.each(range, function (i) {
        resources[i] = 'res/' + directory + '/' + i + '.' + extension;
    });
    _.each(resources, function (resource) {
        g_resources.push(resource);
    });
    return resources;
}

function addSecretResource(list, directory, extension) {
    list.secret = 'res/' + directory + '/secret.' + extension;
    g_resources.push(list.secret);
}

res.settings.playerRange = _.range(4);
res.settings.heroineRange = _.range(9);
res.settings.backgroundRange = _.range(10);

res.image.info.heroines = addNumberedResources('info/heroine', res.settings.heroineRange, 'png');
res.image.info.heroineBackgrounds = addNumberedResources('info/heroineBackground', res.settings.heroineRange, 'png');
res.image.info.hearts = addNumberedResources('info/heart', res.settings.playerRange, 'png');
res.image.info.revealedBars = addNumberedResources('info/bar/revealed', res.settings.playerRange, 'png');
res.image.info.realBars = addNumberedResources('info/bar/real', res.settings.playerRange, 'png');
res.image.info.enthusiasms = addNumberedResources('info/enthusiasm', _.range(3, 6 + 1), 'png');
res.image.info.datedCounts = addNumberedResources('info/dated', _.range(1, 8 + 1), 'png');
res.image.info.playerBackgrounds = addNumberedResources('info/playerBackground', res.settings.playerRange, 'png');
res.image.date.heroines = addNumberedResources('date/heroine', res.settings.heroineRange, 'png');
addSecretResource(res.image.date.heroines, 'date/heroine', 'png');
res.image.date.backgrounds = addNumberedResources('date/background', res.settings.backgroundRange, 'png');
addSecretResource(res.image.date.backgrounds, 'date/background', 'png');
res.image.date.targets = addNumberedResources('date/target', res.settings.heroineRange, 'png');
addSecretResource(res.image.date.targets, 'date/target', 'png');
res.image.date.targetBackgrounds = addNumberedResources('date/targetBackground', res.settings.playerRange, 'png');

res.image.info.playerIcons = [];
_.each(res.settings.playerRange, function (playerIndex) {
    var playerIcon;
    if (typeof (playerIcons) == 'undefined' || cc.loader.loadBinarySync(playerIcons[playerIndex]) === null) {
        playerIcon = 'res/info/defaultPlayerIcon.png';
    } else {
        playerIcon = playerIcons[playerIndex];
    }
    res.image.info.playerIcons.push(playerIcon);
    g_resources.push(playerIcon);
});
