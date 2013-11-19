/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-18
 * Time: 上午11:58
 * To change this template use File | Settings | File Templates.
 */


/*
 * card library layer
 * */


var CardLibraryLayer = cc.Layer.extend({
    _cardLibraryLayerFit: null,

    _cardItem: {},
    _cardLockIcon: {},
    _effect: {},

    onEnter: function () {
        cc.log("CardLibraryLayer onEnter");

        this._super();
        this.update();

        lz.dc.beginLogPageView("卡库界面");
    },

    onExit: function () {
        cc.log("CardLibraryLayer onExit");

        this._super();

        lz.dc.endLogPageView("卡库界面");
    },


    init: function () {
        cc.log("CardLibraryLayer init");

        if (!this._super()) return false;

        this._cardLibraryLayerFit = gameFit.mainScene.cardLibraryLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._cardLibraryLayerFit.bgSpritePoint);
        this.addChild(bgSprite, -1);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._cardLibraryLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon116);
        titleIcon.setPosition(this._cardLibraryLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var tipIcon = cc.Sprite.create(main_scene_image.main_message_bg);
        tipIcon.setPosition(this._cardLibraryLayerFit.tipIconPoint);
        tipIcon.setScaleY(1.1);
        this.addChild(tipIcon);

        var tipLabel = cc.LabelTTF.create(
            "每次获得新卡牌，点击该卡牌可领取活力点。星级越高奖励越高。",
            "STHeitiTC-Medium",
            20
        );
        tipLabel.setPosition(this._cardLibraryLayerFit.tipLabelPoint);
        this.addChild(tipLabel);

        var cardLibrary = gameData.cardLibrary.get("cardLibrary");
        var len = cardLibrary.length;

        var scrollViewLayer = MarkLayer.create(this._cardLibraryLayerFit.scrollViewLayerRect);
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        var scrollViewHeight = Math.ceil(len / 4) * 143 + 25;

        this._cardItem = {};
        this._cardLockIcon = {};
        this._effect = {};
        for (var i = 0; i < len; ++i) {
            var row = Math.floor(i / 4);
            var index = i % 4;
            var id = cardLibrary[i].id;

            var cardItem = CardHeadNode.getCardHeadItem(cardLibrary[i].card, this._onClickCard(cardLibrary[i]), this);
            cardItem.setPosition(cc.p(94 + 148 * index, scrollViewHeight - 89 - 143 * row));
            menu.addChild(cardItem);

            this._cardItem[id] = cardItem;

            var cardLockIcon = cc.Sprite.create(main_scene_image.icon200);
            cardLockIcon.setScale(0.6);
            cardLockIcon.setPosition(cc.p(83, 24));
            cardItem.addChild(cardLockIcon);

            this._cardLockIcon[id] = cardLockIcon;
        }

        var scrollView = cc.ScrollView.create(this._cardLibraryLayerFit.scrollViewSize, scrollViewLayer);
        scrollView.setContentSize(cc.size(640, scrollViewHeight));
        scrollView.setPosition(this._cardLibraryLayerFit.scrollViewPoint);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);
        scrollView.setContentOffset(scrollView.minContainerOffset());

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(this._cardLibraryLayerFit.backItemPoint);
        var menu = cc.Menu.create(backItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        return true;
    },

    update: function () {
        cc.log("CardLibraryLayer update");

        var cardLibrary = gameData.cardLibrary;

        for (var key in this._cardItem) {
            var type = cardLibrary.getTypeById(key);
            var cardItem = this._cardItem[key];

            if (type == CARD_NO_EXIST) {
                cardItem.setColor(cc.c3b(110, 110, 110));

                if (this._effect[key]) {
                    this._effect[key].removeFromParent();
                }
            } else if (type == CARD_EXIST) {
                cardItem.setColor(cc.c3b(255, 255, 255));

                if (this._effect[key]) {
                    this._effect[key].removeFromParent();
                }

                if (this._cardLockIcon[key]) {
                    this._cardLockIcon[key].setVisible(false);
                }
            } else if (type == CARD_RECEIVE) {
                cardItem.setColor(cc.c3b(110, 110, 110));

                if (!this._effect[key]) {
                    var ret = playEffect({
                        effectId: 1,
                        target: cardItem,
                        loops: 0,
                        delay: 0.1,
                        zOrder: 10,
                        position: cc.p(50, 56)
                    });

                    this._effect[key] = ret.sprite;
                }
            }
        }
    },

    _onClickCard: function (data) {
        return function () {
            cc.log("CardLibraryLayer _onClickCard: " + data.id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var that = this;
            var id = data.id;
            var card = data.card;
            var cardLibrary = gameData.cardLibrary;

            if (cardLibrary.getTypeById(id) == CARD_RECEIVE) {
                cardLibrary.receive(function (data) {
                    cc.log(data);

                    that.update();

                    TipLayer.tipNoBg("活力点: +" + data);

                    gameMark.updateCardLibraryMark(false);
                }, id);
            } else {
                CardDetails.pop(card);
            }
        };
    },

    _onClickBack: function () {
        cc.log("CardLibraryLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        MainScene.getInstance().switchLayer(MainLayer);
    }
});


CardLibraryLayer.create = function () {
    var res = new CardLibraryLayer();

    if (res && res.init()) {
        return res;
    }

    return null;
};