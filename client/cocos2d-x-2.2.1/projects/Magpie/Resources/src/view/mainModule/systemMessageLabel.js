/**
 * Created by lujunyu on 14-5-17.
 */

var SystemMessageLabel = LazyLayer.extend({

    _cb: null,
    _cardsLen: null,

    init: function (data) {
        cc.log("SystemMessageLabel init");

        if (!this._super()) return false;

        if (data.cb) {
            this._cb = data.cb;
        }

        var message = data.message;
        this._cardsLen = 0;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        var point = gameFit.GAME_MIDPOINT;
        var effect = cc.BuilderReader.load(main_scene_image.uiEffect113, this);
        effect.setPosition(point);
        this.addChild(effect);

        var frameLayer = cc.Node.create();
        effect.controller.ccbLabel.addChild(frameLayer);

        var bgLabel = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgLabel.setContentSize(cc.size(550, 730));
        bgLabel.setPosition(cc.p(0, 0));
        frameLayer.addChild(bgLabel);

        var titleLabel = cc.LabelTTF.create(message.title, "STHeitiTC-Medium", 30);
        titleLabel.setPosition(cc.p(0, 325));
        titleLabel.setColor(cc.c3b(255, 239, 213));
        frameLayer.addChild(titleLabel);

        var contentBgLabel = cc.Scale9Sprite.create(main_scene_image.icon175);
        contentBgLabel.setContentSize(cc.size(490, 230));
        contentBgLabel.setPosition(cc.p(0, 180));
        frameLayer.addChild(contentBgLabel);

        var scrollViewLayer = MarkLayer.create(cc.rect(0, 0, 490, 200));
        var content = lz.format2(message.content, "STHeitiTC-Medium", 22, 440);
        var len = content.length;

        var i, x, y;
        var scrollViewHeight = len * 25;

        for (i = 0; i < len; i++) {
            y = scrollViewHeight - 25 - 25 * i;
            var text = cc.LabelTTF.create(content[i], "STHeitiTC-Medium", 22);
            text.setAnchorPoint(cc.p(0, 0));
            text.setPosition(cc.p(28, y));
            text.setColor(cc.c3b(255, 239, 213));
            scrollViewLayer.addChild(text);
        }

        var scrollView = cc.ScrollView.create(cc.size(490, 200), scrollViewLayer);
        scrollView.setPosition(cc.p(0, 15));
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY - 1);
        scrollView.updateInset();
        contentBgLabel.addChild(scrollView);

        scrollView.setContentSize(cc.size(490, scrollViewHeight));
        scrollView.setContentOffset(cc.p(0, scrollView.minContainerOffset().y));

        var rewardsBgLabel = cc.Scale9Sprite.create(main_scene_image.icon175);
        rewardsBgLabel.setContentSize(cc.size(490, 320));
        rewardsBgLabel.setPosition(cc.p(0, -115));
        frameLayer.addChild(rewardsBgLabel);

        var attachmentLabel = cc.LabelTTF.create("附件：", "STHeitiTC-Medium", 28);
        attachmentLabel.setAnchorPoint(cc.p(0, 0.5));
        attachmentLabel.setPosition(cc.p(18, 290));
        attachmentLabel.setColor(cc.c3b(255, 239, 213));
        rewardsBgLabel.addChild(attachmentLabel);

        var rewards = message.rewards;
        var index = 0;

        var cardMenu = cc.Menu.create();
        cardMenu.setPosition(cc.p(0, 0));
        rewardsBgLabel.addChild(cardMenu);

        for (var key in rewards) {
            if (key == "cardArray") {
                var cards = rewards[key];
                this._cardsLen = cards.length;
                for (i = 0; i < this._cardsLen; i++) {
                    x = 67 + (index % 5 ) * 92;
                    y = 212 - parseInt(index / 5) * 100;
                    var card = Card.create(cards[i]);
                    var cardItem = CardHeadNode.getCardHeadItem(card);
                    cardItem.setScale(0.82);
                    cardItem.setPosition(cc.p(x, y));
                    cardMenu.addChild(cardItem);

                    var numLabel = StrokeLabel.create("+" + cards[i].qty, "STHeitiTC-Medium", 20);
                    numLabel.setAnchorPoint(cc.p(1, 0));
                    numLabel.setPosition(cc.p(90, 10));
                    numLabel.setColor(cc.c3b(255, 255, 255));
                    numLabel.setBgColor(cc.c3b(0, 0, 0));
                    cardItem.addChild(numLabel);

                    index++;
                }
            } else {
                x = 25 + (index % 5 ) * 92;
                y = 170 - parseInt(index / 5) * 100;

                var goods = giftBagGoods[key];
                var goodsSprite = cc.Sprite.create(main_scene_image[goods.url]);
                goodsSprite.setAnchorPoint(cc.p(0, 0));
                goodsSprite.setPosition(cc.p(x, y));
                rewardsBgLabel.addChild(goodsSprite);

                var goodsLabel = cc.LabelTTF.create("+" + rewards[key], "STHeitiTC-Medium", 16);
                goodsLabel.setAnchorPoint(cc.p(1, 0));
                goodsLabel.setPosition(cc.p(73, 8));
                goodsSprite.addChild(goodsLabel);
                index++;
            }
        }

        var OKItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickOK(message),
            this
        );
        OKItem.setPosition(cc.p(0, -315));
        OKItem.setVisible(message.status == HANDLED_STATUS || !index);

        var getRewardItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button10,
            main_scene_image.button10s,
            main_scene_image.icon123,
            this._onClickGetReward(message.id),
            this
        );
        getRewardItem.setPosition(cc.p(0, -315));
        getRewardItem.setVisible(message.status == UNHANDLED_STATUS && index > 0);

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button37,
            main_scene_image.button37s,
            this._onClickClose,
            this
        );
        closeItem.setPosition(cc.p(250, 340));

        var menu = cc.Menu.create(OKItem, closeItem, getRewardItem);
        menu.setPosition(cc.p(0, 0));
        frameLayer.addChild(menu);

        return true;
    },

    _onClickGetReward: function (id) {
        var that = this;

        return function () {
            cc.log("SystemMessageLabel _onClickGetReward: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            if (that._cardsLen > 0) {
                if (gameData.cardList.isFull()) {
                    CardListFullTipLayer.pop();
                    return;
                }
            }

            gameData.message.receive(function () {
                that.removeFromParent();
                that._cb();
            }, id);
        }

    },

    _onClickOK: function (message) {
        var that = this;

        return function () {
            cc.log("SystemMessageLabel _onClickOK: " + message);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            if (message.status == UNHANDLED_STATUS) {
                gameData.message.handleSysMsg(message.id);
                that._cb();
            }

            that.removeFromParent();
        }
    },

    _onClickClose: function () {
        cc.log("SystemMessageLabel _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();
    }

});

SystemMessageLabel.create = function (data) {
    cc.log("SystemMessageLabel create");

    var ret = new SystemMessageLabel();
    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
};

SystemMessageLabel.pop = function (data) {
    cc.log("SystemMessageLabel pop");

    var systemMessageLabel = SystemMessageLabel.create(data);
    MainScene.getInstance().getLayer().addChild(systemMessageLabel, 10);

};