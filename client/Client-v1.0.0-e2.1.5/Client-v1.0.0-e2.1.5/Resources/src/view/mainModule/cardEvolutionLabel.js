/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-13
 * Time: 下午4:54
 * To change this template use File | Settings | File Templates.
 */


/*
 * card evolution layer
 * */


var CardEvolutionLayer = cc.Layer.extend({
    _leadCard: null,
    _retinueCard: [],
    _leadCardHalfNode: null,
    _tipLabel: null,
    _helpLabel: null,
    _moneyLabel: null,
    _cardCountLabel: null,
    _resLabel: null,
    _evolutionRateLabel: null,
    _selectRetinueCardItem: null,
    _evolutionItem: null,
    _selectLeadCardIcon: null,

    onEnter: function () {
        cc.log("CardEvolutionLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("CardEvolutionLayer init");

        if (!this._super()) return false;

        var cardItemBgSprite = cc.Sprite.create(main_scene_image.icon83);
        cardItemBgSprite.setPosition(cc.p(359, 627));
        this.addChild(cardItemBgSprite);

        var helpBgSprite = cc.Sprite.create(main_scene_image.icon50);
        helpBgSprite.setPosition(cc.p(360, 380));
        this.addChild(helpBgSprite);

        this._resLabel = cc.Node.create();
        this._resLabel.setPosition(cc.p(202, 445));
        this.addChild(this._resLabel, 1);

        var resLabelBgSprite = cc.Sprite.create(main_scene_image.icon49);
        resLabelBgSprite.setAnchorPoint(cc.p(0, 0));
        this._resLabel.addChild(resLabelBgSprite);

        var resLabelIcon = cc.Sprite.create(main_scene_image.icon85);
        resLabelIcon.setPosition(cc.p(118, 68));
        this._resLabel.addChild(resLabelIcon);

        this._evolutionRateLabel = cc.LabelTTF.create("100%", "黑体", 30);
        this._evolutionRateLabel.setColor(cc.c3b(118, 238, 60));
        this._evolutionRateLabel.setAnchorPoint(cc.p(0, 0.5));
        this._evolutionRateLabel.setPosition(cc.p(180, 68));
        this._resLabel.addChild(this._evolutionRateLabel);

        this._tipLabel = cc.Sprite.create(main_scene_image.icon86);
        this._tipLabel.setPosition(cc.p(360, 380));
        this.addChild(this._tipLabel);

        this._helpLabel = cc.Sprite.create(main_scene_image.icon87);
        this._helpLabel.setPosition(cc.p(320, 380));
        this.addChild(this._helpLabel);

        var selectLeadCardItem = cc.MenuItemImage.create(
            main_scene_image.card_frame1,
            main_scene_image.card_frame_s,
            this._onClickSelectLeadCard,
            this
        );
        selectLeadCardItem.setScale(1.1);
        selectLeadCardItem.setPosition(cc.p(360, 685));

        this._selectRetinueCardItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            this._onClickSelectRetinueCard,
            this
        );
        this._selectRetinueCardItem.setPosition(cc.p(260, 270));

        this._evolutionItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            this._onClickEvolution,
            this
        );
        this._evolutionItem.setPosition(cc.p(460, 270));


        var menu = cc.Menu.create(selectLeadCardItem, this._selectRetinueCardItem, this._evolutionItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._moneyLabel = cc.LabelTTF.create("0", "黑体", 25);
        this._moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        this._moneyLabel.setPosition(cc.p(493, 376));
        this.addChild(this._moneyLabel);

        this._cardCountLabel = cc.LabelTTF.create("0", "黑体", 25);
        this._cardCountLabel.setAnchorPoint(cc.p(0, 0.5));
        this._cardCountLabel.setPosition(cc.p(255, 376));
        this.addChild(this._cardCountLabel);

        this._selectLeadCardIcon = cc.Sprite.create(main_scene_image.icon51);
        this._selectLeadCardIcon.setPosition(cc.p(360, 685));
        this.addChild(this._selectLeadCardIcon);

        var selectRetinueCardIcon = cc.Sprite.create(main_scene_image.icon53);
        selectRetinueCardIcon.setPosition(cc.p(260, 270));
        this.addChild(selectRetinueCardIcon);

        var evolutionIcon = cc.Sprite.create(main_scene_image.icon84);
        evolutionIcon.setPosition(cc.p(460, 270));
        this.addChild(evolutionIcon);

        return true;
    },

    update: function () {
        cc.log("CardEvolutionLayer update");

        if (this._leadCardHalfNode != null) {
            this._leadCardHalfNode.removeFromParent();
            this._leadCardHalfNode = null;
        }

        if (this._leadCard == null) {
            this._retinueCard = [];

            this._selectLeadCardIcon.stopAllActions();
            this._selectLeadCardIcon.setOpacity(255);

            var selectLeadCardIconAction = cc.Sequence.create(
                cc.FadeOut.create(1),
                cc.FadeIn.create(1)
            );

            this._selectLeadCardIcon.runAction(cc.RepeatForever.create(selectLeadCardIconAction));

            this._evolutionRateLabel.setString("0%");
            this._resLabel.setVisible(false);

            this._cardCountLabel.setString("0");
            this._cardCountLabel.setVisible(false);

            this._moneyLabel.setString("0");
            this._moneyLabel.setVisible(false);

            this._helpLabel.setVisible(false);
            this._tipLabel.setVisible(true);

            this._selectRetinueCardItem.setEnabled(false);
            this._evolutionItem.setEnabled(false);
        } else {
            this._leadCardHalfNode = CardHalfNode.create(this._leadCard);
            this._leadCardHalfNode.setScale(1.1);
            this._leadCardHalfNode.setPosition(cc.p(360, 685));
            this.addChild(this._leadCardHalfNode, 1);

            this._evolutionRateLabel.setString("0%");
            this._resLabel.setVisible(false);

            this._cardCountLabel.setString("0");
            this._cardCountLabel.setVisible(true);

            this._moneyLabel.setString(this._leadCard.getEvolutionNeedMoney());
            this._moneyLabel.setVisible(true);

            this._helpLabel.setVisible(true);
            this._tipLabel.setVisible(false);

            this._selectRetinueCardItem.setEnabled(true);
            this._evolutionItem.setEnabled(false);
        }

        var cardCount = this._retinueCard.length;

        if (cardCount > 0) {
            var rate = this._leadCard.getPreCardRate() * cardCount;
            rate = rate < 100 ? rate : 100;

            this._evolutionRateLabel.setString(rate + "%");
            this._resLabel.setVisible(true);

            this._cardCountLabel.setString(cardCount);
            this._cardCountLabel.setVisible(true);

            this._evolutionItem.setEnabled(true);
        }
    },

    _onClickSelectLeadCard: function () {
        cc.log("CardEvolutionLayer _onClickSelectLeadCard");

        var that = this;
        var cardListLayer = CardListLayer.create(SELECT_TYPE_CARD_EVOLUTION_MASTER, function (data) {
            cc.log(data);

            if (data) {
                that._leadCard = data[0] || null;
                that._retinueCard = [];
            }

            that.getParent()._backToThisLayer();

            cc.log("this._leadCard :");
            cc.log(that._leadCard);
        }, {
            leadCard: this._leadCard
        });

        this.getParent()._switchToCardListLayer(cardListLayer);
    },

    _onClickSelectRetinueCard: function () {
        cc.log("CardEvolutionLayer _onClickSelectRetinueCard");

        var that = this;
        var cardListLayer = CardListLayer.create(SELECT_TYPE_CARD_EVOLUTION_RETINUE, function (data) {
            cc.log(data);

            if (data) {
                that._retinueCard = data;
            }
            that.getParent()._backToThisLayer();

            cc.log("this._retinueCard :");
            cc.log(that._retinueCard);
        }, {
            leadCard: this._leadCard,
            retinueCard: this._retinueCard
        });

        this.getParent()._switchToCardListLayer(cardListLayer);
    },

    _onClickEvolution: function () {
        cc.log("CardEvolutionLayer _onClickEvolution");

        var cardIdList = [];
        var len = this._retinueCard.length;
        for (var i = 0; i < len; ++i) {
            cardIdList.push(this._retinueCard[i].get("id"));
        }

        var that = this;
        this._leadCard.evolution(function (data) {
            cc.log(data);

            that._retinueCard = [];
            that.update();
        }, cardIdList);
    }
});


CardEvolutionLayer.create = function () {
    var ret = new CardEvolutionLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};