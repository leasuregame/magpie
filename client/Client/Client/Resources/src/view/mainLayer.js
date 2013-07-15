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

        var playerLabel = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), GAME_WIDTH, 180);
        playerLabel.ignoreAnchorPointForPosition(false);
        playerLabel.setAnchorPoint(cc.p(0.5, 0));

        var nameLabel = cc.LayerColor.create(cc.c4b(100, 100, 100, 100), 180, 180);
        nameLabel.ignoreAnchorPointForPosition(false);
        nameLabel.setAnchorPoint(cc.p(0, 0));
        playerLabel.addChild(nameLabel);

        var label = cc.LabelTTF.create("lCeve", 'Times New Roman', 30);
        label.setFontSize(25);
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(90, 90);
        nameLabel.addChild(label);

        var levelLabel = cc.LayerColor.create(cc.c4b(100, 50, 100, 100), 230, 60);
        levelLabel.ignoreAnchorPointForPosition(false);
        levelLabel.setAnchorPoint(cc.p(0, 0));
        levelLabel.setPosition(180, 120);
        playerLabel.addChild(levelLabel);

        label = cc.LabelTTF.create("等级：100", 'Times New Roman', 30);
        label.setFontSize(25);
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(115, 30);
        levelLabel.addChild(label);

        var vipLabel = cc.LayerColor.create(cc.c4b(100, 100, 50, 100), 230, 60);
        vipLabel.ignoreAnchorPointForPosition(false);
        vipLabel.setAnchorPoint(cc.p(0, 0));
        vipLabel.setPosition(410, 120);
        playerLabel.addChild(vipLabel);

        label = cc.LabelTTF.create("VIP0", 'Times New Roman', 30);
        label.setFontSize(25);
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(115, 30);
        vipLabel.addChild(label);

        var ingotLabel = cc.LayerColor.create(cc.c4b(50, 100, 100, 100), 230, 60);
        ingotLabel.ignoreAnchorPointForPosition(false);
        ingotLabel.setAnchorPoint(cc.p(0, 0));
        ingotLabel.setPosition(180, 60);
        playerLabel.addChild(ingotLabel);

        label = cc.LabelTTF.create("元宝：100", 'Times New Roman', 30);
        label.setFontSize(25);
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(115, 30);
        ingotLabel.addChild(label);

        var moneyLabel = cc.LayerColor.create(cc.c4b(50, 100, 50, 100), 230, 60);
        moneyLabel.ignoreAnchorPointForPosition(false);
        moneyLabel.setAnchorPoint(cc.p(0, 0));
        moneyLabel.setPosition(410, 60);
        playerLabel.addChild(moneyLabel);

        label = cc.LabelTTF.create("仙币：10000", 'Times New Roman', 30);
        label.setFontSize(25);
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(115, 30);
        moneyLabel.addChild(label);

        var expLabel = cc.LayerColor.create(cc.c4b(100, 50, 50, 100), 230, 60);
        expLabel.ignoreAnchorPointForPosition(false);
        expLabel.setAnchorPoint(cc.p(0, 0));
        expLabel.setPosition(180, 0);
        playerLabel.addChild(expLabel);

        label = cc.LabelTTF.create("经验：500/10000", 'Times New Roman', 30);
        label.setFontSize(25);
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(115, 30);
        expLabel.addChild(label);

        var powerLabel = cc.LayerColor.create(cc.c4b(50, 50, 100, 100), 230, 60);
        powerLabel.ignoreAnchorPointForPosition(false);
        powerLabel.setAnchorPoint(cc.p(0, 0));
        powerLabel.setPosition(410, 0);
        playerLabel.addChild(powerLabel);

        label = cc.LabelTTF.create("体力：20/200", 'Times New Roman', 30);
        label.setFontSize(25);
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(115, 30);
        powerLabel.addChild(label);

//        var playerLabel = gameData.player.getPlayerLabel();
        playerLabel.setPosition(cc.p(GAME_WIDTH_MIDPOINT, GAME_VERTICAL_LACUNA + 730));
        this.addChild(playerLabel);

//        spacingLabel = cc.LayerColor.create(cc.c4b(220, 200, 200, 100), GAME_WIDTH, 20);
//        spacingLabel.setPosition(GAME_HORIZONTAL_LACUNA, GAME_VERTICAL_LACUNA + 710);
//        this.addChild(spacingLabel);

//        var activityLabel = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), GAME_WIDTH, 150);
//        activityLabel.setPosition(GAME_HORIZONTAL_LACUNA, GAME_VERTICAL_LACUNA + 560);
//        this.addChild(activityLabel);
//
//        var label = cc.LabelTTF.create("活动：OO", 'Times New Roman', 30);
//        label.setFontSize(130);
//        label.setAnchorPoint(cc.p(0, 0));
//        activityLabel.addChild(label);

//        spacingLabel = cc.LayerColor.create(cc.c4b(220, 200, 200, 100), GAME_WIDTH, 20);
//        spacingLabel.setPosition(GAME_HORIZONTAL_LACUNA, GAME_VERTICAL_LACUNA + 540);
//        this.addChild(spacingLabel);

        var lineUpLabel = LineUpLabel.create();
        lineUpLabel.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, GAME_VERTICAL_LACUNA + 560));
        this.addChild(lineUpLabel);

//        spacingLabel = cc.LayerColor.create(cc.c4b(220, 200, 200, 100), GAME_WIDTH, 20);
//        spacingLabel.setPosition(GAME_HORIZONTAL_LACUNA, GAME_VERTICAL_LACUNA + 340);
//        this.addChild(spacingLabel);

        var functionLabel = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), GAME_WIDTH, 470);
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