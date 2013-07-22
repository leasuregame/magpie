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

        this.setTouchEnabled(true);

        var bgSprite = cc.Sprite.create(main_scene_image.bg);
        bgSprite.setPosition(GAME_MIDPOINT);
        this.addChild(bgSprite, -1);

        this._nameLabel = cc.LabelTTF.create("0", 'Times New Roman', 30);
        this._nameLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._nameLabel.setPosition(cc.p(200, 980));
        this.addChild(this._nameLabel);

        var lvBg = cc.Sprite.create(main_scene_image.lv_bg);
        lvBg.setPosition(cc.p(100, 950));
        this.addChild(lvBg, 1);

        this._lvLabel = cc.LabelTTF.create("0", 'Times New Roman', 45);
        this._lvLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._lvLabel.setPosition(cc.p(46, 46));
        lvBg.addChild(this._lvLabel);

        var vipSprite = cc.Sprite.create(main_scene_image.vip5);
        vipSprite.setPosition(cc.p(450, 982));
        this.addChild(vipSprite);

        this._goldLabel = cc.LabelTTF.create("", 'Times New Roman', 22);
        this._goldLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._goldLabel.setPosition(cc.p(610, 982));
        this.addChild(this._goldLabel);

        this._moneyLabel = cc.LabelTTF.create("0", 'Times New Roman', 22);
        this._moneyLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._moneyLabel.setPosition(cc.p(610, 933));
        this.addChild(this._moneyLabel);

        this._expProgress = Progress.create(main_scene_image.exp_bg, main_scene_image.exp, 0, 0);
        this._expProgress.setPosition(cc.p(240, 933));
        this.addChild(this._expProgress);

        this._powerLabel = cc.LabelTTF.create("0", 'Times New Roman', 22);
        this._powerLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._powerLabel.setPosition(cc.p(460, 933));
        this.addChild(this._powerLabel);

        this._abilityLabel = cc.LabelTTF.create("0", 'Times New Roman', 22);
        this._abilityLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._abilityLabel.setPosition(cc.p(300, 712));
        this.addChild(this._abilityLabel);

        this._rankLabel = cc.LabelTTF.create("0", 'Times New Roman', 22);
        this._rankLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._rankLabel.setPosition(cc.p(540, 712));
        this.addChild(this._rankLabel);

        var messagesLabel = MessageLabel.create();
        messagesLabel.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, 1010));
        this.addChild(messagesLabel);

        var lineUpLabel = LineUpLabel.create();
        lineUpLabel.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, 800));
        this.addChild(lineUpLabel);


        var activityLayerItem = cc.MenuItemFont.create("活动入口", this._onClickActivityLayer, this);
        activityLayerItem.setFontSize(40);
        activityLayerItem.setAnchorPoint(cc.p(0.5, 0.5));
        activityLayerItem.setPosition(cc.p(GAME_WIDTH_MIDPOINT, 650));

        var lotteryLayerItem = cc.MenuItemImage.create(main_scene_image.button5, main_scene_image.button5s, this._onClickLotteryLayer, this);
        lotteryLayerItem.setPosition(cc.p(GAME_WIDTH_MIDPOINT, 500));

        var pveLayerItem = cc.MenuItemImage.create(main_scene_image.button1, main_scene_image.button1s, this._onClickPveLayer, this);
        pveLayerItem.setPosition(cc.p(150, 600));

        var tournamentLayerItem = cc.MenuItemImage.create(main_scene_image.button2, main_scene_image.button2s, this._onClickTournamentLayer, this);
        tournamentLayerItem.setPosition(cc.p(150, 400));

        var strengthenLayerItem = cc.MenuItemImage.create(main_scene_image.button3, main_scene_image.button3s, this._onClickStrengthenLayer, this);
        strengthenLayerItem.setPosition(cc.p(570, 600));

        var evolutionLayerItem = cc.MenuItemImage.create(main_scene_image.button4, main_scene_image.button4s, this._onClickEvolutionLayer, this);
        evolutionLayerItem.setPosition(cc.p(570, 400));

        var cardLibraryLayerItem = cc.MenuItemImage.create(main_scene_image.button6, main_scene_image.button6s, this._onClickCardLibraryLayer, this);
        cardLibraryLayerItem.setPosition(cc.p(135, 250));

        var rankLayerItem = cc.MenuItemImage.create(main_scene_image.button6, main_scene_image.button6s, this._onClickRankLayerItem, this);
        rankLayerItem.setPosition(cc.p(285, 250));

        var friendLayerItem = cc.MenuItemImage.create(main_scene_image.button6, main_scene_image.button6s, this._onClickFriendLayerItem, this);
        friendLayerItem.setPosition(cc.p(435, 250));

        var configLayerItem = cc.MenuItemImage.create(main_scene_image.button6, main_scene_image.button6s, this._onClickConfigLayerItem, this);
        configLayerItem.setPosition(cc.p(585, 250));


        var itemIcon;
        for(var i = 0; i < 4; ++i) {
            itemIcon = cc.Sprite.create(main_scene_image["icon" + (i + 1)]);
            itemIcon.setPosition(cc.p(135 + i * 150, 250));
            this.addChild(itemIcon, 1);
        }

        var functionMenu = cc.Menu.create(activityLayerItem, lotteryLayerItem, pveLayerItem, tournamentLayerItem, strengthenLayerItem,
            evolutionLayerItem, cardLibraryLayerItem, rankLayerItem, friendLayerItem, configLayerItem);
        functionMenu.setPosition(cc.p(0, 0));

        this.addChild(functionMenu);

        return true;
    },

    update: function () {
        cc.log("MainLayer update");

        var player = gameData.player;

        cc.log(player);

        this._expProgress.setAllValue(player.get("maxPower"), player.get("power"));

        this._nameLabel.setString(player.get("name"));
        this._lvLabel.setString(player.get("lv"));
        this._goldLabel.setString(player.get("gold"));
        this._moneyLabel.setString(player.get("money"));
        this._powerLabel.setString(player.get("power"));
        this._abilityLabel.setString(player.get("ability"));
        this._rankLabel.setString(player.get("rank"));
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