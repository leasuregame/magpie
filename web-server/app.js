
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var notice = require('./routes/notice');
var version = require('./routes/version');
var cdkey = require('./routes/cdkey');
var http = require('http');
var path = require('path');
var filter = require('./util/filter');
var expressValidator = require('express-validator');
var pushMessage = require('./routes/msgPush');
var sendReward = require('./routes/reward');
var flash = require('connect-flash');
var player = require('./routes/player');
var stats = require('./routes/stats');

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
app.use(express.bodyParser());
app.use(expressValidator());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', filter.authorize, routes.index);
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', routes.doLogout);
app.get('/admin/notice', filter.authorize, notice.noticeList);
app.post('/admin/notice', filter.authorize, notice.newNotice);
app.get('/admin/notice/:platform', filter.authorize, notice.getNotice);
app.delete('/admin/notice/:platform', filter.authorize, notice.delNotice);
app.post('/admin/notice/:platform', filter.authorize, notice.saveNotice);
app.get('/admin/version', filter.authorize, version.manage);
app.post('/admin/version', filter.authorize, version.updateVersion);
app.get('/admin/version/details/:version', filter.authorize, version.versionDetails)
app.get('/admin/cdkey', filter.authorize, cdkey.manage);
app.get('/admin/cdkey/pregenerate', filter.authorize, cdkey.pregenerate);
app.get('/admin/cdkey/generate', filter.authorize, cdkey.generate);
app.get('/admin/cdkey/search', filter.authorize, cdkey.search);
app.get('/admin/playerId', filter.authorize, player.get);

app.get('/admin/stats/onlineuser', filter.authorize, stats.onlineUser);

pushMessage(app);
sendReward(app);

app.get('/api/:platform/notice', notice.notice);
app.get('/api/:platform/version', version.version);
app.get('/api/:platform/update', version.update);
app.get('/api/:platform/update/:version', version.update);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
