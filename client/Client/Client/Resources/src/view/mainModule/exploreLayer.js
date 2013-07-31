/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-16
 * Time: 下午6:35
 * To change this template use File | Settings | File Templates.
 */


/*
* explore layer
* */


var ExploreLayer = cc.Layer.extend({
    _task: null,

    init : function() {
        cc.log("ExploreLayer init");

        if(!this._super()) return false;

        this._task = gameData.task;

        var exploreItem = cc.MenuItemFont.create("探索", this._onClickExplore, this);
        var wipeOutItem = cc.MenuItemFont.create("扫荡", this._onClickWipeOut, this);

        wipeOutItem.setPosition(cc.p(250, 400));

        var menu = cc.Menu.create(exploreItem, wipeOutItem);
        this.addChild(menu);

        this.label = cc.LabelTTF.create("探索结果：", "Times New Roman", 20);
        this.label.setAnchorPoint(cc.p(0, 0));
        this.label.setPosition(cc.p(50, 300));

        this.addChild(this.label);

        return true;
    },

    _onClickExplore: function () {
        cc.log("TaskLayer _onClickExplore");

        this._task.explore(function(data) {
            cc.log(data);
        }, 1);

//        var that = this;
//        lzWindow.pomelo.request("logic.taskHandler.explore", {playerId: GameData.player.get("id")}, function (data) {
//            cc.log(data);
//
//            if (data.code == 200) {
//                cc.log('explore success.');
//                that._explore(data.msg);
//            } else {
//                cc.log('explore faild.');
//            }
//        });
    },

    _onClickWipeOut: function() {
        cc.log("TaskLayer _onClickWipeOut");

        this._task.wipeOut(function(data) {
            cc.log(data);
        });
    },

    _explore: function (msg) {
        cc.log("TaskLayer _explore");

        var str = "";

        if (msg.result == "fight") {
            str += "遇到战斗 ----" + "消耗体力：" + msg.power_consume + "获得经验：" + msg.exp_obtain + "获得金钱：" + msg.money_obtain;
            var battleLog = BattleLog.create(msg.battle_log);
            BattleLogNote.getInstance().pushBattleLog(battleLog);
            cc.Director.getInstance().replaceScene(BattleScene.create(battleLog));
//            cc.Director.getInstance().replaceScene(cc.TransitionPageTurn.create(1, BattleScene.create(battleLog), true));
        } else if (msg.result == "box") {
            str += "遇到宝箱 ----" + "消耗体力：" + msg.power_consume + "获得经验：" + msg.exp_obtain + "获得金钱：" + msg.money_obtain + "获得卡牌：" + msg.open_box_card;
        } else if (msg.result == "none") {
            str += "正常任务 ----" + "消耗体力：" + msg.power_consume + "获得经验：" + msg.exp_obtain + "获得金钱：" + msg.money_obtain;
        } else {
            str += msg;
        }

        this.label.setString(str);
    }
})


ExploreLayer.create = function() {
    var ret = new ExploreLayer();

    if(ret && ret.init()) {
        return ret;
    }

    return null;
}