console.log('Lang Wars');

$(function () {
    var runGameBtn = $('#runGame');
    var host = window.document.location.host.replace(/:.*/, '');
    var ws = new WebSocket('ws://' + host + ':8000');

    runGameBtn.click(function () {
        ws.send(JSON.stringify({
            commands: _.map(_.range(4), function (i) {
                return $('#ai' + i).val();
            }),
            workingDirs: _.map(_.range(4), function (i) {
                return $('#dir' + i).val();
            }),
            seed: $('#seed').val(),
        }));
        $('#log').html('Running a game...');
    });

    ws.onmessage = function (event) {
        var gameResult = JSON.parse(event.data);
        showLog(gameResult.log);
        loadReplayer(gameResult.replay);
    };

    function showLog(rawLog) {
        var htmlLog = _.map(rawLog, function (log) {
            return log.message.replace(/\n/g, '<br />');
        }, this).join('<br />');
        $('#log').html(htmlLog);
    }

    function loadReplayer(replay) {
        var replayerFrame = $('#replayer');
        if (replayerFrame.attr('src')) {
            var window = replayerFrame.get(0).contentWindow;
            window.replay = replay;
            window.runGame();
        } else {
            replayerFrame.attr('src', '/replayer/?replay=' + JSON.stringify(replay));
        }
    }
});