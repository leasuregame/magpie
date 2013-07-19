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
    onEnter: function () {
        cc.log("MainLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("MainLayer init");

        if (!this._super()) return false;

        var messagesLabel = MessageLabel.create();
        messagesLabel.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, 1018));
        this.addChild(messagesLabel);

        var playerHeaderLabel = PlayerHeaderLabel.create();
        playerHeaderLabel.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, 818));
        this.addChild(playerHeaderLabel);

        var lineUpLabel = LineUpLabel.create();
        lineUpLabel.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, 648));
        this.addChild(lineUpLabel);

        var functionLabel = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), GAME_WIDTH, 470);
        functionLabel.setPosition(GAME_HORIZONTAL_LACUNA, GAME_VERTICAL_LACUNA + 70);
        this.addChild(functionLabel);

        var activityLayerItem = cc.MenuItemFont.create("活动入口", this._onClickActivityLayer, this);
        activityLayerItem.setFontSize(40);
        activityLayerItem.setAnchorPoint(cc.p(0.5, 0.5));
        activityLayerItem.setPosition(cc.p(320, 385));

        var lotteryLayerItem = cc.MenuItemFont.create("抽奖", this._onClickLotteryLayer, this);
        lotteryLayerItem.setFontSize(70);
        lotteryLayerItem.setAnchorPoint(cc.p(0.5, 0.5));
        lotteryLayerItem.setPosition(cc.p(320, 255));

        var pveLayerItem = cc.MenuItemFont.create("关卡", this._onClickPveLayer, this);
        pveLayerItem.setFontSize(40);
        pveLayerItem.setAnchorPoint(cc.p(0.5, 0.5));
        pveLayerItem.setPosition(cc.p(120, 320));

        var tournamentLayerItem = cc.MenuItemFont.create("竞技", this._onClickTournamentLayer, this);
        tournamentLayerItem.setFontSize(40);
        tournamentLayerItem.setAnchorPoint(cc.p(0.5, 0.5));
        tournamentLayerItem.setPosition(cc.p(120, 190));

        var strengthenLayerItem = cc.MenuItemFont.create("强化", this._onClickStrengthenLayer, this);
        strengthenLayerItem.setFontSize(40);
        strengthenLayerItem.setAnchorPoint(cc.p(0.5, 0.5));
        strengthenLayerItem.setPosition(cc.p(520, 320));

        var evolutionLayerItem = cc.MenuItemFont.create("进阶", this._onClickEvolutionLayer, this);
        evolutionLayerItem.setFontSize(40);
        evolutionLayerItem.setAnchorPoint(cc.p(0.5, 0.5));
        evolutionLayerItem.setPosition(cc.p(520, 190));

        var cardLibraryLayerItem = cc.MenuItemFont.create("图鉴", this._onClickCardLibraryLayer, this);
        cardLibraryLayerItem.setAnchorPoint(cc.p(0.5, 0.5));
        cardLibraryLayerItem.setPosition(cc.p(100, 70));

        var rankLayerItem = cc.MenuItemFont.create("排行榜", this._onClickRankLayerItem , this);
        rankLayerItem.setAnchorPoint(cc.p(0.5, 0.5));
        rankLayerItem.setPosition(cc.p(250, 70));

        var friendLayerItem = cc.MenuItemFont.create("好友", this._onClickFriendLayerItem, this);
        friendLayerItem.setAnchorPoint(cc.p(0.5, 0.5));
        friendLayerItem.setPosition(cc.p(400, 70));

        var configLayerItem = cc.MenuItemFont.create("设置", this._onClickConfigLayerItem, this);
        configLayerItem.setAnchorPoint(cc.p(0.5, 0.5));
        configLayerItem.setPosition(cc.p(550, 70));

        var functionMenu = cc.Menu.create(activityLayerItem, lotteryLayerItem, pveLayerItem, tournamentLayerItem, strengthenLayerItem,
            evolutionLayerItem, cardLibraryLayerItem, rankLayerItem, friendLayerItem, configLayerItem);
        functionMenu.setPosition(0, 0);

        functionLabel.addChild(functionMenu);

        return true;
    },

    update: function () {
        cc.log("MainLayer update");

    },

    _onClickActivityLayer: function() {
        cc.log("MainLayer _onClickActivityLayer");
        MainScene.getInstance().switchLayer(ActivityLayer);
    },

    _onClickLotteryLayer: function() {
        cc.log("MainLayer _onClickLotteryLayer");
        MainScene.getInstance().switchLayer(LotteryLayer);
    },

    _onClickPveLayer: function() {
        cc.log("MainLayer _onClickPveLayer");
        MainScene.getInstance().switchLayer(PveLayer);
    },

    _onClickTournamentLayer: function() {
        cc.log("MainLayer _onClickTournamentLayer");
        MainScene.getInstance().switchLayer(TournamentLayer);
    },

    _onClickStrengthenLayer: function() {
        cc.log("MainLayer _onClickStrengthenLayer");
        MainScene.getInstance().switchLayer(StrengthenLayer);
    },

    _onClickEvolutionLayer: function() {
        cc.log("MainLayer _onClickEvolutionLayer");
        MainScene.getInstance().switchLayer(EvolutionLayer);
    },

    _onClickCardLibraryLayer: function() {
        cc.log("MainLayer _onClickCardLibraryLayer");
        MainScene.getInstance().switchLayer(CardLibraryLayer);
    },

    _onClickRankLayerItem: function() {
        cc.log("MainLayer _onClickRankLayerItem");
        MainScene.getInstance().switchLayer(RankLayer);
    },

    _onClickFriendLayerItem: function() {
        cc.log("MainLayer _onClickFriendLayerItem");
        MainScene.getInstance().switchLayer(FriendLayer);
    },

    _onClickConfigLayerItem: function() {
        cc.log("MainLayer _onClickConfigLayerItem");
        MainScene.getInstance().switchLayer(ConfigLayer);
    }
})

MainLayer.create = function () {
    var ret = new MainLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}