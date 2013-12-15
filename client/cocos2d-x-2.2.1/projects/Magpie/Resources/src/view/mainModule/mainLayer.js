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

    _activityMark: null,
    _cardLibraryMark: null,
    _achievementMark: null,
    _friendMark: null,
    _messageMark: null,

    _treasureHuntGuide: null,
    _rankGuide: null,

    _spiritLayerItem: null,

    onEnter: function () {
        cc.log("MainLayer onEnter");

        this._super();
        this.updateMark();
        this.updateGuide();
        this.onTeaching();

        lz.dc.beginLogPageView("主界面");
    },

    onExit: function () {
        cc.log("MainLayer onExit");

        this._super();

        lz.dc.endLogPageView("主界面");
    },

    init: function () {
        cc.log("MainLayer init");

        if (!this._super()) return false;

        this._mainLayerFit = gameFit.mainScene.mainLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg1, this._mainLayerFit.bgSpriteRect);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._mainLayerFit.bgSpritePoint);
        this.addChild(bgSprite, -1);

        var ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect30, this);
        ccbNode.setPosition(this._mainLayerFit.spiritLayerItemPoint);
        this.addChild(ccbNode);

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

        this._activityMark = cc.BuilderReader.load(main_scene_image.uiEffect34, this);
        this._activityMark.setPosition(cc.p(75, 80));
        activityLayerItem.addChild(this._activityMark);

        var cardLibraryLayerItem = cc.MenuItemImage.create(
            main_scene_image.button53,
            main_scene_image.button53s,
            this._onClickLayer(6),
            this
        );
        cardLibraryLayerItem.setPosition(this._mainLayerFit.cardLibraryLayerItemPoint);

        this._cardLibraryMark = cc.BuilderReader.load(main_scene_image.uiEffect34, this);
        this._cardLibraryMark.setPosition(cc.p(75, 80));
        cardLibraryLayerItem.addChild(this._cardLibraryMark);

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

        this._achievementMark = cc.BuilderReader.load(main_scene_image.uiEffect34, this);
        this._achievementMark.setPosition(cc.p(75, 80));
        achievementLayerItem.addChild(this._achievementMark);

        var friendLayerItem = cc.MenuItemImage.create(
            main_scene_image.button56,
            main_scene_image.button56s,
            this._onClickLayer(9),
            this
        );
        friendLayerItem.setPosition(this._mainLayerFit.friendLayerItemPoint);

        this._friendMark = cc.Sprite.create(main_scene_image.icon289);
        this._friendMark.setPosition(cc.p(75, 80));
        friendLayerItem.addChild(this._friendMark);

        var messageItem = cc.MenuItemImage.create(
            main_scene_image.button59,
            main_scene_image.button59s,
            this._onClickLayer(10),
            this
        );
        messageItem.setPosition(this._mainLayerFit.messageItemPoint);

        this._messageMark = cc.BuilderReader.load(main_scene_image.uiEffect34, this);
        this._messageMark.setPosition(cc.p(75, 80));
        messageItem.addChild(this._messageMark);

        var configLayerItem = cc.MenuItemImage.create(
            main_scene_image.button60,
            main_scene_image.button60s,
            this._onClickLayer(11),
            this
        );

        configLayerItem.setPosition(this._mainLayerFit.configLayerItemPoint);

        var menu = cc.Menu.create(
            lotteryLayerItem,
            treasureHuntLayerItem,
            strengthenLayerItem,
            evolutionLayerItem,
            activityLayerItem,
            cardLibraryLayerItem,
            rankLayerItem,
            achievementLayerItem,
            friendLayerItem,
            messageItem,
            configLayerItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._spiritLayerItem = cc.BuilderReader.load(main_scene_image.uiEffect41, this);
        this._spiritLayerItem.setPosition(this._mainLayerFit.spiritLayerItemPoint);
        this._spiritLayerItem.controller.markEffect.setVisible(false);
        this.addChild(this._spiritLayerItem);

        var isVisible = false;
        var that = this;
        this.scheduleOnce(function () {

            var spirit = gameData.spirit;
            var spiritPool = gameData.spiritPool;

            if (spirit.canUpgrade()) {
                isVisible = true;
            } else if (spiritPool.get("collectCount") > 0) {
                isVisible = true;
            }

            that._spiritLayerItem.controller.markEffect.setVisible(isVisible);

        }, 0.1);



        return true;
    },

    _onClickSpiritItem: function () {
        cc.log("MainLayer _onClickSpiritItem");

        MainScene.getInstance().switchLayer(this._layer[0]);
        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (noviceTeachingLayer.isNoviceTeaching()) {
            noviceTeachingLayer.clearAndSave();
            noviceTeachingLayer.next();
        }

    },

    updateMark: function () {
        cc.log("MainLayer updateMark");

        this._activityMark.setVisible(gameMark.getActivityMark());
        this._cardLibraryMark.setVisible(gameMark.getCardLibraryMark());
        this._achievementMark.setVisible(gameMark.getAchievementMark());
        this._friendMark.setVisible(gameMark.getFriendMark());
        this._messageMark.setVisible(gameMark.getMessageMark());
    },

    updateGuide: function () {
        cc.log("MainLayer updateGuide");

        if (gameGuide.get("treasureHuntGuide") && !this._treasureHuntGuide) {
            this._treasureHuntGuide = cc.BuilderReader.load(main_scene_image.uiEffect43);
            this._treasureHuntGuide.setPosition(this._mainLayerFit.treasureHuntLayerItemPoint);
            this.addChild(this._treasureHuntGuide);
        }

        if (gameGuide.get("rankGuide") && !this._rankGuide) {
            this._rankGuide = cc.BuilderReader.load(main_scene_image.uiEffect43);
            this._rankGuide.setPosition(this._mainLayerFit.rankLayerItemPoint);
            this._rankGuide.setRotation(180);
            this.addChild(this._rankGuide);
        }

    },

    onTeaching: function () {
        cc.log("MainLayer onTeaching");

        if (gameGuide.get("isFirstPassiveSkillAfresh")) {
            this.set("isFirstPassiveSkillAfresh", false);
            MandatoryTeachingLayer.pop(FIRST_PASSIVE_SKILL_AFRESH);
        }

    },

    _onClickLayer: function (index) {
        return function () {
            cc.log("MainMenuLayer _onClickLayer: " + index);

            if (index == 2) {
                if (this._treasureHuntGuide) {
                    this._treasureHuntGuide.removeFromParent();
                    this._treasureHuntGuide = null;
                    gameGuide.set("treasureHuntGuide", false);
                }
            }

            if (index == 7) {
                if (this._rankGuide) {
                    this._rankGuide.removeFromParent();
                    this._rankGuide = null;
                    gameGuide.set("rankGuide", false);
                }
            }

            MainScene.getInstance().switchLayer(this._layer[index]);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            if (noviceTeachingLayer.isNoviceTeaching()) {
                noviceTeachingLayer.clearAndSave();
                noviceTeachingLayer.next();
            }

            if (mandatoryTeachingLayer) {
                if (mandatoryTeachingLayer.isTeaching()) {
                    mandatoryTeachingLayer.clearAndSave();
                    mandatoryTeachingLayer.next();
                }
            }
        }
    }
});


MainLayer.create = function () {
    var ret = new MainLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};
