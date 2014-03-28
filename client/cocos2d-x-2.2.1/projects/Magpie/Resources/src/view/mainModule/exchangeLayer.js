/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-10-9
 * Time: 下午5:11
 * To change this template use File | Settings | File Templates.
 */


/*
 * exchange layer
 * */


var ExchangeLayer = cc.Layer.extend({
    _exchangeLayerFit: null,

    _moneyLabel: null,
    _fragmentLabel: null,
    _label: null,

    onEnter: function () {
        cc.log("ExchangeLayer onEnter");

        this._super();
        this.update();

        lz.um.beginLogPageView("卡魂兑换界面");
    },

    onExit: function () {
        cc.log("ExchangeLayer onExit");

        this._super();

        lz.um.endLogPageView("卡魂兑换界面");
    },

    init: function () {
        cc.log("ExchangeLayer init");

        if (!this._super()) return false;

        this._exchangeLayerFit = gameFit.mainScene.exchangeLayer;

        this._type = SELECT_ALL_EXCHANGE_CARD;

        var bgSprite = cc.Sprite.create(main_scene_image.bg19);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._exchangeLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headLabel = cc.Sprite.create(main_scene_image.icon147);
        headLabel.setPosition(this._exchangeLayerFit.headLabelPoint);
        this.addChild(headLabel);

        var moneyIcon = cc.Sprite.create(main_scene_image.icon149);
        moneyIcon.setPosition(this._exchangeLayerFit.moneyIconPoint);
        this.addChild(moneyIcon);

        this._moneyLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        this._moneyLabel.setPosition(this._exchangeLayerFit.moneyLabelPoint);
        this.addChild(this._moneyLabel);

        var fragmentIcon = cc.Sprite.create(main_scene_image.icon243);
        fragmentIcon.setPosition(this._exchangeLayerFit.fragmentIconPoint);
        this.addChild(fragmentIcon);

        this._fragmentLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._fragmentLabel.setAnchorPoint(cc.p(0, 0.5));
        this._fragmentLabel.setPosition(this._exchangeLayerFit.fragmentLabelPoint);
        this.addChild(this._fragmentLabel);

        var updateItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon328,
            this._onClickUpdateItem,
            this
        );

        updateItem.setPosition(this._exchangeLayerFit.updateItemPoint);

        var menu = cc.Menu.create(updateItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 2);

        var costLabel = cc.Sprite.create(main_scene_image.icon331);
        costLabel.setPosition(this._exchangeLayerFit.costLabelPoint);
        this.addChild(costLabel);

        var costMoneyIcon = cc.Sprite.create(main_scene_image.icon149);
        costMoneyIcon.setPosition(cc.p(30, 18));
        costLabel.addChild(costMoneyIcon);

        var needMoney = outputTables.values.rows["reflashExcCardsMoney"].value;
        var costMoney = cc.LabelTTF.create(needMoney, "STHeitiTC-Medium", 22);
        costMoney.setPosition(cc.p(80, 15));
        costLabel.addChild(costMoney);

        var bottomLabel = cc.Sprite.create(main_scene_image.icon245);
        bottomLabel.setPosition(this._exchangeLayerFit.bottomLabelPoint);
        this.addChild(bottomLabel);

        var tipLabel3 = cc.LabelTTF.create(
            "参与卡牌召唤，任务探索，均有概率获得卡魂",
            "STHeitiTC-Medium",
            17
        );
        tipLabel3.setPosition(this._exchangeLayerFit.tipLabel3Point);
        this.addChild(tipLabel3);

        var fragmentIcon3 = cc.Sprite.create(main_scene_image.icon243);
        fragmentIcon3.setPosition(this._exchangeLayerFit.fragmentIconPoint3);
        this.addChild(fragmentIcon3);

        var point = this._exchangeLayerFit.basePoint;
        for (var i = 0; i < 4; i++) {
            var x = point.x + (i % 2) * 300;
            var y = point.y - parseInt(i / 2) * this._exchangeLayerFit.offsetHeight;
            var cardBgLabel = cc.Sprite.create(main_scene_image.bg20);
            cardBgLabel.setPosition(cc.p(x - 2, y));
            this.addChild(cardBgLabel);

            var cardBackIcon = cc.Sprite.create(main_scene_image.card_back);
            cardBackIcon.setPosition(cc.p(125, 160));
            cardBgLabel.addChild(cardBackIcon);
        }

        this._update();

        return true;
    },

    update: function () {
        cc.log("ExchangeLayer update");

        var player = gameData.player;

        this._fragmentLabel.setString(player.get("fragment"));
        this._moneyLabel.setString(lz.getMoneyStr(player.get("money")));
    },

    _update: function () {
        cc.log("ExchangeLayer _update");

        if (this._label) {
            this._label.removeFromParent();
            this._label = null;
        }

        this._label = cc.Node.create();
        this.addChild(this._label);

        var exchangeCardList = gameData.exchange.getExchangeCardList();
        var len = exchangeCardList.length;

        cc.log(exchangeCardList);

        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        this._label.addChild(menu);

        this._cardItem = {};

        var point = this._exchangeLayerFit.basePoint;
        for (var i = 0; i < len; ++i) {
            if (exchangeCardList[i].id > 0) {

                var card = exchangeCardList[i].card;
                var x = point.x + (i % 2) * 300;
                var y = point.y - parseInt(i / 2) * this._exchangeLayerFit.offsetHeight;

                var cardItem = CardHeadNode.getCardHeadItem(card, this._onClickCard(exchangeCardList[i]), this);
                cardItem.setPosition(cc.p(x - 7, y + 29));
                menu.addChild(cardItem);
                this._cardItem[exchangeCardList[i].id] = cardItem;

                var effect = cc.BuilderReader.load(main_scene_image.uiEffect44, this);
                effect.setPosition(cardItem.getPosition());
                this.addChild(effect, 2);

                var skillType = card.get("skillType");
                if (skillType > 3) {
                    skillType = 3;
                }
                var skillIcon = cc.Sprite.create(card.getCardIcon(2));
                skillIcon.setPosition(cc.p(x - 72, y - 40));
                this._label.addChild(skillIcon);

                var skillNameLabel = cc.LabelTTF.create(card.get("skillName"), "STHeitiTC-Medium", 22);
                skillNameLabel.setPosition(cc.p(x - 5, y - 40));
                this._label.addChild(skillNameLabel);

                var name = card.get("name");
                name = name.split("·")[1];
                var cardNameLabel = cc.LabelTTF.create(name, "STHeitiTC-Medium", 22);
                cardNameLabel.setPosition(cc.p(x - 8, y + 113));
                this._label.addChild(cardNameLabel);

                var url = "icon" + (325 + card.get("star"));

                var exchangeItem = cc.MenuItemImage.createWithIcon(
                    main_scene_image.button9,
                    main_scene_image.button9s,
                    main_scene_image[url],
                    this._onClickExchange(card.get("tableId"), card.get("star")),
                    this
                );
                exchangeItem.setScale(0.8);
                exchangeItem.setPosition(cc.p(x - 5, y - 88));
                menu.addChild(exchangeItem);
            }
        }

    },

    _onClickCard: function (data) {
        return function () {
            cc.log("ExchangeLayer _onClickCard: " + data.id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var card = data.card;
            var star = card.get("star");

            var cardDetails = CardDetails.create(card);
            MainScene.getInstance().addChild(cardDetails, 1);
        }
    },

    _onClickExchange: function (id, star) {
        return function () {
            cc.log("ExchangeLayer _onClickExchange");

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var exchange = gameData.exchange;
            var needFragment = exchange.getFragmentsNeed(star);

            if (gameData.cardList.isFull()) {
                CardListFullTipLayer.pop();
                return;
            }

            var that = this;

            AdvancedTipsLabel.pop(TYPE_EXCHANGE_CARD_TIPS, function () {
                exchange.exchange(function (data) {
                    cc.log(data);
                    that.update();
                    that._update();
                    TipLayer.tip("恭喜您，获得 " + data.get("name"));
                }, id, star);
            }, {fragment: needFragment});
        };
    },

    _onClickBack: function () {
        cc.log("ExchangeLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        MainScene.getInstance().switchLayer(LotteryLayer);
    },

    _onClickUpdateItem: function () {
        cc.log("ExchangeLayer _onClickUpdateItem");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        var that = this;
        gameData.exchange.getExchangeCards(function () {
            that.update();
            that._update();
        });

    }
});


ExchangeLayer.create = function () {
    var ret = new ExchangeLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};
