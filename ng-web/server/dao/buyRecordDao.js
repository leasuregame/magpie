var db = require('./db/db');
var sqlUtil = require('./util/sqlUtil');
var util = require('util');

// todo 充值平台来源
var PARTNER = {
    "TB" : "131232",
    "91" : "91",
    "PP" : "PP"
};

exports.getAllPlayerId = function(amount, payTime, areaId, cb) {
    if (arguments.length == 3) {
        cb = areaId;
        areaId = 1;
    }

    function isNumInRange(num, range){
        if(range instanceof Array) {
            return num >= range[0] && num <= range[1];
        } else {
            return num == range;
        }
    }

    var baseWhere = '1 = 1';

    var brAmountWhere, tbAmountWhere, brPayTimeWhere, tbPayTimeWhere;
    brAmountWhere = tbAmountWhere = brPayTimeWhere = tbPayTimeWhere = '';

    if(amount) {
        // buyRecord中,amount单位为元
        brAmountWhere = sqlUtil.buildBetweenWhere('sum(amount)', amount);
        // tbOrder中,amount单位为分
        var bigAmount = amount.concat();
        if(bigAmount instanceof Array) {
            bigAmount[0] *= 100;
            bigAmount[1] *= 100;
        } else {
            bigAmount *= 100;
        }
//          单位一致下的代码
//        if(amount instanceof Array) {
//            amount[0] *= 100;
//            amount[1] *= 100;
//        } else {
//            amount *= 100;
//        }
//        tbAmountWhere = sqlUtil.buildBetweenWhere('sum(amount)', amount);

        // todo 兼容tbOrder中amount存在单位不一样的情况,日后情况解决后屏蔽
        // todo 同时按元与按分搜索sum(amount)
        tbAmountWhere = sqlUtil.buildBetweenWhere('sum(amount)', amount);
        var tbBigAmountWhere = sqlUtil.buildBetweenWhere('sum(amount)', bigAmount);
        tbAmountWhere = util.format(" and (1=1 %s or 1=1 %s)", tbAmountWhere, tbBigAmountWhere);
    }

    if(payTime) {
        brPayTimeWhere = sqlUtil.buildBetweenWhere('purchaseDate', payTime);
        tbPayTimeWhere = sqlUtil.buildBetweenWhere('created', payTime);
    }

    var brSql = 'select playerId, sum(amount) as amount from buyRecord where isVerify = 1 ' + brPayTimeWhere +
        ' group by playerId having '+ baseWhere + brAmountWhere;

    db(areaId).query(brSql, function (err, rows) {
        var brRows = rows ? rows : [];
        var tbSql = 'select playerId, partner, sum(amount) as amount from tbOrder where status = 2000 ' + tbPayTimeWhere +
            ' group by playerId having '+ baseWhere + tbAmountWhere;

        db(areaId).query(tbSql, function (err, rows) {
            // todo 兼容tbOrder中amount存在单位不一样的情况,日后情况解决后屏蔽
            // todo 按平台转换sum(amount)单位, 再按照转换后数值进行筛选
            for(var i = 0; i < rows.length; i++) {
                var row = rows[i];

                if(row["partner"] != PARTNER.TB) {
                    if(!isNumInRange(row["amount"], amount)) {
                        rows.splice(i * 1, 1);
                        i--;
                    }
                } else {
                    if(!isNumInRange(row["amount"], bigAmount)) {
                        rows.splice(i * 1, 1);
                        i--;
                    }
                }
            }

            cb(err, rows.concat(brRows));
        });
    });
};