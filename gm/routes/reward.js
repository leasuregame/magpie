var Url = require('url');
var logger = require('../logger').logger('reward');

var reward = function(app) {

	//全服、个人补偿奖赏
	app.get('/reward', function(req, res) {
		res.render('reward', {
			title: '补偿奖励',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	app.post('/logger4Reward', function(req, res) {

		var url = Url.parse(req.url, true);
		var query = url.query;
		var area = query['area'];
		var player = query['player'];
		var data = query['data'];

		var log = '[success]服务器: ' + area;
		
		if(player) {
			log += '    玩家: ' + player;
		}

		log += '    内容: ' + data;

		logger.info(log);
	});

};

module.exports = reward;