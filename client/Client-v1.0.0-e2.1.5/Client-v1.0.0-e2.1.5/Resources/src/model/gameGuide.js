/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-11-23
 * Time: 下午4:38
 * To change this template use File | Settings | File Templates.
 */


var FUNCTION_OPEN = {
    "1": {
        "lv": 5,
        "tip": "竞技场已开启，现在可参与。",
        "name": "tournamentGuide"
    },
    "2": {
        "lv": 10,
        "tip": "天道已开启，现在可参与。",
        "name": "passGuide"
    },
    "3": {
        "lv": 15,
        "tip": "第3个卡槽已开启，现在可上阵新的卡牌。",
        "name": "card3Guide"
    },
    "4": {
        "lv": 20,
        "tip": "寻宝已开启，现在可参与。",
        "name": "treasureHuntGuide"
    },
    "5": {
        "lv": 30,
        "tip": "第4个卡槽已开启，现在可上阵新的卡牌。",
        "name": "card4Guide"
    },
    "6": {
        "lv": 40,
        "tip": "排行榜已开放，现在可进行查询。",
        "name": "rankGuide"
    },
    "7": {
        "lv": 50,
        "tip": "第5个卡槽已开启，现在可上阵新的卡牌。",
        "name": "card5Guide"
    }
};

var gameGuide = {

    _tournamentGuide: false,
    _passGuide: false,
    _treasureHuntGuide: false,
    _rankGuide: false,

    updateGuide: function() {
        var table = outputTables.function_limit.rows[1];
        var lv = gameData.player.get("lv");
        for(var i = 1; i <= 7; i++) {
            var guide = FUNCTION_OPEN[i];
            if(lv == guide.lv) {
                TipLayer.tip(guide.tip);
                this.set(guide.name, true);
                MainScene.getInstance().updateGuide();
                break;
            }

        }
    },

    get: function(name) {
        return this["_" + name];
    },

    set: function(name, value) {
        this["_" + name] = value;
    }

};