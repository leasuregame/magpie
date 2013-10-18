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
    _type: null,
    _scrollView: null,
    _selectStar5Item: null,
    _selectStar4Item: null,

    onEnter: function () {
        cc.log("ExchangeLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("ExchangeLayer init");

        if (!this._super()) return false;

        this._type = SELECT_ALL_EXCHANGE_CARD;

        var bgSprite = cc.Sprite.create(main_scene_image.bg19);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(cc.p(40, 0));
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(cc.p(40, 968));
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon246);
        titleIcon.setPosition(cc.p(360, 1008));
        this.addChild(titleIcon);

        var headLabel = cc.Sprite.create(main_scene_image.icon147);
        headLabel.setPosition(cc.p(360, 938));
        this.addChild(headLabel);

        var fragmentIcon = cc.Sprite.create(main_scene_image.icon243);
        fragmentIcon.setPosition(cc.p(570, 938));
        this.addChild(fragmentIcon);

        this._fragmentLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._fragmentLabel.setAnchorPoint(cc.p(0, 0.5));
        this._fragmentLabel.setPosition(cc.p(600, 938));
        this.addChild(this._fragmentLabel);

        this._selectStar5Item = cc.MenuItemImage.createWithIcon(
            main_scene_image.button45,
            main_scene_image.button45,
            main_scene_image.icon20,
            this._onClickSelectStar5,
            this
        );
        this._selectStar5Item.setPosition(cc.p(130, 938));
        this._selectStar5Item.setOffset(cc.p(-40, 0));
        this._selectStar5Item.hidIconImage();

        this._selectStar4Item = cc.MenuItemImage.createWithIcon(
            main_scene_image.button44,
            main_scene_image.button44,
            main_scene_image.icon20,
            this._onClickSelectStar4,
            this
        );
        this._selectStar4Item.setPosition(cc.p(300, 938));
        this._selectStar4Item.setOffset(cc.p(-40, 0));
        this._selectStar4Item.hidIconImage();

        var menu = cc.Menu.create(this._selectStar5Item, this._selectStar4Item);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var tipIcon = cc.Sprite.create(main_scene_image.icon245);
        tipIcon.setPosition(cc.p(360, 210));
        this.addChild(tipIcon);

        var tipLabel = cc.LabelTTF.create(
            "兑换 5 星卡需要 " + EXCHANGE_STAR5_CARD + " 个卡魂  兑换 4 星卡需要 " + EXCHANGE_STAR4_CARD + " 个卡魂",
            "STHeitiTC-Medium",
            17
        );
        tipLabel.setPosition(cc.p(360, 210));
        this.addChild(tipLabel);

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

        var scrollViewLayer = MarkLayer.create(cc.rect(40, 230, 640, 680));
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        var scrollViewHeight = Math.ceil(len / 4) * 143 - 33;

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

        this._scrollView = cc.ScrollView.create(cc.size(640, 680), scrollViewLayer);
        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setPosition(cc.p(40, 230));
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());
    },

    _onClickCard: function (data) {
        return function () {
            cc.log("ExchangeLayer _onClickCard: " + data.id);

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

            cc.Director.getInstance().getRunningScene().addChild(cardDetails, 1);
        }
    },

    _onClickExchange: function (id, star, cardDetails) {
        return function () {
            cc.log("ExchangeLayer _onClickExchange");

            var that = this;
            gameData.exchange.exchange(function (data) {
                cc.log(data);

                cardDetails.removeFromParent();

                that.update();

                TipLayer.tip("恭喜您，获得 " + data.get("name"));
            }, id, star);
        };
    },

    _onClickSelectStar4: function () {
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
        if (this._type == SELECT_STAR5_EXCHANGE_CARD) {
            this._type = SELECT_ALL_EXCHANGE_CARD;

            this._selectStar5Item.hidIconImage();

        } else {
            this._type = SELECT_STAR5_EXCHANGE_CARD;

            this._selectStar4Item.hidIconImage();
            this._selectStar5Item.showIconImage();
        }

        this._update();
    }
});


ExchangeLayer.create = function () {
    var ret = new ExchangeLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};