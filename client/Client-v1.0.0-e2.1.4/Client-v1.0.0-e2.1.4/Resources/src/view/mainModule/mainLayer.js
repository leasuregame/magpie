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

        var bgSprite = cc.Sprite.create(main_scene_image.bg1);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite, -1);

        var playerHeaderLabel = PlayerHeaderLabel.create();
        playerHeaderLabel.setPosition(cc.p(40, 890));
        this.addChild(playerHeaderLabel);

        this._abilityLabel = cc.LabelTTF.create("0", '黑体', 22);
        this._abilityLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._abilityLabel.setPosition(cc.p(300, 700));
        this.addChild(this._abilityLabel);

        this._rankLabel = cc.LabelTTF.create("0", '黑体', 22);
        this._rankLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._rankLabel.setPosition(cc.p(530, 700));
        this.addChild(this._rankLabel);

        var lineUpLabel = LineUpLabel.create();
        lineUpLabel.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, 800));
        this.addChild(lineUpLabel);


//        var activityLayerItem = cc.MenuItemFont.create("活动入口", this._onClickActivityLayer, this);
//        activityLayerItem.setFontSize(40);
//        activityLayerItem.setAnchorPoint(cc.p(0.5, 0.5));
//        activityLayerItem.setPosition(cc.p(GAME_WIDTH_MIDPOINT, 650));

        var lotteryLayerItem = cc.MenuItemImage.create(main_scene_image.button5, main_scene_image.button5s, this._onClickLotteryLayer, this);
        lotteryLayerItem.setPosition(cc.p(GAME_WIDTH_MIDPOINT, 500));

        var pveLayerItem = cc.MenuItemImage.create(main_scene_image.button1, main_scene_image.button1s, this._onClickPveLayer, this);
        pveLayerItem.setPosition(cc.p(180, 600));

        var tournamentLayerItem = cc.MenuItemImage.create(main_scene_image.button2, main_scene_image.button2s, this._onClickTournamentLayer, this);
        tournamentLayerItem.setPosition(cc.p(180, 400));

        var strengthenLayerItem = cc.MenuItemImage.create(main_scene_image.button3, main_scene_image.button3s, this._onClickStrengthenLayer, this);
        strengthenLayerItem.setPosition(cc.p(555, 600));

        var evolutionLayerItem = cc.MenuItemImage.create(main_scene_image.button4, main_scene_image.button4s, this._onClickEvolutionLayer, this);
        evolutionLayerItem.setPosition(cc.p(555, 400));

        var cardLibraryLayerItem = cc.MenuItemImage.create(main_scene_image.button26, main_scene_image.button26s, this._onClickCardLibraryLayer, this);
        cardLibraryLayerItem.setPosition(cc.p(135, 250));

        var rankLayerItem = cc.MenuItemImage.create(main_scene_image.button27, main_scene_image.button27s, this._onClickRankLayer, this);
        rankLayerItem.setPosition(cc.p(285, 250));

        var friendLayerItem = cc.MenuItemImage.create(main_scene_image.button28, main_scene_image.button28s, this._onClickFriendLayer, this);
        friendLayerItem.setPosition(cc.p(435, 250));

        var configLayerItem = cc.MenuItemImage.create(main_scene_image.button29, main_scene_image.button29s, this._onClickConfigLayer, this);
        configLayerItem.setPosition(cc.p(585, 250));

        var functionMenu = cc.Menu.create(lotteryLayerItem, pveLayerItem, tournamentLayerItem, strengthenLayerItem,
            evolutionLayerItem, cardLibraryLayerItem, rankLayerItem, friendLayerItem, configLayerItem);
        functionMenu.setPosition(cc.p(0, 0));

        this.addChild(functionMenu);

        return true;
    },

    update: function () {
        cc.log("MainLayer update");

        var player = gameData.player;

        cc.log(player);

        this._abilityLabel.setString(player.get("ability"));
        this._rankLabel.setString(player.get("rank"));
    },

    _onClickActivityLayer: function () {
        cc.log("MainLayer _onClickActivityLayer");
        MainScene.getInstance().switchLayer(ActivityLayer);
    },

    _onClickLotteryLayer: function () {
        cc.log("MainLayer _onClickLotteryLayer");
        MainScene.getInstance().switchLayer(LotteryLayer);
    },

    _onClickPveLayer: function () {
        cc.log("MainLayer _onClickPveLayer");
        MainScene.getInstance().switchLayer(PveLayer);
    },

    _onClickTournamentLayer: function () {
        cc.log("MainLayer _onClickTournamentLayer");
        MainScene.getInstance().switchLayer(TournamentLayer);
    },

    _onClickStrengthenLayer: function () {
        cc.log("MainLayer _onClickStrengthenLayer");
        MainScene.getInstance().switchLayer(StrengthenLayer);
    },

    _onClickEvolutionLayer: function () {
        cc.log("MainLayer _onClickEvolutionLayer");
        MainScene.getInstance().switchLayer(EvolutionLayer);
    },

    _onClickCardLibraryLayer: function () {
        cc.log("MainLayer _onClickCardLibraryLayer");
        MainScene.getInstance().switchLayer(CardLibraryLayer);
    },

    _onClickRankLayer: function () {
        cc.log("MainLayer _onClickRankLayerItem");
        MainScene.getInstance().switchLayer(RankLayer);
    },

    _onClickFriendLayer: function () {
        cc.log("MainLayer _onClickFriendLayerItem");
        MainScene.getInstance().switchLayer(FriendLayer);
    },

    _onClickConfigLayer: function () {
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