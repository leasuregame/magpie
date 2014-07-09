var Url = require('url');
var filter = require('../util/filter');
var path = require('path');
var async = require('async');
var _ = require('underscore');
var rechargeDao = require('../dao/rechargeRecordDao');

var recharge = function(app) {

    /**
     * render recharge
     */
    app.get('/admin/recharge', filter.authorize, function(req, res) {
        res.render('recharge', {
            menu: 'recharge',
            title: '后台充值',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    /**
     * render rechargeRecord
     */
    app.get('/admin/rechargeRecord', filter.authorize, function(req, res) {
        res.render('rechargeRecord', {
            menu: 'rechargeRecord',
            title: '后台充值记录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    /**
     * 获取'后台充值记录'
     */
    app.all('/admin/api/getRechargeRecord', filter.authorize, function(req, res) {
        var reqData = req.body;
//        var reqData = req.query;
        var areaId = reqData.areaId;

        if(!areaId) {
            return res.status(500).send('ERROR : areaId is required');
        }

        var queryWhere = {
            playerId : reqData.playerIds,
            createTime : reqData.createTime
        };

        if(!(areaId instanceof Array)) {
            areaId = [areaId];
        }

        var tasks = []; // 查询函数数组
        // 构造task,分别对应每个区的查询
        for(var i in areaId) {
            (function(i){
                var tmpAreaId = areaId[i];
                tasks.push(function(cb){
                    rechargeDao.getRecords(queryWhere, tmpAreaId, function(err, rows){
                        cb(err, rows);
                    });
                });
            })(i);
        }

        async.parallel(tasks, function(err, rs){
            if (err) {
                return res.status(500).send('error when selecting recharge record, ' + err);
            }
            var rows = rs[0];
            for(var i = 1; i < rs.length; i++) {
                var tmpRows = rs[i];
                rows = rows.concat(tmpRows.splice(0, tmpRows.length));
            }
            rows.sort(function(a, b){
                return new Date(b.createTime) - new Date(a.createTime);
            });
            res.send(rows);
        });
    });

    app.post('/admin/api/getRchgSig', filter.authorize, function(req, res){
        var SALTS = ['JWj$vN_F!g','?eecCX37lg','0%OZ-Yf@l?','a938tofcqv',
            'iw57m:>s>~','d,CZ>e12j;','63dS0OZ$R#','N"WY9YU&&J',
            'Kl=.aqX)=M',';1E6BNG*(0','w17muG:gZZ','V1Ue.J)Nl9'];

        var crypto = require('crypto');

        var salt = SALTS[new Date().getHours() % SALTS.length];

        var reqData = req.body;
        var md5 = crypto.createHash('md5');
        md5.update(reqData.areaId.toString());
        md5.update(salt);
        md5.update(reqData.playerIds.toString());
        md5.update(reqData.productId.toString());
        var conPart1 = md5.digest('hex');

        md5 = crypto.createHash('md5');
        md5.update(reqData.qty.toString());
        md5.update(salt);
        md5.update(reqData.playerNames.toString());
        var conPart2 = md5.digest('hex');

        md5 = crypto.createHash('md5');
        md5.update(conPart1);
        md5.update(conPart2);

        res.send(md5.digest('hex'));
    });
};

module.exports = recharge;