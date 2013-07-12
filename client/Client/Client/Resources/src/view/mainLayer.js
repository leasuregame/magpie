/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午11:19
 * To change this template use File | Settings | File Templates.
 */


/*
 * main layer
 * */

var MainLayer = cc.Layer.extend({
    _mainScene: null,

    init: function (mainScene) {
        cc.log("MainLayer init");

        if (!this._super()) return false;

        this._mainScene = mainScene;

        var systemMessagesLabel = cc.LayerColor.create(cc.c4b(100, 100, 0, 100), GAME_WIDTH, 30);
        systemMessagesLabel.setPosition(GAME_HORIZONTAL_LACUNA, GAME_VERTICAL_LACUNA + GAME_HEIGHT - 30);
        this.addChild(systemMessagesLabel);

        var textLabel = cc.LabelTTF.create("系统消息：有一个SB又升级失败啦。。。哇哈哈哈哈哈。", 'Times New Roman', 30);
        textLabel.setFontSize(25);
        textLabel.setAnchorPoint(cc.p(0, 0));
        systemMessagesLabel.addChild(textLabel);

//        var spacingLabel = cc.LayerColor.create(cc.c4b(220, 200, 200, 100), GAME_WIDTH, 20);
//        spacingLabel.setPosition(GAME_HORIZONTAL_LACUNA, GAME_VERTICAL_LACUNA + GAME_HEIGHT - 50);
//        this.addChild(spacingLabel);


        var playerLabel = Player.getInstance().getPlayerLabel();
        playerLabel.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, GAME_VERTICAL_LACUNA + 730));
        this.addChild(playerLabel);

//        spacingLabel = cc.LayerColor.create(cc.c4b(220, 200, 200, 100), GAME_WIDTH, 20);
//        spacingLabel.setPosition(GAME_HORIZONTAL_LACUNA, GAME_VERTICAL_LACUNA + 710);
//        this.addChild(spacingLabel);

        var activityLabel = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), GAME_WIDTH, 150);
        activityLabel.setPosition(GAME_HORIZONTAL_LACUNA, GAME_VERTICAL_LACUNA + 560);
        this.addChild(activityLabel);

        var label = cc.LabelTTF.create("活动：OO", 'Times New Roman', 30);
        label.setFontSize(130);
        label.setAnchorPoint(cc.p(0, 0));
        activityLabel.addChild(label);

//        spacingLabel = cc.LayerColor.create(cc.c4b(220, 200, 200, 100), GAME_WIDTH, 20);
//        spacingLabel.setPosition(GAME_HORIZONTAL_LACUNA, GAME_VERTICAL_LACUNA + 540);
//        this.addChild(spacingLabel);

        var teamLabel = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), GAME_WIDTH, 180);
        teamLabel.setPosition(GAME_HORIZONTAL_LACUNA, GAME_VERTICAL_LACUNA + 360);
        this.addChild(teamLabel);

//        spacingLabel = cc.LayerColor.create(cc.c4b(220, 200, 200, 100), GAME_WIDTH, 20);
//        spacingLabel.setPosition(GAME_HORIZONTAL_LACUNA, GAME_VERTICAL_LACUNA + 340);
//        this.addChild(spacingLabel);

        var functionLabel = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), GAME_WIDTH, 270);
        functionLabel.setPosition(GAME_HORIZONTAL_LACUNA, GAME_VERTICAL_LACUNA + 70);
        this.addChild(functionLabel);

//        spacingLabel = cc.LayerColor.create(cc.c4b(220, 200, 200, 100), GAME_WIDTH, 20);
//        spacingLabel.setPosition(GAME_HORIZONTAL_LACUNA, GAME_VERTICAL_LACUNA + 50);
//        this.addChild(spacingLabel);

        var task = cc.MenuItemFont.create("任务", this._onClickTask, this);
        task.setAnchorPoint(cc.p(0.5, 0.5));
        task.setPosition(150, 70);

        var barriers = cc.MenuItemFont.create("关卡", this._onClickBarriers, this);
        barriers.setAnchorPoint(cc.p(0.5, 0.5));
        barriers.setPosition(150, 200);

        var tournament = cc.MenuItemFont.create("竞技", this._onClickTournament, this);
        tournament.setAnchorPoint(cc.p(0.5, 0.5));
        tournament.setPosition(490, 70);

        var lottery = cc.MenuItemFont.create("抽奖", this._onClickLottery, this);
        lottery.setFontSize(50);
        lottery.setAnchorPoint(cc.p(0.5, 0.5));
        lottery.setPosition(320, 135);

        var strengthen = cc.MenuItemFont.create("强化", this._onClickStrengthen, this);
        strengthen.setAnchorPoint(cc.p(0.5, 0.5));
        strengthen.setPosition(490, 200);

        var menu = cc.Menu.create(task, barriers, tournament, lottery, strengthen);
        menu.setPosition(0, 0);

        functionLabel.addChild(menu);


        return true;
    },

    _onClickTask: function () {
        cc.log("MainLayer _onClickTask");
        if (this._mainScene) this._mainScene.switchLayer(TaskLayer);
    },

    _onClickBarriers: function () {
        cc.log("MainLayer _onClickBarriers");
        if (this._mainScene) this._mainScene.switchLayer(PassLayer);
    },

    _onClickTournament: function () {
        cc.log("MainLayer _onClickTournament");

        lzWindow.pomelo.request('battle.fightHandler.attack',
            {playerId: '10000', targetId: '10001'},
                function(data) {
                if (data.code == 200) {
                    cc.log('login success.');
                } else {
                    cc.log('login faild.');
                }

                cc.log(data);
                var battleLog = BattleLog.create(data.msg);
                BattleLogNote.getInstance().pushBattleLog(battleLog);
                cc.Director.getInstance().replaceScene(cc.TransitionPageTurn.create(1, BattleScene.create(battleLog), true));
            });


//        lz.HttpClientPackage.getInstance().HttpGetRequest("http://192.168.1.7:3344/vs", function (json) {
//            var battleLog = BattleLog.create(json);
//            BattleLogNote.getInstance().pushBattleLog(battleLog);
//            cc.Director.getInstance().replaceScene(BattleScene.create(battleLog));
//            cc.Director.getInstance().replaceScene(cc.TransitionPageTurn.create(1, BattleScene.create(battleLog), true));
//        }, null);
    },

    _onClickLottery: function () {
        cc.log("MainLayer _onClickLottery");
        if (this._mainScene) this._mainScene.switchLayer(LotteryLayer);
    },

    _onClickStrengthen: function () {
        cc.log("MainLayer _onClickStrengthen");
        if (this._mainScene) this._mainScene.switchLayer(StrengthenLayer);
    }
})

MainLayer.create = function (mainScene) {
    var ret = new MainLayer();

    if (ret && ret.init(mainScene)) {
        return ret;
    }

    return null;
}