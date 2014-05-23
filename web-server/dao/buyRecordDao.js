var db = require('./db/db');
var sqlUtil = require('./util/sqlUtil');

exports.getAllPlayerId = function(amount, payTime, areaId, cb) {
    if (arguments.length == 3) {
        cb = areaId;
        areaId = 1;
    }

    var baseWhere = '1 = 1';

    var brAmountWhere, tbAmountWhere, brPayTimeWhere, tbPayTimeWhere;
    brAmountWhere = tbAmountWhere = brPayTimeWhere = tbPayTimeWhere = '';

    if(amount) {
        // buyRecord中,amount单位为元
        brAmountWhere = sqlUtil.buildBetweenWhere('sum(amount)', amount);
        // tbOrder中,amount单位为分
        if(amount instanceof Array) {
            amount[0] *= 100;
            amount[1] *= 100;
        } else {
            amount *= 100;
        }
        tbAmountWhere = sqlUtil.buildBetweenWhere('sum(amount)', amount);
    }

    if(payTime) {
        brPayTimeWhere = sqlUtil.buildBetweenWhere('purchaseDate', payTime);
        tbPayTimeWhere = sqlUtil.buildBetweenWhere('created', payTime);
    }

    var brSql = 'select playerId from buyRecord where ' + baseWhere + brPayTimeWhere +
        ' group by playerId having '+ baseWhere + brAmountWhere;

    console.log('brSql', brSql);

    db(areaId).query(brSql, function (err, rows) {
        var brRows = rows ? rows : [];
        var tbSql = 'select playerId from tbOrder where ' + baseWhere + tbPayTimeWhere +
            ' group by playerId having '+ baseWhere + tbAmountWhere;
        console.log('tbSql', tbSql);
        db(areaId).query(tbSql, function (err, rows) {
            cb(err, rows.concat(brRows));
        });
    });
};