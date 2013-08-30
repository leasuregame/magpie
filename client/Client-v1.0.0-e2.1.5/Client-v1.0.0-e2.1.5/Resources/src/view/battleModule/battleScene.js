/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-21
 * Time: 下午4:06
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle scene
 * */


var BattleScene = cc.Scene.extend({
    init: function (battleLog) {
        if (!this._super()) return false;

        var batterLayer = BatterLayer.create(battleLog);
        this.addChild(batterLayer);

        return true;
    }
});


BattleScene.create = function (battleLog) {
    var ret = new BattleScene();

    if (ret && ret.init(battleLog)) {
        return ret;
    }

    return null;
};