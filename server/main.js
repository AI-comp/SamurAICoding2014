var express =       require('express')
    , http =        require('http')
    , WebSocketServer =          require('ws').Server
    , path =        require('path');

var app = module.exports = express();

app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'))
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession(
    {
        secret: process.env.COOKIE_SECRET || "Superdupersecret"
    }));

app.configure('development', 'production', function() {
    app.use(express.csrf());
    app.use(function(req, res, next) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        next();
    });
});

require('./routes.js')(app);

// Start HTTP server
app.set('port', process.env.PORT || 8000);
var httpServer = http.createServer(app);
httpServer.listen(app.get('port'), 'localhost', function(){
    console.log("Express server listening on port " + app.get('port'));
});

// Then attach WebSockets server to same endpoint
var wsServer = new WebSocketServer({server: httpServer});
wsServer.on('connection', function(ws) {
    require('./wsEvents.js')(ws);
});
