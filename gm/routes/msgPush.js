var Url = require('url');
var logger = require('../logger').logger('msgPush');

var msgPush = function(app) {

	app.get('/msgPush', function(req, res) {
		res.render('msgPush', {
			title: '消息推送',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	app.post('/logger4MsgPush', function(req, res) {

		var url = Url.parse(req.url, true);
		var query = url.query;
		var area = query['area'];
		var msg = query['msg'];
		var log = '[success]服务器: ' + area + '    消息内容: ' + msg;
		logger.info(log);

	});

};

module.exports = msgPush;