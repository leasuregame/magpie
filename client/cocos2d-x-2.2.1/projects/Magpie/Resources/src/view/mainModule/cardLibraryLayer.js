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
    _scrollView: null,
    _isSort: null,
    _selectIcon: null,

    onEnter: function () {
        cc.log("CardLibraryLayer onEnter");

        this._super();
        this.update();

        lz.um.beginLogPageView("卡库界面");
    },

    onExit: function () {
        cc.log("CardLibraryLayer onExit");

        this._super();

        lz.um.endLogPageView("卡库界面");
    },


    init: function () {
        cc.log("CardLibraryLayer init");

        if (!this._super()) return false;

        this._cardLibraryLayerFit = gameFit.mainScene.cardLibraryLayer;

        this._isSort = true;

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

        this.addCardLibrary();

        return true;
    },

    addCardLibrary: function () {
        cc.log("CardLibraryLayer addCardLibrary isSort: " + this._isSort);

        gameData.cardLibrary.isSortByState(this._isSort);

        var cardLibrary = gameData.cardLibrary.get("cardLibrary");
        var len = cardLibrary.length;

        var scrollViewLayer = MarkLayer.create(this._cardLibraryLayerFit.scrollViewLayerRect);
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        var scrollViewHeight = Math.ceil(250 / 4) * 143;
        if (scrollViewHeight < this._cardLibraryLayerFit.scrollViewHeight) {
            scrollViewHeight = this._cardLibraryLayerFit.scrollViewHeight;
        }

        if (this._scrollView) {
            this._scrollView.removeFromParent();
        }

        this._cardItem = {};
        this._cardLockIcon = {};
        this._effect = {};
        var i;
        var row = 0;
        var index = 0;
        for (i = 0; i < len; ++i) {
            row = Math.floor(i / 4);
            index = i % 4;
            var id = cardLibrary[i].id;
            var type = gameData.cardLibrary.getTypeById(id);
            if (type == CARD_EXIST) {
                this._cardItem[id] = CardHeadNode.getCardHeadItem(cardLibrary[i].card, this._onClickCard(cardLibrary[i]), this);
                this._cardItem[id].setPosition(cc.p(94 + 148 * index, scrollViewHeight - 69 - 143 * row));
                menu.addChild(this._cardItem[id]);

            } else if (type == CARD_RECEIVE) {
                this._cardItem[id] = CardHeadNode.getCardHeadItem(cardLibrary[i].card, this._onClickCard(cardLibrary[i]), this);
                this._cardItem[id].setPosition(cc.p(94 + 148 * index, scrollViewHeight - 69 - 143 * row));
                menu.addChild(this._cardItem[id]);

                this._cardLockIcon[id] = cc.Sprite.create(main_scene_image.card_back);
                this._cardLockIcon[id].setPosition(cc.p(94 + 148 * index, scrollViewHeight - 69 - 143 * row));
                scrollViewLayer.addChild(this._cardLockIcon[id], 2);


            } else {
                this._cardLockIcon[id] = cc.Sprite.create(main_scene_image.card_back);
                this._cardLockIcon[id].setPosition(cc.p(94 + 148 * index, scrollViewHeight - 69 - 143 * row));
                scrollViewLayer.addChild(this._cardLockIcon[id], 2);

            }
        }

        for (; i < 250; i++) {
            row = Math.floor(i / 4);
            index = i % 4;
            var cardLockIcon = cc.Sprite.create(main_scene_image.card_back);
            cardLockIcon.setPosition(cc.p(94 + 148 * index, scrollViewHeight - 69 - 143 * row));
            scrollViewLayer.addChild(cardLockIcon, 2);
        }

        this._scrollView = cc.ScrollView.create(this._cardLibraryLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setPosition(this._cardLibraryLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());

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
                    this._effect[key] = null;
                }
            } else if (type == CARD_EXIST) {
                cardItem.setColor(cc.c3b(255, 255, 255));

                if (this._effect[key]) {
                    this._effect[key].removeFromParent();
                    this._effect[key] = null;
                }

                if (this._cardLockIcon[key]) {
                    this._cardLockIcon[key].removeFromParent();
                    this._cardLockIcon[key] = null;
                }

            } else if (type == CARD_RECEIVE) {
                cardItem.setColor(cc.c3b(110, 110, 110));

                if (!this._effect[key]) {

                    var ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect19, this);
                    ccbNode.setPosition(cardItem.getPosition());
                    this._effect[key] = ccbNode;
                    this._scrollView.addChild(this._effect[key], 3);
                }
            }
        }
    },

    _onClickSort: function () {
        cc.log("CardLibraryLayer _onClickSort");
        this._isSort = !this._isSort;
        this._selectIcon.setVisible(this._isSort);
        this.addCardLibrary();
        this.update();
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

                    var effect = cc.BuilderReader.load(main_scene_image.uiEffect44, this);
                    effect.setPosition(cc.p(54, 54));
                    that._cardItem[id].addChild(effect);

                    cc.log(effect);

                    effect.animationManager.setCompletedAnimationCallback(this, function () {
                        var lightEffect = cc.BuilderReader.load(main_scene_image.uiEffect21, this);
                        lightEffect.setPosition(cc.p(100, 100));
                        that._cardItem[id].addChild(lightEffect);
                        lightEffect.animationManager.setCompletedAnimationCallback(this, function () {
                            lightEffect.removeFromParent();
                        });
                        effect.removeFromParent();
                    });
                    lz.tipReward(data);

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
