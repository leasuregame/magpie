
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var admin = require('./routes/admin');
var update = require('./routes/update');
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
app.get('/notice', admin.notice);
app.get('/admin/notice', admin.admin);
app.post('/admin/notice', admin.saveNotice);
app.get('/admin/version', update.manage);
app.post('/admin/version', update.updateVersion);

app.get('/api/:platform/version', update.version);
app.get('/api/:platform/update', update.update);
app.get('/api/:platform/update/:version', update.update);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
