/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-8-25
 * Time: 下午6:29
 * To change this template use File | Settings | File Templates.
 */

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



module.exports = Player;

