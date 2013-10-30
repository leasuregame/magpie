/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-8-25
 * Time: 下午6:29
 * To change this template use File | Settings | File Templates.
 */

var playerDao = require('./dao/mysql/playerDao');
var card = require('./card');
var table = require('./manager/table');

function Player(player) {
    this.id = player.id;
    this.name = player.name;
    this.areaId = player.areaId;
    this.power = player.power;
    this.lv = player.lv;
    this.exp = player.exp;
    this.money = player.money;
    this.gold = player.gold;
};

Player.update = function (options, cb) {

    playerDao.update(options, function (err, isOK) {
        if (err) {
            console.log(err);
            return cb(err, false);
        } else {
            return cb(null, true);
        }

    });
};

Player.getPlayerInfo = function (options, cb) {

    playerDao.getPlayerInfo(options, function (err, player) {
        if (err) {
            return cb(err, null);
        } else {
            console.log(player);
            card.setCardsName(player.cards);
            return cb(null, player);
        }
    });

};

Player.getPlayerId = function (name, areaId, cb) {
    playerDao.getPlayerInfo({where: {name: name, areaId: areaId}}, function (err, player) {
        if (err) {
            return cb('没有该玩家信息', null);
        } else {
            return cb(null, player.id);
        }
    });
};

Player.updateVip = function (id,vip,cb) {
    var cash = 0;
    if(vip > 0)
        cash = table.getTableItem('vip',vip).total_cash;
    var options = {
        where:{
            id:id
        },
        data:{
            vip:vip,
            cash:cash,
            resetDate: '1970-1-1'
        }
    };
    Player.update(options,function(err,isOK){
        if(err) {
            console.log(err);
        }else {
            cb(null,Player.getVipPrivilegeList(vip));
        }
    });
};

Player.getVipPrivilegeList = function(vip) {
    var privilege = table.getTableItem('vip_privilege',vip);
    console.log('privilege',privilege);
    return privilege;
}


module.exports = Player;

