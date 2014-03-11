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
    },

    honor: {
        name: "荣誉",
        url: "icon410"
    },

    superHonor: {
        name: "精元",
        url: "icon411"
    }
};

var SHOW_GIFT_BAG = 1;
var BUY_GIFT_BAG = 2;
var GET_GIFT_BAG = 3;
var SHOW_GIFT_BAG_NO_CLOSE = 4;

var TYPE_GIFT_REWARD = 1;
var TYPE_LOOK_REWARD = 2;

var GiftBagLayer = cc.Layer.extend({
    _giftBagLayerFit: null,

    init: function (data) {
        cc.log("GiftBagLayer init: " + data);

        if (!this._super()) return false;

        this._giftBagLayerFit = gameFit.mainScene.giftBagLayer;

        var reward = data.reward;
        var cb = data.cb || null;
        var type = data.type || SHOW_GIFT_BAG;
        var titleType = data.titleType || TYPE_GIFT_REWARD;
        var tip = data.tip || "当前没有奖励哦！";

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg21);
        bgSprite.setPosition(this._giftBagLayerFit.bgSprite2Point);
        this.addChild(bgSprite);

        var topBgIcon = cc.Sprite.create(main_scene_image.icon332);
        topBgIcon.setPosition(this._giftBagLayerFit.topBgIconPoint);
        this.addChild(topBgIcon);

        var url = "icon333";
        if (titleType == TYPE_LOOK_REWARD) {
            url = "icon388";
        }

        var titleIcon = cc.Sprite.create(main_scene_image[url]);
        titleIcon.setPosition(this._giftBagLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            function () {
                gameData.sound.playEffect(main_scene_image.click_button_sound, false);

                this.removeFromParent();
                if (cb) {
                    cb();
                }
            },
            this
        );
        okItem.setPosition(this._giftBagLayerFit.okItemPoint);
        okItem.setVisible(type == SHOW_GIFT_BAG || type == SHOW_GIFT_BAG_NO_CLOSE);

        var getItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button10,
            main_scene_image.button10s,
            main_scene_image.icon123,
            function () {
                gameData.sound.playEffect(main_scene_image.click_button_sound, false);

                this.removeFromParent();
                if (cb) {
                    cb();
                }
            },
            this
        );
        getItem.setPosition(this._giftBagLayerFit.buyItemPoint);
        getItem.setVisible(type == GET_GIFT_BAG);

        var buyItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon163,
            function () {
                gameData.sound.playEffect(main_scene_image.click_button_sound, false);

                this.removeFromParent();
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
            main_scene_image.icon36,
            function () {
                gameData.sound.playEffect(main_scene_image.click_button_sound, false);

                this.removeFromParent();
            },
            this
        );
        cancelItem.setPosition(this._giftBagLayerFit.cancelItemPoint);
        cancelItem.setVisible(type != SHOW_GIFT_BAG && type != SHOW_GIFT_BAG_NO_CLOSE);

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button75,
            main_scene_image.button75s,
            function () {
                gameData.sound.playEffect(main_scene_image.click_button_sound, false);

                this.removeFromParent();
            },
            this
        );
        closeItem.setPosition(this._giftBagLayerFit.closeItemPoint);
        closeItem.setVisible(type != SHOW_GIFT_BAG_NO_CLOSE);

        var menu = cc.Menu.create(okItem, getItem, buyItem, cancelItem, closeItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        if (reward && Object.keys(reward).length > 0) {
            this._addRankScrollView(reward);
        } else {
            var description = lz.format(tip, 13);
            var len = description.length;
            var point = this._giftBagLayerFit.tipLabelPoint;
            for (var i = 0; i < len; i++) {
                var tipLabel = StrokeLabel.create(description[i], "STHeitiTC-Medium", 30);
                tipLabel.setColor(cc.c3b(255, 255, 255));
                tipLabel.setBgColor(cc.c3b(133, 60, 31));
                tipLabel.setPosition(cc.p(point.x, point.y - i * 40));
                this.addChild(tipLabel);
            }
        }

        return true;
    },

    _addRankScrollView: function (reward) {
        cc.log("GiftBagLayer _addRankScrollView");

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
        this.addChild(scrollView);

        scrollView.setContentSize(cc.size(500, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());
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
};