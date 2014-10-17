var express = require('express'),
    path = require('path'),
    Runner = require('./runner.js').Runner;

module.exports = function (app) {

    app.use(express.static(path.join(__dirname, '../client')));

    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/replayer', function (req, res) {
        app.locals.replay = req.query.replay;
        res.render('replayer', {
            locals: {
                replay: req.query.replay,
            }
        });
    });

};