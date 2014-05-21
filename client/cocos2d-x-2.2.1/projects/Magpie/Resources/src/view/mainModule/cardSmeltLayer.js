/**
 * Created by lujunyu on 14-5-20.
 */

var CardSmeltLayer = cc.Layer.extend({
    _cardSmeltLayerFit: null,

    _smelter: null,
    _retinueCard: null,
    _tipLabel: null,
    _helpLabel: null,
    _pillLabel: null,
    _moneyLabel: null,
    _smeltItem: null,

    onEnter: function () {
        cc.log("CardSmeltLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("CardSmeltLayer init");

        if (!this._super()) return false;

        this._cardSmeltLayerFit = gameFit.mainScene.cardSmeltLayer;

        this._retinueCard = null;

        this._smelter = cc.BuilderReader.load(main_scene_image.uiEffect114, this);
        this._smelter.setPosition(this._cardSmeltLayerFit.smelterPoint);
        this.addChild(this._smelter);

        var helpBgSprite = cc.Sprite.create(main_scene_image.icon50);
        helpBgSprite.setPosition(this._cardSmeltLayerFit.helpBgSpritePoint);
        this.addChild(helpBgSprite);

        this._tipLabel = cc.LabelTTF.create("晶晶电饭煲钟情于熔炼卡牌，产出觉醒玉", "STHeitiTC-Medium", 22);
        this._tipLabel.setPosition(this._cardSmeltLayerFit.tipLabelPoint);
        this.addChild(this._tipLabel);

        this._helpLabel = cc.Node.create();
        this._helpLabel.setPosition(this._cardSmeltLayerFit.helpLabelPoint);
        this.addChild(this._helpLabel);

        var gotLabel = cc.LabelTTF.create("本次吞噬可获得", "STHeitiTC-Medium", 22);
        gotLabel.setPosition(cc.p(0, 20));
        this._helpLabel.addChild(gotLabel);

        var pillIcon = cc.Sprite.create(main_scene_image.icon459);
        pillIcon.setPosition(cc.p(-150, -15));
        this._helpLabel.addChild(pillIcon);

        this._pillLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._pillLabel.setAnchorPoint(cc.p(0, 0.5));
        this._pillLabel.setPosition(cc.p(-130, -15));
        this._helpLabel.addChild(this._pillLabel);

        var moneyIcon = cc.Sprite.create(main_scene_image.icon149);
        moneyIcon.setPosition(cc.p(70, -15));
        this._helpLabel.addChild(moneyIcon);

        this._moneyLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        this._moneyLabel.setPosition(cc.p(90, -15));
        this._helpLabel.addChild(this._moneyLabel);

        this._smeltItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon460,
            this._onClickSmelt,
            this
        );
        this._smeltItem.setPosition(this._cardSmeltLayerFit.smeltItemPoint);
        this._smeltItem.setEnabled(false);

        this._selectRetinueCardItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon53,
            this._onClickSelectRetinueCard,
            this
        );
        this._selectRetinueCardItem.setPosition(this._cardSmeltLayerFit.selectRetinueCardItemPoint);

        var helpItem = cc.MenuItemImage.create(
            main_scene_image.button41,
            main_scene_image.button41s,
            this._onClickHelp,
            this
        );

        helpItem.setPosition(this._cardSmeltLayerFit.helpItemPoint);

        var menu = cc.Menu.create(
            helpItem,
            this._smeltItem,
            this._selectRetinueCardItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    update: function () {
        cc.log("CardSmeltLayer update");

        if (this._retinueCard) {
            this._smelter.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_2", 0);
            this.ccbBoxItem.setEnabled(false);
            this._smeltItem.setEnabled(true);
            this._tipLabel.setVisible(false);
            this._helpLabel.setVisible(true);

            var len = this._retinueCard.length;
            var pill = 0;
            var money = 0;
            for(var i = 0;i < len;i++) {
                var card = this._retinueCard[i];
                pill += card.getCardPill();
                money += card.getSmeltMoney();
            }

            this._pillLabel.setString(pill);
            this._moneyLabel.setString(money);

        } else {
            this._tipLabel.setVisible(true);
            this._helpLabel.setVisible(false);
        }
    },

    ccbFnOpenBox: function () {
        cc.log("CardSmeltLayer ccbFnOpenBox");

        this._onClickSelectRetinueCard();
    },

    ccbFnCallback: function () {
        cc.log("CardSmeltLayer ccbFnCallback");

        this.ccbBoxItem.setEnabled(true);
        this._retinueCard = null;
        this.update();
    },

    _onClickSmelt: function () {
        cc.log("CardSmeltLayer _onClickSmelt");

        this._smeltItem.setEnabled(false);

        this._smelter.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_3", 0);
    },

    _onClickSelectRetinueCard: function () {
        cc.log("CardSmeltLayer _onClickSelectRetinueCard");

        var that = this;
        var cardListLayer = CardListLayer.create(SELECT_TYPE_CARD_SMELT_RETINUE, function (data) {
            cc.log(data);

            if (data) {
                that._retinueCard = data;
            }
            that.getParent().backToThisLayer();
        }, {
            retinueCard: this._retinueCard
        });

        this.getParent().switchToCardListLayer(cardListLayer);
    },

    _onClickHelp: function () {
        cc.log("CardSmeltLayer _onClickHelp");
    }

});

CardSmeltLayer.create = function () {
    cc.log("CardSmeltLayer create");

    var ret = new CardSmeltLayer();
    if (ret && ret.init()) {
        return ret;
    }
    return null;
};