/**
 * Created by lujunyu on 14-1-24.
 */

var TYPE_CARD_TIPS = 0;
var TYPE_PASSIVE_SKILL_AFRESH_TIPS = 1;
var TYPE_PASSIVE_SKILL_OPEN_TIPS = 2;
var TYPE_REMOVE_CD_TIPS = 3;
var TYPE_EXCHANGE_CARD_TIPS = 4;
var TYPE_BUY_GROWTH_PLAN = 5;

var spendFailTip = {
    gold: "魔石不足",
    money: "仙币不足",
    fragment: "卡魂不足"
};

var AdvancedTipsLabel = LazyLayer.extend({

    _cb: null,
    _spend: null,
    _frameLayer: null,
    _otherData: null,

    init: function (type, cb, otherData) {
        cc.log("AdvancedTipsLabel init");

        if (!this._super()) return false;

        this._cb = cb;
        this._otherData = otherData || {};

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        this._frameLayer = cc.Node.create();
        this._frameLayer.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(this._frameLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(550, 250));
        bgSprite.setPosition(cc.p(0, 0));
        this._frameLayer.addChild(bgSprite);

        var msgBgIcon = cc.Sprite.create(main_scene_image.icon175);
        msgBgIcon.setPosition(cc.p(0, 30));
        msgBgIcon.setScaleX(0.95);
        this._frameLayer.addChild(msgBgIcon);

        var cancelItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon308,
            this._onClickCancel,
            this
        );
        cancelItem.setPosition(cc.p(120, -60));

        var continueItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickContinue,
            this
        );
        continueItem.setPosition(cc.p(-120, -60));

        var menu = cc.Menu.create(cancelItem, continueItem);
        menu.setPosition(cc.p(0, 0));
        this._frameLayer.addChild(menu);

        if (type == TYPE_PASSIVE_SKILL_OPEN_TIPS) {
            this.setTouchPriority(CARD_DETAILS_LAYER_HANDLER_PRIORITY);
            menu.setTouchPriority(CARD_DETAILS_LAYER_HANDLER_PRIORITY);
        }

        this._initWithTipsType(type);

        return true;
    },

    _initWithTipsType: function (tipsType) {
        switch (tipsType) {
            case TYPE_CARD_TIPS:
                this._initCardTips();
                break;
            case TYPE_PASSIVE_SKILL_AFRESH_TIPS:
                this._initPassiveSkillAfreshTips();
                break;
            case TYPE_PASSIVE_SKILL_OPEN_TIPS:
                this._initPassiveSKillOpenTips();
                break;
            case  TYPE_REMOVE_CD_TIPS:
                this._initRemoveCdTips();
                break;
            case TYPE_EXCHANGE_CARD_TIPS:
                this._initExchangeCardTips();
                break;
            case TYPE_BUY_GROWTH_PLAN:
                this._initBuyGrowthPlanTips();
                break;
        }
    },

    _initCardTips: function () {
        cc.log("AdvancedTipsLabel _initCardTips");

        var tipLabel = cc.LabelTTF.create("所选卡牌中有4星以上卡牌，确定继续么", "STHeitiTC-Medium", 25);
        tipLabel.setPosition(cc.p(0, 30));
        this._frameLayer.addChild(tipLabel);
    },

    _initPassiveSkillAfreshTips: function () {
        var tipLabel = cc.LabelTTF.create("当前被动组合有金色属性，继续洗练么", "STHeitiTC-Medium", 25);
        tipLabel.setPosition(cc.p(0, 30));
        this._frameLayer.addChild(tipLabel);
    },

    _initPassiveSKillOpenTips: function () {
        cc.log("AdvancedTipsLabel _initPassiveSKillOpenTips");

        var needGold = this._otherData.card.getOpenPassiveSkillNeedGold();

        var tipsLabel = ColorLabelTTF.create(
            {
                string: "是否确定花费" + needGold,
                fontName: "STHeitiTC-Medium",
                fontSize: 25
            },
            {
                iconName: "gold",
                scale: 0.7
            },
            {
                string: "开启新的被动组合",
                fontName: "STHeitiTC-Medium",
                fontSize: 25
            }
        );
        tipsLabel.setPosition(cc.p(0, 30));
        tipsLabel.setAnchorPoint(cc.p(0.5, 0));
        this._frameLayer.addChild(tipsLabel);

        this._spend = {
            type: "gold",
            num: needGold
        }
    },

    _initRemoveCdTips: function () {
        cc.log("AdvancedTipsLabel _initRemoveCdTips");

        var needGold = gameData.boss.removeCdNeedGold();

        var tipsLabel = ColorLabelTTF.create(
            {
                string: "是否确定花费" + needGold,
                fontName: "STHeitiTC-Medium",
                fontSize: 25
            },
            {
                iconName: "gold",
                scale: 0.7
            },
            {
                string: "消除冷却时间",
                fontName: "STHeitiTC-Medium",
                fontSize: 25
            }
        );
        tipsLabel.setPosition(cc.p(0, 30));
        tipsLabel.setAnchorPoint(cc.p(0.5, 0));
        this._frameLayer.addChild(tipsLabel);

        this._spend = {
            type: "gold",
            num: needGold
        }

    },

    _initExchangeCardTips: function() {
        cc.log("AdvancedTipsLabel _initExchangeCardTips");

        var needFragment = this._otherData.fragment;

        var tipsLabel = ColorLabelTTF.create(
            {
                string: "是否确定消耗" + needFragment,
                fontName: "STHeitiTC-Medium",
                fontSize: 25
            },
            {
                iconName: "fragment",
                scale: 0.8
            },
            {
                string: "兑换该卡牌",
                fontName: "STHeitiTC-Medium",
                fontSize: 25
            }
        );
        tipsLabel.setPosition(cc.p(0, 30));
        tipsLabel.setAnchorPoint(cc.p(0.5, 0));
        this._frameLayer.addChild(tipsLabel);

        this._spend = {
            type: "fragment",
            num: needFragment
        }
    },

    _initBuyGrowthPlanTips: function () {
        cc.log("AdvancedTipsLabel _initBuyGrowthPlanTips");

        var needGold = 1000;

        var tipsLabel = ColorLabelTTF.create(
            {
                string: "是否确定花费" + needGold,
                fontName: "STHeitiTC-Medium",
                fontSize: 25
            },
            {
                iconName: "gold",
                scale: 0.7
            },
            {
                string: "购买成长计划",
                fontName: "STHeitiTC-Medium",
                fontSize: 25
            }
        );
        tipsLabel.setPosition(cc.p(0, 30));
        tipsLabel.setAnchorPoint(cc.p(0.5, 0));
        this._frameLayer.addChild(tipsLabel);

        this._spend = {
            type: "gold",
            num: needGold
        }
    },

    _onClickCancel: function () {
        cc.log("AdvancedTipsLabel _onClickCancel");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();
    },

    _onClickContinue: function () {
        cc.log("AdvancedTipsLabel _onClickContinue");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();

        if (this._spend) {
            var type = this._spend.type;
            if (gameData.player.get(type) < this._spend.num) {
                TipLayer.tip(spendFailTip[type]);
                return;
            }
        }

        if (this._cb) {
            this._cb();
        }

    }

});

AdvancedTipsLabel.create = function (type, cb, otherData) {
    cc.log("AdvancedTipsLabel create");

    var ref = new AdvancedTipsLabel();

    if (ref && ref.init(type, cb, otherData)) {
        return ref;
    }

    return null;
};

AdvancedTipsLabel.pop = function (type, cb, otherData) {
    cc.log("AdvancedTipsLabel pop");

    var advancedTipsLabel = AdvancedTipsLabel.create(type, cb, otherData);

    if (type != TYPE_PASSIVE_SKILL_OPEN_TIPS) {
        MainScene.getInstance().getLayer().addChild(advancedTipsLabel, 10);
    } else {
        cc.Director.getInstance().getRunningScene().addChild(advancedTipsLabel, 10);
    }
};
