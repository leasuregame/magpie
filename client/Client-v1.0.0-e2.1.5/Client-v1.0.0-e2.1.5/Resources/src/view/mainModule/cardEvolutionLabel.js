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


var CardEvolutionLabel = cc.Layer.extend({
    _cardEvolutionLayerFit: null,

    _leadCard: null,
    _retinueCard: [],
    _leadCardHalfNode: null,
    _tipLabel: null,
    _helpLabel: null,
    _moneyLabel: null,
    _cardCountLabel: null,
    _resLabel: null,
    _nameLabel: null,
    _evolutionRateLabel: null,
    _selectRetinueCardItem: null,
    _evolutionItem: null,
    _selectLeadCardIcon: null,

    _evolutionEffect: null,
    _index: null,

    onEnter: function () {
        cc.log("CardEvolutionLayer onEnter");

        this._super();
        this.update();

        lz.dc.beginLogPageView("卡牌升星界面");
    },

    onExit: function () {
        cc.log("CardEvolutionLayer onExit");

        this._super();

        lz.dc.endLogPageView("卡牌升星界面");
    },

    init: function () {
        cc.log("CardEvolutionLayer init");

        if (!this._super()) return false;

        this._cardEvolutionLayerFit = gameFit.mainScene.cardEvolutionLayer;

        var cardItemBgSprite = cc.Sprite.create(main_scene_image.icon83);
        cardItemBgSprite.setPosition(this._cardEvolutionLayerFit.cardItemBgSpritePoint);
        this.addChild(cardItemBgSprite);

        var helpBgSprite = cc.Sprite.create(main_scene_image.icon50);
        helpBgSprite.setPosition(this._cardEvolutionLayerFit.helpBgSpritePoint);
        this.addChild(helpBgSprite);

        this._resLabel = cc.Node.create();
        this._resLabel.setPosition(this._cardEvolutionLayerFit.resLabelPoint);
        this.addChild(this._resLabel);

        var resLabelBgSprite = cc.Sprite.create(main_scene_image.icon49);
        this._resLabel.addChild(resLabelBgSprite);

        this._nameLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 25);
        this._nameLabel.setColor(cc.c3b(255, 239, 131));
        this._nameLabel.setPosition(cc.p(0, 25));
        this._resLabel.addChild(this._nameLabel);

        var evolutionRateIcon = cc.LabelTTF.create("成功概率:", "STHeitiTC-Medium", 22);
        evolutionRateIcon.setColor(cc.c3b(255, 239, 131));
        evolutionRateIcon.setPosition(cc.p(-30, -25));
        this._resLabel.addChild(evolutionRateIcon);

        this._evolutionRateLabel = cc.LabelTTF.create("0%", "STHeitiTC-Medium", 22);
        this._evolutionRateLabel.setColor(cc.c3b(118, 238, 60));
        this._evolutionRateLabel.setAnchorPoint(cc.p(0, 0.5));
        this._evolutionRateLabel.setPosition(cc.p(30, -27));
        this._resLabel.addChild(this._evolutionRateLabel);

        this._tipLabel = cc.Node.create();
        this._tipLabel.setPosition(this._cardEvolutionLayerFit.tipLabelPoint);
        this.addChild(this._tipLabel);

        var tipLabel1 = cc.LabelTTF.create("满级卡牌消耗同星级卡牌进行升星", "STHeitiTC-Medium", 22);
        tipLabel1.setPosition(cc.p(0, 20));
        this._tipLabel.addChild(tipLabel1);

        var tipLabel2 = cc.LabelTTF.create("进阶失败主卡保留，从卡消失", "STHeitiTC-Medium", 22);
        tipLabel2.setPosition(cc.p(0, -20));
        this._tipLabel.addChild(tipLabel2);


        this._helpLabel = cc.Node.create();
        this._helpLabel.setPosition(this._cardEvolutionLayerFit.helpLabelPoint);
        this.addChild(this._helpLabel);

        var moneyIcon = cc.LabelTTF.create("消耗仙币:", "STHeitiTC-Medium", 22);
        moneyIcon.setPosition(cc.p(-160, 0));
        this._helpLabel.addChild(moneyIcon);

        var cardCountIcon = cc.LabelTTF.create("从牌数量:", "STHeitiTC-Medium", 22);
        cardCountIcon.setPosition(cc.p(120, 0));
        this._helpLabel.addChild(cardCountIcon);

        this._moneyLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        this._moneyLabel.setPosition(cc.p(-100, -2));
        this._helpLabel.addChild(this._moneyLabel);

        this._cardCountLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._cardCountLabel.setAnchorPoint(cc.p(0, 0.5));
        this._cardCountLabel.setPosition(cc.p(180, -2));
        this._helpLabel.addChild(this._cardCountLabel);

        var selectLeadCardItem = cc.MenuItemImage.create(
            main_scene_image.card_frame1,
            main_scene_image.card_frame_s,
            this._onClickSelectLeadCard,
            this
        );
        selectLeadCardItem.setScale(1.1);
        selectLeadCardItem.setPosition(this._cardEvolutionLayerFit.selectLeadCardItemPoint);

        this._evolutionItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon84,
            this._onClickEvolution,
            this
        );
        this._evolutionItem.setPosition(this._cardEvolutionLayerFit.evolutionItemPoint);

        this._selectRetinueCardItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon53,
            this._onClickSelectRetinueCard,
            this
        );
        this._selectRetinueCardItem.setPosition(this._cardEvolutionLayerFit.selectRetinueCardItemPoint);

        var menu = cc.Menu.create(selectLeadCardItem, this._selectRetinueCardItem, this._evolutionItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._selectLeadCardIcon = cc.Sprite.create(main_scene_image.icon51);
        this._selectLeadCardIcon.setPosition(this._cardEvolutionLayerFit.selectLeadCardIconPoint);
        this.addChild(this._selectLeadCardIcon);

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

            this._selectLeadCardIcon.runAction(
                cc.RepeatForever.create(
                    cc.Sequence.create(
                        cc.FadeOut.create(1),
                        cc.FadeIn.create(1)
                    )
                )
            );

            this._resLabel.setVisible(false);
            this._helpLabel.setVisible(false);
            this._tipLabel.setVisible(true);

            this._selectRetinueCardItem.setEnabled(false);
            this._evolutionItem.setEnabled(false);
        } else {
            this._leadCardHalfNode = CardHalfNode.create(this._leadCard);
            this._leadCardHalfNode.setScale(1.1);
            this._leadCardHalfNode.setPosition(this._cardEvolutionLayerFit.leadCardHalfNodePoint);
            this.addChild(this._leadCardHalfNode, 1);

            this._resLabel.setVisible(true);

            this._nameLabel.setString(this._leadCard.get("name"));
            this._evolutionRateLabel.setString("0%");
            this._cardCountLabel.setString("0");
            this._moneyLabel.setString(this._leadCard.getEvolutionNeedMoney());

            this._helpLabel.setVisible(true);
            this._tipLabel.setVisible(false);

            this._selectRetinueCardItem.setEnabled(true);
            this._evolutionItem.setEnabled(false);
        }

        var cardCount = this._retinueCard.length;

        if (cardCount > 0) {
            var rate = this._leadCard.getPreCardRate() * cardCount;
            rate = Math.min(rate, 100);

            this._evolutionRateLabel.setString(rate + "%");
            this._cardCountLabel.setString(cardCount);

            this._evolutionItem.setEnabled(true);
        }
    },

    _onClickSelectLeadCard: function () {
        cc.log("CardEvolutionLayer _onClickSelectLeadCard");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;
        var cardListLayer = CardListLayer.create(SELECT_TYPE_CARD_EVOLUTION_MASTER, function (data) {
            cc.log(data);

            if (data) {
                that._leadCard = data[0] || null;
                that._retinueCard = [];
            }

            that.getParent().backToThisLayer();

            cc.log("this._leadCard :");
            cc.log(that._leadCard);
        }, {
            leadCard: this._leadCard
        });

        this.getParent().switchToCardListLayer(cardListLayer);
    },

    _onClickSelectRetinueCard: function () {
        cc.log("CardEvolutionLayer _onClickSelectRetinueCard");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;
        var cardListLayer = CardListLayer.create(SELECT_TYPE_CARD_EVOLUTION_RETINUE, function (data) {
            cc.log(data);

            if (data) {
                that._retinueCard = data;
            }
            that.getParent().backToThisLayer();

            cc.log("this._retinueCard :");
            cc.log(that._retinueCard);
        }, {
            leadCard: this._leadCard,
            retinueCard: this._retinueCard
        });

        this.getParent().switchToCardListLayer(cardListLayer);
    },

    _onClickEvolution: function () {
        cc.log("CardEvolutionLayer _onClickEvolution");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var cardIdList = [];
        var len = this._retinueCard.length;
        for (var i = 0; i < len; ++i) {
            cardIdList.push(this._retinueCard[i].get("id"));
        }

        var card = lz.clone(this._leadCard);

        var that = this;
        this._leadCard.evolution(function (state) {
            cc.log(state);
            that._retinueCard = [];
            if(state != EVOLUTION_ERROR) {
                CardEvolutionLayer.pop({card: card, state: state});
            }
            that.update();

        }, cardIdList);
    }

});


CardEvolutionLabel.create = function () {
    var ret = new CardEvolutionLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};