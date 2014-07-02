
/**
 * Module dependencies.
 */

var express = require('express');
var home = require('./routes/index');
var notice = require('./routes/notice');
var version = require('./routes/version');
var cdkey = require('./routes/cdkey');
var gameData = require('./routes/gameData');
var http = require('http');
var path = require('path');
var filter = require('./util/filter');
var expressValidator = require('express-validator');
var pushMessage = require('./routes/msgPush');
var sendReward = require('./routes/reward');
var flash = require('connect-flash');
var player = require('./routes/player');
var stats = require('./routes/stats');
var area = require('./routes/area');
var messgae = require('./routes/message');
var optRecord = require('./routes/optRecord');
var playerRecord = require('./routes/playerRecord');
var upload = require('./routes/upload');
var serverManager = require('./routes/serverManager');

var app = express();

// all environments
app.set('port', process.env.PORT || 9090);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('arthur wu'));
app.use(express.session());
app.use(express.bodyParser({uploadDir:'./uploads'}));
app.use(expressValidator());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/admin/stats/onlineuser', filter.authorize, stats.onlineUser);

home(app);
notice(app);
version(app);
cdkey(app);
area(app);
player(app);
gameData(app);
pushMessage(app);
sendReward(app);
messgae(app);
optRecord(app);
playerRecord(app);
upload(app);
serverManager(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// watch changes of world cup config
var fs = require('fs');

var upload_dir = path.join(__dirname, 'uploads');
if (!fs.existsSync(upload_dir)) {
    fs.mkdirSync(upload_dir);
}

fs.watch(path.join(__dirname,'..','game-server','data','share','world_cup'), function(event, filename){

    var commandParam = path.join(__dirname,'..','game-server','bin','convertXmlToJson.js');

    var spawn = require('child_process').spawn,
        command = spawn('node', [commandParam]);
    command.stdout.on('end', function() {
        console.log('run command node convertXmlToJson.js completed');
    });

});
