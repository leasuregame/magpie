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
    _mainLayerFit: null,

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
        MessageLayer,
        ConfigLayer
    ],

    init: function () {
        cc.log("MainLayer init");

        if (!this._super()) return false;

        this._mainLayerFit = gameFit.mainScene.mainLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg1, this._mainLayerFit.bgSpriteRect);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._mainLayerFit.bgSpritePoint);
        this.addChild(bgSprite, -1);

        var playerHeaderLabel = PlayerHeaderLabel.create();
        playerHeaderLabel.setPosition(this._mainLayerFit.playerHeaderLabelPoint);
        this.addChild(playerHeaderLabel);

        var lineIcon = cc.Sprite.create(main_scene_image.icon285);
        lineIcon.setAnchorPoint(cc.p(0, 0));
        lineIcon.setPosition(this._mainLayerFit.lineIconPoint);
        this.addChild(lineIcon);
        var player = gameData.player;

        var abilityLabelIcon = cc.Sprite.create(main_scene_image.icon286);
        abilityLabelIcon.setAnchorPoint(cc.p(0, 0));
        abilityLabelIcon.setPosition(this._mainLayerFit.abilityLabelIconPoint);
        this.addChild(abilityLabelIcon);
        var abilityLabel = cc.LabelTTF.create(player.getAbility(), "STHeitiTC-Medium", 22);
        abilityLabel.setAnchorPoint(cc.p(0, 0.5));
        abilityLabel.setPosition(this._mainLayerFit.abilityLabelPoint);
        this.addChild(abilityLabel);

        var rankingLabel = cc.LabelTTF.create(gameData.tournament.get("ranking"), "STHeitiTC-Medium", 22);
        rankingLabel.setAnchorPoint(cc.p(0, 0.5));
        rankingLabel.setPosition(this._mainLayerFit.rankingLabelPoint);
        this.addChild(rankingLabel);

        var lineUpLabel = LineUpLabel.create();
        lineUpLabel.setPosition(this._mainLayerFit.lineUpLabelPoint);
        this.addChild(lineUpLabel);

        var spiritLayerItem = cc.MenuItemImage.create(
            main_scene_image.button1,
            main_scene_image.button1s,
            this._onClickLayer(0),
            this
        );
        spiritLayerItem.setPosition(this._mainLayerFit.spiritLayerItemPoint);

        var lotteryLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button2,
            main_scene_image.button2s,
            main_scene_image.icon5,
            this._onClickLayer(1),
            this
        );
        lotteryLayerItem.setOffset(cc.p(-5, 5));
        lotteryLayerItem.setPosition(this._mainLayerFit.lotteryLayerItemPoint);

        var treasureHuntLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button2,
            main_scene_image.button2s,
            main_scene_image.icon6,
            this._onClickLayer(2),
            this
        );
        treasureHuntLayerItem.setOffset(cc.p(-5, 5));
        treasureHuntLayerItem.setPosition(this._mainLayerFit.treasureHuntLayerItemPoint);

        var strengthenLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button2,
            main_scene_image.button2s,
            main_scene_image.icon7,
            this._onClickLayer(3),
            this
        );
        strengthenLayerItem.setOffset(cc.p(-5, 5));
        strengthenLayerItem.setPosition(this._mainLayerFit.strengthenLayerItemPoint);

        var evolutionLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button2,
            main_scene_image.button2s,
            main_scene_image.icon8,
            this._onClickLayer(4),
            this
        );
        evolutionLayerItem.setOffset(cc.p(-5, 5));
        evolutionLayerItem.setPosition(this._mainLayerFit.evolutionLayerItemPoint);

        var activityLayerItem = cc.MenuItemImage.create(
            main_scene_image.button52,
            main_scene_image.button52s,
            this._onClickLayer(5),
            this
        );
        activityLayerItem.setPosition(this._mainLayerFit.activityLayerItemPoint);

        var cardLibraryLayerItem = cc.MenuItemImage.create(
            main_scene_image.button53,
            main_scene_image.button53s,
            this._onClickLayer(6),
            this
        );
        cardLibraryLayerItem.setPosition(this._mainLayerFit.cardLibraryLayerItemPoint);

        var rankLayerItem = cc.MenuItemImage.create(
            main_scene_image.button54,
            main_scene_image.button54s,
            this._onClickLayer(7),
            this
        );
        rankLayerItem.setPosition(this._mainLayerFit.rankLayerItemPoint);

        var achievementLayerItem = cc.MenuItemImage.create(
            main_scene_image.button55,
            main_scene_image.button55s,
            this._onClickLayer(8),
            this
        );
        achievementLayerItem.setPosition(this._mainLayerFit.achievementLayerItemPoint);

        var friendLayerItem = cc.MenuItemImage.create(
            main_scene_image.button56,
            main_scene_image.button56s,
            this._onClickLayer(9),
            this
        );
        friendLayerItem.setPosition(this._mainLayerFit.friendLayerItemPoint);

        var otherItem = cc.MenuItemImage.create(
            main_scene_image.button57,
            main_scene_image.button57s,
            this._onClickOther,
            this
        );
        otherItem.setPosition(this._mainLayerFit.otherItemPoint);

        var messageItem = cc.MenuItemImage.create(
            main_scene_image.button59,
            main_scene_image.button59,
            this._onClickLayer(10),
            this
        );
        messageItem.setPosition(this._mainLayerFit.messageItemPoint);

        var configLayerItem = cc.MenuItemImage.create(
            main_scene_image.button60,
            main_scene_image.button60,
            this._onClickLayer(11),
            this
        );
        configLayerItem.setPosition(this._mainLayerFit.configLayerItemPoint);

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

            MainScene.getInstance().switchLayer(this._layer[index]);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            if (NoviceTeachingLayer.getInstance().isNoviceTeaching()) {
                NoviceTeachingLayer.getInstance().clearAndSave();
                NoviceTeachingLayer.getInstance().next();
            }
        }
    },

    _onClickOther: function () {
        this._otherMenu.setVisible(!this._otherMenu.isVisible());

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
    }
});


MainLayer.create = function () {
    var ret = new MainLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};