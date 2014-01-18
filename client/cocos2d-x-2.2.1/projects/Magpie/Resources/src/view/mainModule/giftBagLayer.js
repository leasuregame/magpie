/**
 * Created by lujunyu on 14-1-9.
 */

var giftBagGoods = {
    energy: {
        name: "活力点",
        url: "icon110"
    },

    money: {
        name: "仙币",
        url: "icon108"
    },

    skillPoint: {
        name: "技能点",
        url: "icon109"
    },

    elixir: {
        name: "仙丹",
        url: "icon107"
    },

    fragments: {
        name: "卡魂",
        url: "icon145"
    },

    exp_card: {
        name: "经验元灵",
        url: "icon146"
    },

    gold: {
        name: "魔石",
        url: "icon112"
    },

    power: {
        name: "体力",
        url: "icon106"
    },

    powerValue: {
        name: "体力",
        url: "icon106"
    },

    cardArray: {
        name: "cardArray"
    }
};

var SHOW_GIFT_BAG = 1;
var BUY_GIFT_BAG = 2;
var GET_GIFT_BAG = 3;

var GiftBagLayer = cc.Layer.extend({

    _giftBagLayerFit: null,

    init: function (data) {
        cc.log("GiftBagLayer init: " + data);

        if (!this._super()) return false;

        this._giftBagLayerFit = gameFit.mainScene.giftBagLayer;

        var reward = data.reward;
        var cb = data.cb || null;
        var type = data.type || SHOW_GIFT_BAG;

        var lazyLayer = LazyLayer.create();
        this.addChild(lazyLayer);

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        lazyLayer.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg21);
        bgSprite.setPosition(this._giftBagLayerFit.bgSprite2Point);
        lazyLayer.addChild(bgSprite);

        var topBgIcon = cc.Sprite.create(main_scene_image.icon332);
        topBgIcon.setPosition(this._giftBagLayerFit.topBgIconPoint);
        lazyLayer.addChild(topBgIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon333);
        titleIcon.setPosition(this._giftBagLayerFit.titleIconPoint);
        lazyLayer.addChild(titleIcon);

        var keys = Object.keys(reward);
        var len = keys.length;

        var scrollViewLayer = MarkLayer.create(this._giftBagLayerFit.scrollViewLayerRect2);

        var total = 0;
        for (key in reward) {
            if (giftBagGoods[key] != undefined && (reward[key] > 0 || reward[key].length > 0)) {
                total++;
            }
        }

        var scrollViewHeight = total * 120;
        if (scrollViewHeight < 480) {
            scrollViewHeight = 480;
        }

        var index = 0;
        var x = 140;
        var cardMenu = cc.Menu.create();
        cardMenu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(cardMenu);

        for (var i = 0; i < len; i++) {
            var key = keys[i];
            if (giftBagGoods[key] != undefined && (reward[key] > 0 || reward[key].length > 0)) {

                if (giftBagGoods[key].name == "cardArray") {
                    var cards = reward[key];
                    var cardsLen = cards.length;
                    for (var j = 0; j < cardsLen; j++) {
                        var y = scrollViewHeight - index * 110 - 60;
                        var card = Card.create(cards[j]);
                        var cardItem = CardHeadNode.getCardHeadItem(card);
                        cardItem.setScale(0.82);
                        cardItem.setPosition(cc.p(x - 10, y));
                        cardMenu.addChild(cardItem);

                        var nameLabel = StrokeLabel.create(card.get("name"), "STHeitiTC-Medium", 25);
                        nameLabel.setColor(cc.c3b(255, 252, 175));
                        nameLabel.setAnchorPoint(cc.p(0, 0.5));
                        nameLabel.setPosition(cc.p(x + 50, y + 20));
                        scrollViewLayer.addChild(nameLabel);

                        var countBgIcon = cc.Sprite.create(main_scene_image.icon334);
                        countBgIcon.setPosition(cc.p(x + 170, y - 20));
                        scrollViewLayer.addChild(countBgIcon);

                        var countLabel = StrokeLabel.create("数量    1", "STHeitiTC-Medium", 25);
                        countLabel.setAnchorPoint(cc.p(0, 0.5));
                        countLabel.setPosition(cc.p(x + 50, y - 20));
                        scrollViewLayer.addChild(countLabel);
                        index++;

                    }

                } else {
                    var y = scrollViewHeight - index * 110 - 60;
                    var goods = giftBagGoods[key];
                    var goodsSprite = cc.Sprite.create(main_scene_image[goods.url]);
                    goodsSprite.setPosition(cc.p(x - 10, y));
                    scrollViewLayer.addChild(goodsSprite);

                    var nameLabel = StrokeLabel.create(goods.name, "STHeitiTC-Medium", 25);
                    nameLabel.setColor(cc.c3b(255, 252, 175));
                    nameLabel.setAnchorPoint(cc.p(0, 0.5));
                    nameLabel.setPosition(cc.p(x + 50, y + 20));
                    scrollViewLayer.addChild(nameLabel);

                    var countBgIcon = cc.Sprite.create(main_scene_image.icon334);
                    countBgIcon.setPosition(cc.p(x + 170, y - 20));
                    scrollViewLayer.addChild(countBgIcon);

                    var countLabel = StrokeLabel.create("数量    " + reward[key], "STHeitiTC-Medium", 25);
                    countLabel.setAnchorPoint(cc.p(0, 0.5));
                    countLabel.setPosition(cc.p(x + 50, y - 20));
                    scrollViewLayer.addChild(countLabel);
                    index++;
                }
            }
        }

        var scrollView = cc.ScrollView.create(cc.size(500, 480), scrollViewLayer);
        scrollView.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
        scrollView.setPosition(this._giftBagLayerFit.scrollViewPoint2);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        lazyLayer.addChild(scrollView);

        scrollView.setContentSize(cc.size(500, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            function () {
                gameData.sound.playEffect(main_scene_image.click_button_sound, false);

                lazyLayer.removeFromParent();
                if (cb) {
                    cb();
                }
            },
            this
        );
        okItem.setPosition(this._giftBagLayerFit.okItemPoint);
        okItem.setVisible(type == SHOW_GIFT_BAG);

        var buyItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon163,
            function () {
                gameData.sound.playEffect(main_scene_image.click_button_sound, false);

                lazyLayer.removeFromParent();
                if (cb) {
                    cb();
                }
            },
            this
        );
        buyItem.setPosition(this._giftBagLayerFit.buyItemPoint);
        buyItem.setVisible(type == BUY_GIFT_BAG);

        var cancelItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon308,
            function () {
                gameData.sound.playEffect(main_scene_image.click_button_sound, false);

                lazyLayer.removeFromParent();
            },
            this
        );
        cancelItem.setPosition(this._giftBagLayerFit.cancelItemPoint);
        cancelItem.setVisible(type == BUY_GIFT_BAG);

        var menu = cc.Menu.create(okItem, buyItem, cancelItem);
        menu.setPosition(cc.p(0, 0));
        lazyLayer.addChild(menu);

        return true;

    }
});

GiftBagLayer.create = function (data) {
    cc.log("GiftBagLayer create");

    var ref = new GiftBagLayer();
    if (ref && ref.init(data)) {
        return ref;
    }

    return null;
};

GiftBagLayer.pop = function (data) {
    var giftBagLayer = GiftBagLayer.create(data);

    MainScene.getInstance().addChild(giftBagLayer);
}
