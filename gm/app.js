
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();

var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var flash = require('connect-flash');



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
/*
app.get('/', routes.index);
app.get('/hello',routes.hello);
app.get('/users', user.list);
*/




routes(app);

app.use(function(req,res,next){
    var err = req.flash('error'),
        success = req.flash('success');
    res.locals.user = req.session.user;
    res.locals.error = err.length ? err : null;
    res.locals.success = success.length ? success : null;
    next();
});
/*
app.dynamicHelpers({
    user: function(req, res) {
        return req.session.user; },
    error: function(req, res) {
        var err = req.flash('error');
        if (err.length) return err;
        else
            return null;
    },
    success: function(req, res) {
        var succ = req.flash('success'); if (succ.length)
            return succ; else
            return null;
    }
});
*/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
