
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var notice = require('./routes/notice');
var version = require('./routes/version');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 9090);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/admin/notice', notice.noticeList);
app.post('/admin/notice', notice.newNotice);
app.get('/admin/notice/:platform', notice.getNotice);
app.delete('/admin/notice/:platform', notice.delNotice);
app.post('/admin/notice/:platform', notice.saveNotice);
app.get('/admin/version', version.manage);
app.post('/admin/version', version.updateVersion);  

app.get('/api/:platform/notice', notice.notice);
app.get('/api/:platform/version', version.version);
app.get('/api/:platform/update', version.update);
app.get('/api/:platform/update/:version', version.update);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
