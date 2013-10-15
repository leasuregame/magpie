/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-8-25
 * Time: 下午6:29
 * To change this template use File | Settings | File Templates.
 */

var playerDao = require('./dao/mysql/playerDao');
var card = require('./card');


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


module.exports = Player;

