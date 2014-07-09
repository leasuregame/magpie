var Url = require('url');
var filter = require('../util/filter');
var recordDao = require('../dao/OptRecordDao');

var optRecord = function(app) {

    /**
     * render message option record
     */
    app.get('/admin/msgOptRecord', filter.authorize, function(req, res) {
        res.render('msgOptRecord', {
            menu: 'msgOptRecord',
            title: '系统消息操作记录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    });

    app.get('/admin/rchgOptRecord', filter.authorize, function(req, res) {
        res.render('rchgOptRecord', {
            menu: 'rchgOptRecord',
            title: '系统消息操作记录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    });

    function recordOption(data, addFunction, cb){
        var operator = data.operator;
        var areaId = JSON.stringify(data.areaId);
        var playerNames = JSON.stringify(data.playerNames);
        var options = JSON.stringify(data.options);
        var status = data.status;
        addFunction([operator, areaId, playerNames, options, status], cb);
    }

    /**
     * create a message option record
     */
	app.post('/admin/api/recordMsgOpt', filter.authorize, function(req, res) {

		var data = req.body;
        data.operator = req.session.user.user_name;

        recordOption(data, recordDao.addSendMsgRecord, function (err){
            if(err) return res.status(500).send('error when selecting record, ' + err);
            res.send('record succeeded');
        });
	});

    /**
     * get system message options
     */
    app.all('/admin/api/getSysMsgOpt', filter.authorize, function (req, res) {
        var queryWhere = {
            createTime : req.body['createTime']
        };
        recordDao.getSendMsgRecords(queryWhere, function(err, rows){
            if (err) return res.status(500).send('error when selecting record, ' + err);
            res.send(rows);
        });
    });

    /**
     * create a recharge option record
     */
    app.post('/admin/api/recordRchgOpt', filter.authorize, function(req, res) {

        var data = req.body;
        data.operator = req.session.user.user_name;

        recordOption(data, recordDao.addRechargeRecord, function (err){
            if(err) return res.status(500).send('error when selecting record, ' + err);
            res.send('record succeeded');
        });
    });

    /**
     * get backend recharge options
     */
    app.all('/admin/api/getRchgOpt', filter.authorize, function (req, res) {
        var queryWhere = {
            createTime : req.body['createTime']
        };
        recordDao.getRechargeRecords(queryWhere, function(err, rows){
            if (err) return res.status(500).send('error when selecting record, ' + err);
            res.send(rows);
        });
    });
};

module.exports = optRecord;