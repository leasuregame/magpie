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

    _type: null,
    _scrollView: null,
    _selectStar5Item: null,
    _selectStar4Item: null,

    onEnter: function () {
        cc.log("ExchangeLayer onEnter");

        this._super();
        this.update();

        lz.dc.beginLogPageView("卡魂兑换界面");
    },

    onExit: function () {
        cc.log("ExchangeLayer onExit");

        this._super();

        lz.dc.endLogPageView("卡魂兑换界面");
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

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._exchangeLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon246);
        titleIcon.setPosition(this._exchangeLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var headLabel = cc.Sprite.create(main_scene_image.icon147);
        headLabel.setPosition(this._exchangeLayerFit.headLabelPoint);
        this.addChild(headLabel);

        var fragmentBgIcon = cc.Sprite.create(main_scene_image.icon98);
        fragmentBgIcon.setPosition(this._exchangeLayerFit.fragmentBgIconPoint);
        fragmentBgIcon.setScaleX(0.8);
        this.addChild(fragmentBgIcon);

        var fragmentIcon = cc.Sprite.create(main_scene_image.icon243);
        fragmentIcon.setPosition(this._exchangeLayerFit.fragmentIconPoint);
        this.addChild(fragmentIcon);

        this._fragmentLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._fragmentLabel.setAnchorPoint(cc.p(0, 0.5));
        this._fragmentLabel.setPosition(this._exchangeLayerFit.fragmentLabelPoint);
        this.addChild(this._fragmentLabel);

        this._selectStar5Item = cc.MenuItemImage.createWithIcon(
            main_scene_image.button45,
            main_scene_image.button45,
            main_scene_image.icon20,
            this._onClickSelectStar5,
            this
        );
        this._selectStar5Item.setPosition(this._exchangeLayerFit.selectStar5ItemPoint);
        this._selectStar5Item.setOffset(cc.p(-40, 0));
        this._selectStar5Item.hidIconImage();

        this._selectStar4Item = cc.MenuItemImage.createWithIcon(
            main_scene_image.button44,
            main_scene_image.button44,
            main_scene_image.icon20,
            this._onClickSelectStar4,
            this
        );
        this._selectStar4Item.setPosition(this._exchangeLayerFit.selectStar4ItemPoint);
        this._selectStar4Item.setOffset(cc.p(-40, 0));
        this._selectStar4Item.hidIconImage();

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(this._exchangeLayerFit.backItemPoint);

        var menu = cc.Menu.create(this._selectStar5Item, this._selectStar4Item, backItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var tipLabel1 = cc.LabelTTF.create(
            "兑换 5 星卡需要 " + EXCHANGE_STAR5_CARD,
            "STHeitiTC-Medium",
            17
        );
        tipLabel1.setAnchorPoint(cc.p(0, 0.5));
        tipLabel1.setPosition(this._exchangeLayerFit.tipLabel1Point);
        this.addChild(tipLabel1);

        var fragmentIcon1 = cc.Sprite.create(main_scene_image.icon243);
        fragmentIcon1.setAnchorPoint(cc.p(0, 0.5));
        fragmentIcon1.setPosition(this._exchangeLayerFit.fragmentIconPoint1);
        this.addChild(fragmentIcon1);

        var tipLabel2 = cc.LabelTTF.create(
            "兑换 4 星卡需要 " + EXCHANGE_STAR4_CARD,
            "STHeitiTC-Medium",
            17
        );
        tipLabel2.setAnchorPoint(cc.p(0, 0.5));
        tipLabel2.setPosition(this._exchangeLayerFit.tipLabel2Point);
        this.addChild(tipLabel2);

        var fragmentIcon2 = cc.Sprite.create(main_scene_image.icon243);
        fragmentIcon2.setAnchorPoint(cc.p(0, 0.5));
        fragmentIcon2.setPosition(this._exchangeLayerFit.fragmentIconPoint2);
        this.addChild(fragmentIcon2);

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


        this._update();

        return true;
    },

    update: function () {
        cc.log("ExchangeLayer update");

        this._fragmentLabel.setString(gameData.player.get("fragment"));
    },

    _update: function () {
        cc.log("ExchangeLayer _update");

        if (this._scrollView != null) {
            this._scrollView.removeFromParent();
        }

        var exchangeCardList = gameData.exchange.getExchangeCardList(this._type);
        var len = exchangeCardList.length;

        cc.log(exchangeCardList);

        var scrollViewLayer = MarkLayer.create(this._exchangeLayerFit.scrollViewLayerRect);
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        var scrollViewHeight = Math.ceil(len / 4) * 143 - 33;
        if (scrollViewHeight < this._exchangeLayerFit.scrollViewHeight) {
            scrollViewHeight = this._exchangeLayerFit.scrollViewHeight;
        }

        this._cardItem = {};
        this._effect = {};
        for (var i = 0; i < len; ++i) {
            var row = Math.floor(i / 4);
            var index = i % 4;

            var cardItem = CardHeadNode.getCardHeadItem(exchangeCardList[i].card, this._onClickCard(exchangeCardList[i]), this);
            cardItem.setPosition(cc.p(94 + 148 * index, scrollViewHeight - 60 - 143 * row));
            menu.addChild(cardItem);

            this._cardItem[exchangeCardList[i].id] = cardItem;
        }

        this._scrollView = cc.ScrollView.create(this._exchangeLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setPosition(this._exchangeLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());
    },

    _onClickCard: function (data) {
        return function () {
            cc.log("ExchangeLayer _onClickCard: " + data.id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var id = data.id;
            var card = data.card;
            var star = card.get("star");

            var cardDetails = CardDetails.create(card);

            var exchangeItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.icon252,
                this._onClickExchange(id, star, cardDetails),
                this
            );

            cardDetails._menu.addChild(exchangeItem);

            MainScene.getInstance().addChild(cardDetails, 1);
        }
    },

    _onClickExchange: function (id, star, cardDetails) {
        return function () {
            cc.log("ExchangeLayer _onClickExchange");

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var exchange = gameData.exchange;

            if (!exchange.canExchange(star)) {
                return;
            }

            var that = this;
            exchange.exchange(function (data) {
                cc.log(data);

                cardDetails.removeFromParent();

                that.update();

                TipLayer.tip("恭喜您，获得 " + data.get("name"));
            }, id, star);
        };
    },

    _onClickSelectStar4: function () {
        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._type == SELECT_STAR4_EXCHANGE_CARD) {
            this._type = SELECT_ALL_EXCHANGE_CARD;

            this._selectStar4Item.hidIconImage();
        } else {
            this._type = SELECT_STAR4_EXCHANGE_CARD;

            this._selectStar5Item.hidIconImage();
            this._selectStar4Item.showIconImage();
        }

        this._update();
    },

    _onClickSelectStar5: function () {
        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._type == SELECT_STAR5_EXCHANGE_CARD) {
            this._type = SELECT_ALL_EXCHANGE_CARD;

            this._selectStar5Item.hidIconImage();

        } else {
            this._type = SELECT_STAR5_EXCHANGE_CARD;

            this._selectStar4Item.hidIconImage();
            this._selectStar5Item.showIconImage();
        }

        this._update();
    },

    _onClickBack: function () {
        cc.log("ExchangeLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        MainScene.getInstance().switchLayer(LotteryLayer);
    }
});


ExchangeLayer.create = function () {
    var ret = new ExchangeLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};