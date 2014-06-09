/**
 * Created by lujunyu on 14-5-20.
 */

var CardSmeltLabel = cc.Layer.extend({
    _cardSmeltLabelFit: null,

    _smelter: null,
    _retinueCard: null,
    _tipLabel: null,
    _helpLabel: null,
    _pillLabel: null,
    _moneyLabel: null,
    _smeltItem: null,
    _getGoods: null,

    onEnter: function () {
        cc.log("CardSmeltLabel onEnter");

        this._super();
        this.update();
    },

    onExit: function () {
        this._super();
    },

    init: function () {
        cc.log("CardSmeltLabel init");

        if (!this._super()) return false;

        this._cardSmeltLabelFit = gameFit.mainScene.cardSmeltLabel;

        this._retinueCard = [];

        this._smelter = cc.BuilderReader.load(main_scene_image.uiEffect114, this);
        this._smelter.setPosition(this._cardSmeltLabelFit.smelterPoint);
        this.addChild(this._smelter);

        var pillIcon = cc.Sprite.create(main_scene_image.icon459);
        pillIcon.setPosition(this._cardSmeltLabelFit.pillIconPoint);
        this.addChild(pillIcon);

        var pillIconLabel = cc.LabelTTF.create("觉醒玉:", "STHeitiTC-Medium", 22);
        pillIconLabel.setColor(cc.c3b(255, 239, 131));
        pillIconLabel.setPosition(this._cardSmeltLabelFit.pillIconLabelPoint);
        this.addChild(pillIconLabel);

        this._pillLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._pillLabel.setAnchorPoint(cc.p(0, 0.5));
        this._pillLabel.setPosition(this._cardSmeltLabelFit.pillLabelPoint);
        this.addChild(this._pillLabel);

        var helpBgSprite = cc.Sprite.create(main_scene_image.icon50);
        helpBgSprite.setPosition(this._cardSmeltLabelFit.helpBgSpritePoint);
        this.addChild(helpBgSprite);

        this._tipLabel = cc.LabelTTF.create("晶晶电饭煲钟情于熔炼卡牌，产出觉醒玉", "STHeitiTC-Medium", 22);
        this._tipLabel.setPosition(this._cardSmeltLabelFit.tipLabelPoint);
        this.addChild(this._tipLabel);

        this._helpLabel = cc.Node.create();
        this._helpLabel.setPosition(this._cardSmeltLabelFit.helpLabelPoint);
        this.addChild(this._helpLabel);

        var gotLabel = cc.LabelTTF.create("本次熔炼可获得", "STHeitiTC-Medium", 22);
        gotLabel.setPosition(cc.p(0, 20));
        this._helpLabel.addChild(gotLabel);

        var gotPillIcon = cc.Sprite.create(main_scene_image.icon459);
        gotPillIcon.setPosition(cc.p(-150, -15));
        this._helpLabel.addChild(gotPillIcon);

        this._gotPillLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._gotPillLabel.setAnchorPoint(cc.p(0, 0.5));
        this._gotPillLabel.setPosition(cc.p(-130, -15));
        this._helpLabel.addChild(this._gotPillLabel);

        var moneyIcon = cc.Sprite.create(main_scene_image.icon149);
        moneyIcon.setPosition(cc.p(70, -15));
        this._helpLabel.addChild(moneyIcon);

        this._gotMoneyLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._gotMoneyLabel.setAnchorPoint(cc.p(0, 0.5));
        this._gotMoneyLabel.setPosition(cc.p(95, -15));
        this._helpLabel.addChild(this._gotMoneyLabel);

        this._smeltItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon460,
            this._onClickSmelt,
            this
        );
        this._smeltItem.setPosition(this._cardSmeltLabelFit.smeltItemPoint);
        this._smeltItem.setEnabled(false);

        var helpItem = cc.MenuItemImage.create(
            main_scene_image.button41,
            main_scene_image.button41s,
            this._onClickHelp,
            this
        );

        helpItem.setPosition(this._cardSmeltLabelFit.helpItemPoint);

        var menu = cc.Menu.create(
            helpItem,
            this._smeltItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    update: function () {
        cc.log("CardSmeltLabel update");

        this._pillLabel.setString(gameData.player.get("pill"));

        if (this._retinueCard && this._retinueCard.length > 0) {
            this._smelter.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_2", 0);
            this._smelter.animationManager.setCompletedAnimationCallback(this, null);

            this._smeltItem.setEnabled(true);
            this._tipLabel.setVisible(false);
            this._helpLabel.setVisible(true);

            var len = this._retinueCard.length;
            var pill = 0;
            var money = 0;
            for (var i = 0; i < len; i++) {
                var card = this._retinueCard[i];
                pill += card.getCardPill();
                money += card.getSmeltMoney();
            }

            this._gotPillLabel.setString(pill);
            this._gotMoneyLabel.setString(money);

        } else {
            this._smelter.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_1", 0);
            this._tipLabel.setVisible(true);
            this._helpLabel.setVisible(false);
        }
    },

    ccbFnOpenBox: function () {
        cc.log("CardSmeltLabel ccbFnOpenBox");

        this._onClickSelectRetinueCard();
    },

    ccbFnCallback: function () {
        cc.log("CardSmeltLabel ccbFnCallback");

        if (this._getGoods) {
            lz.tipReward(this._getGoods);
            this._getGoods = null;
        }
    },

    _onClickSmelt: function () {
        cc.log("CardSmeltLabel _onClickSmelt");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var cardIdList = [];
        var len = this._retinueCard.length;
        for (var i = 0; i < len; ++i) {
            cardIdList.push(this._retinueCard[i].get("id"));
        }

        var that = this;
        gameData.cardList.dissolveCard(cardIdList, function (data) {
            that._getGoods = data;
            that._smeltItem.setEnabled(false);
            that.ccbBoxItem.setEnabled(false);
            that._smelter.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_3", 0);

            that._smelter.animationManager.setCompletedAnimationCallback(that, function () {
                that.ccbBoxItem.setEnabled(true);
                that._retinueCard = [];
                that.update();
            });

            var effect = cc.BuilderReader.load(main_scene_image.uiEffect118, that);
            effect.setPosition(that._cardSmeltLabelFit.smelterPoint);
            effect.animationManager.setCompletedAnimationCallback(that, function () {
                effect.removeFromParent();
                effect = null;
            });
            that.addChild(effect);
        });
    },

    _onClickSelectRetinueCard: function () {
        cc.log("CardSmeltLabel _onClickSelectRetinueCard");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;
        var cardListLayer = CardListLayer.create(SELECT_TYPE_CARD_SMELT_RETINUE, function (data) {
            cc.log(data);
            cc.log(that);
            if (data) {
                that._retinueCard = data;
            }

            that.getParent().backToThisLayer();

            cc.log("this._retinueCard :");
            cc.log(that._retinueCard);
        }, {
            retinueCard: this._retinueCard
        });

        this.getParent().switchToCardListLayer(cardListLayer);
    },

    _onClickHelp: function () {
        cc.log("CardSmeltLabel _onClickHelp");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        GameHelpLabel.pop(gameHelp["cardSmelt"]);
    }

});

CardSmeltLabel.create = function () {
    cc.log("CardSmeltLayer create");

    var ret = new CardSmeltLabel();
    if (ret && ret.init()) {
        return ret;
    }
    return null;
};

CardSmeltLabel.canEnter = function () {

    var limitLv = outputTables.function_limit.rows[1].card_smelt;
    var lv = gameData.player.get("lv");

    if (lv >= limitLv) {
        return true;
    }

    TipLayer.tip("熔炼" + limitLv + "级开放");

    return false;
};