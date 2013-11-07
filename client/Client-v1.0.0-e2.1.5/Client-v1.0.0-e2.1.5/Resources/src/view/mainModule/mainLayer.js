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
    _mainLayer: gameFit.mainScene.mainLayer,

    _layer: [
        SpiritPoolLayer,
        LotteryLayer,
        TreasureHuntLayer,
        StrengthenLayer,
        EvolutionLayer,
        ActivityLayer,
        CardLibraryLayer,
        RankLayer,
        AchievementLayer,
        FriendLayer,
        SignInLayer,
        MessageLayer,
        ConfigLayer
    ],

    init: function () {
        cc.log("MainLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.bg1);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._mainLayer.bgSpritePoint);
      //  this.addChild(bgSprite, -1);

        var playerHeaderLabel = PlayerHeaderLabel.create();
        playerHeaderLabel.setPosition(this._mainLayer.playerHeaderLabelPoint);
        this.addChild(playerHeaderLabel);

        var player = gameData.player;

        var abilityLabel = cc.LabelTTF.create(player.getAbility(), "STHeitiTC-Medium", 22);
        abilityLabel.setAnchorPoint(cc.p(0.5, 0.5));
        abilityLabel.setPosition(this._mainLayer.abilityLabelPoint);
        this.addChild(abilityLabel);

        var rankingLabel = cc.LabelTTF.create(gameData.tournament.get("ranking"), "STHeitiTC-Medium", 22);
        rankingLabel.setAnchorPoint(cc.p(0.5, 0.5));
        rankingLabel.setPosition(this._mainLayer.rankingLabelPoint);
        this.addChild(rankingLabel);

        var lineUpLabel = LineUpLabel.create();
        lineUpLabel.setPosition(this._mainLayer.lineUpLabelPoint);
        this.addChild(lineUpLabel);

        var spiritLayerItem = cc.MenuItemImage.create(
            main_scene_image.button1,
            main_scene_image.button1s,
            this._onClickLayer(0),
            this
        );
        spiritLayerItem.setPosition(this._mainLayer.spiritLayerItemPoint);

        var lotteryLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button2,
            main_scene_image.button2s,
            main_scene_image.icon5,
            this._onClickLayer(1),
            this
        );
        lotteryLayerItem.setOffset(cc.p(-5, 5));
        lotteryLayerItem.setPosition(this._mainLayer.lotteryLayerItemPoint);

        var treasureHuntLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button2,
            main_scene_image.button2s,
            main_scene_image.icon6,
            this._onClickLayer(2),
            this
        );
        treasureHuntLayerItem.setOffset(cc.p(-5, 5));
        treasureHuntLayerItem.setPosition(this._mainLayer.treasureHuntLayerItemPoint);

        var strengthenLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button2,
            main_scene_image.button2s,
            main_scene_image.icon7,
            this._onClickLayer(3),
            this
        );
        strengthenLayerItem.setOffset(cc.p(-5, 5));
        strengthenLayerItem.setPosition(this._mainLayer.strengthenLayerItemPoint);

        var evolutionLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button2,
            main_scene_image.button2s,
            main_scene_image.icon8,
            this._onClickLayer(4),
            this
        );
        evolutionLayerItem.setOffset(cc.p(-5, 5));
        evolutionLayerItem.setPosition(this._mainLayer.evolutionLayerItemPoint);

        var activityLayerItem = cc.MenuItemImage.create(
            main_scene_image.button52,
            main_scene_image.button52s,
            this._onClickLayer(5),
            this
        );
        activityLayerItem.setPosition(this._mainLayer.activityLayerItemPoint);

        var cardLibraryLayerItem = cc.MenuItemImage.create(
            main_scene_image.button53,
            main_scene_image.button53s,
            this._onClickLayer(6),
            this
        );
        cardLibraryLayerItem.setPosition(this._mainLayer.cardLibraryLayerItemPoint);

        var rankLayerItem = cc.MenuItemImage.create(
            main_scene_image.button54,
            main_scene_image.button54s,
            this._onClickLayer(7),
            this
        );
        rankLayerItem.setPosition(this._mainLayer.rankLayerItemPoint);

        var achievementLayerItem = cc.MenuItemImage.create(
            main_scene_image.button55,
            main_scene_image.button55s,
            this._onClickLayer(8),
            this
        );
        achievementLayerItem.setPosition(this._mainLayer.achievementLayerItemPoint);

        var friendLayerItem = cc.MenuItemImage.create(
            main_scene_image.button56,
            main_scene_image.button56s,
            this._onClickLayer(9),
            this
        );
        friendLayerItem.setPosition(this._mainLayer.friendLayerItemPoint);

        var otherItem = cc.MenuItemImage.create(
            main_scene_image.button57,
            main_scene_image.button57s,
            this._onClickOther,
            this
        );
        otherItem.setPosition(this._mainLayer.otherItemPoint);

//         var signInLayerItem = cc.MenuItemImage.create(
//         main_scene_image.button58,
//         main_scene_image.button58s,
//         this._onClickLayer(10),
//         this
//         );
//         signInLayerItem.setPosition(cc.p(414, 322));

        var messageItem = cc.MenuItemImage.create(
            main_scene_image.button59,
            main_scene_image.button59,
            this._onClickLayer(11),
            this
        );
        messageItem.setPosition(this._mainLayer.messageItemPoint);

        var configLayerItem = cc.MenuItemImage.create(
            main_scene_image.button60,
            main_scene_image.button60,
            this._onClickLayer(12),
            this
        );
        configLayerItem.setPosition(this._mainLayer.configLayerItemPoint);

        var menu = cc.Menu.create(
            spiritLayerItem,
            lotteryLayerItem,
            treasureHuntLayerItem,
            strengthenLayerItem,
            evolutionLayerItem,
            activityLayerItem,
            cardLibraryLayerItem,
            rankLayerItem,
            achievementLayerItem,
            friendLayerItem,
            otherItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._otherMenu = cc.Menu.create(
            // signInLayerItem,
            messageItem,
            configLayerItem
        );
        this._otherMenu.setPosition(cc.p(0, 0));
        this.addChild(this._otherMenu);
        this._otherMenu.setVisible(false);

        return true;
    },

    _onClickLayer: function (index) {
        return function () {
            cc.log("MainMenuLayer _onClickLayer: " + index);

            if (NoviceTeachingLayer.getInstance().isNoviceTeaching()) {
                NoviceTeachingLayer.getInstance().clearAndSave();
                NoviceTeachingLayer.getInstance().next();
            }

            MainScene.getInstance().switchLayer(this._layer[index]);
        }
    },

    _onClickOther: function () {
        this._otherMenu.setVisible(!this._otherMenu.isVisible());
    }
});


MainLayer.create = function () {
    var ret = new MainLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};