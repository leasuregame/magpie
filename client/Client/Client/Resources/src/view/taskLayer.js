/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-20
 * Time: 下午4:17
 * To change this template use File | Settings | File Templates.
 */


/*
 * task layer
 * */


var TaskLayer = cc.Layer.extend({
    init: function () {
        cc.log("TaskLayer init");

        if (!this._super()) return false;

        var item = cc.MenuItemFont.create("探索", this._onClickTask, this);
        var menu = cc.Menu.create(item);
        this.addChild(menu);

        this.label = cc.LabelTTF.create("探索结果：", "Times New Roman", 20);
        this.label.setAnchorPoint(cc.p(0, 0));
        this.label.setPosition(cc.p(50, 300));
        this.addChild(this.label);

        return true;
    },

    _onClickTask: function () {
        cc.log("_onClickTask");

        var that = this;
        lzWindow.pomelo.request("logic.taskHandler.explore", {playerId: 1}, function (data) {
            if (data.code == 200) {
                cc.log('explore success.');
                that._explore(data.msg);
            } else {
                cc.log('explore faild.');
                cc.log(data);
            }
        });
    },

    _explore: function (msg) {
        cc.log("TaskLayer _explore");

        var str = "";

        if (msg.result == "fight") {
            str += "遇到战斗 ----" + "消耗体力：" + msg.power_consume + "获得经验：" + msg.exp_obtain + "获得金钱：" + msg.coins_obtain;
            var battleLog = BattleLog.create(msg.battle_log);
            BattleLogNote.getInstance().pushBattleLog(battleLog);
            cc.Director.getInstance().replaceScene(cc.TransitionPageTurn.create(1, BattleScene.create(battleLog), true));
        } else if (msg.result == "box") {
            str += "遇到宝箱 ----" + "消耗体力：" + msg.power_consume + "获得经验：" + msg.exp_obtain + "获得金钱：" + msg.coins_obtain + "获得卡牌：" + msg.open_box_card;
        } else if (msg.result == "none") {
            str += "正常任务 ----" + "消耗体力：" + msg.power_consume + "获得经验：" + msg.exp_obtain + "获得金钱：" + msg.coins_obtain;
        } else {
            str += msg;
        }

        this.label.setString(str);
    }
})


TaskLayer.create = function () {
    var ret = new TaskLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}