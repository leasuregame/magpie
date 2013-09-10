/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-11
 * Time: 上午12:26
 * To change this template use File | Settings | File Templates.
 */

var battle = require('../../game-server/src/app/battle/battle.coffee');
var battleLog = require('../../game-server/src/app/battle/battle_log');

function Battle() {};

Battle.startBattle = function(attacker,defender) {
    console.log(battle);
    var battle = new battle(attacker,defender);
    battle.process();
};

Battle.getBattleLog = function() {
    var log = battleLog;
    return log;
};

module.exports = Battle;
