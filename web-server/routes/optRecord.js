var Url = require('url');
var filter = require('../util/filter');
var recordDao = require('../dao/OptRecordDao');

var optRecord = function(app) {

    app.get('/admin/msgOptRecord', filter.authorize, function(req, res) {
        res.render('msgOptRecord', {
            menu: 'msgOptRecord',
            title: '系统消息操作记录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    });

	app.post('/admin/recordMsgOpt', filter.authorize, function(req, res) {

		var reqParam = req.body;
		var operator = req.session.user.user_name;
		var areaId = JSON.stringify(reqParam['areaId']);
		var playerNames = JSON.stringify(reqParam['playerNames']);
		var options = JSON.stringify(reqParam['options']);
		var status = reqParam['status'];

        recordDao.addRecord([operator, areaId, playerNames, options, status], function (err, res){
            console.log("addRecord", arguments);
        });
	});

    app.all('/admin/getSysMsgOpt', filter.authorize, function (req, res) {
        var queryWhere = {
            createTime : req.body['createTime']
        };

        recordDao.getRecords(queryWhere, function(err, rows){
            if (err) {
                res.status(500).send('error when selecting record, ' + err);
            }
            res.send(rows);
        });
    });
};

module.exports = optRecord;