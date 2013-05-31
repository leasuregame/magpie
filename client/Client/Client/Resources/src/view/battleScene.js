/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-21
 * Time: 下午4:06
 * To change this template use File | Settings | File Templates.
 */

var BattleScene = cc.Scene.extend({
    ctor : function() {
        this._super();
        cc.associateWithNative( this, cc.Scene );
    },

    onEnter : function() {
        this._super();
    },

    init : function() {
        lz.HttpClientPackage.getInstance().HttpGetRequest("http://192.168.1.7:3344/vs", this.newBattle, this);
    },

    newBattle : function(json) {
        var battleLogNote = BattleLogNote.getInstance();
        battleLogNote.pushBattleLogWithJson(json);

        var battleLog = battleLogNote.getLastBattleLog();
        cc.log(battleLog);

        this.addChild(BatterLayer.create(battleLog));
    }
})


BattleScene.create = function() {
    var ret = new BattleScene();

    if(ret) {
        ret.init()
        return ret;
    }

    return null;
}