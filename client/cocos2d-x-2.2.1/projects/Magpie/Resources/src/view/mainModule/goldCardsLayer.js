/**
 * Created by lujunyu on 14-1-17.
 */

var GoldCardsLayer = cc.Layer.extend({
    _goldCardsLayerFit: null,

    _tipLabel: [],
    _nextBuyLabel: [],
    _paymentItem: [],
    _gotItem: [],

    onEnter: function () {
        cc.log("GoldCardsLayer onEnter");
        this._super();
        this.update();
        lz.um.beginLogPageView("周卡月卡界面");
    },

    onExit: function () {
        cc.log("GoldCardsLayer onExit");
        this._super();

        lz.um.endLogPageView("周卡月卡界面");
    },

    init: function () {
        cc.log("GoldCardsLayer init");

        if (!this._super()) return false;

        this._goldCardsLayerFit = gameFit.mainScene.goldCardsLayer;

        var paymentTypeList = gameData.shop.getPaymentTypeList();

        var topIcon = cc.Sprite.create(main_scene_image.icon345);
        topIcon.setPosition(this._goldCardsLayerFit.topIconPoint);
        this.addChild(topIcon);

        var type = ["month", "week"];
        var point = this._goldCardsLayerFit.nodePoints;

        for (var i = 0; i < 2; i++) {

            var pCard = paymentTypeList[i];
            var remainDays = gameData.player.getRemainDays(i);

            var label = cc.Node.create();
            label.setPosition(point[i]);
            this.addChild(label);

            var menu = LazyMenu.create();
            menu.setPosition(cc.p(0, 0));
            label.addChild(menu, 1);

            var bgIcon = cc.Sprite.create(main_scene_image.bg22);
            bgIcon.setPosition(cc.p(0, 0));
            label.addChild(bgIcon);

            var cardIcon = cc.Sprite.create(main_scene_image["icon" + (346 + i)]);
            cardIcon.setPosition(cc.p(0, 70));
            label.addChild(cardIcon);

            var tipNode = cc.Node.create();
            tipNode.setPosition(cc.p(0, 0));
            label.addChild(tipNode);

            var firstLabel = cc.LabelTTF.create("首次获得" + (pCard.cash * 10 + pCard.gold), "STHeitiTC-Medium", 25);
            firstLabel.setAnchorPoint(cc.p(1, 0.5));
            firstLabel.setColor(cc.c3b(133, 37, 7));
            firstLabel.setPosition(cc.p(-35, 0));
            tipNode.addChild(firstLabel);

            var goldIcon1 = cc.Sprite.create(main_scene_image.icon148);
            goldIcon1.setScale(0.7);
            goldIcon1.setPosition(cc.p(-20, 0));
            tipNode.addChild(goldIcon1);

            var dailyLabel = cc.LabelTTF.create(",每日返还" + pCard.daily_gold, "STHeitiTC-Medium", 25);
            dailyLabel.setAnchorPoint(cc.p(0, 0.5));
            dailyLabel.setColor(cc.c3b(133, 37, 7));
            dailyLabel.setPosition(cc.p(0, 0));
            tipNode.addChild(dailyLabel);

            var goldIcon2 = cc.Sprite.create(main_scene_image.icon148);
            goldIcon2.setScale(0.7);
            goldIcon2.setPosition(cc.p(165 - i * 14, 0));
            tipNode.addChild(goldIcon2);
            this._tipLabel[i] = tipNode;

            var tipNode2 = cc.Node.create();
            tipNode2.setPosition(cc.p(0, 0));
            label.addChild(tipNode2);

            var dailyGotLabel = cc.LabelTTF.create("每日登陆可领取" + pCard.daily_gold, "STHeitiTC-Medium", 25);
            dailyGotLabel.setAnchorPoint(cc.p(0, 0.5));
            dailyGotLabel.setColor(cc.c3b(133, 37, 7));
            dailyGotLabel.setPosition(cc.p(-115, 10));
            tipNode2.addChild(dailyGotLabel);

            var goldIcon3 = cc.Sprite.create(main_scene_image.icon148);
            goldIcon3.setScale(0.7);
            goldIcon3.setPosition(cc.p(120 - i * 14, 10));
            tipNode2.addChild(goldIcon3);

            var nextLabel = cc.LabelTTF.create("距离下次购买：" + remainDays + "天", "STHeitiTC-Medium", 18);
            nextLabel.setPosition(cc.p(0, -20));
            nextLabel.setColor(cc.c3b(133, 37, 7));
            tipNode2.addChild(nextLabel);

            this._nextBuyLabel[i] = tipNode2;

            this._paymentItem[i] = cc.MenuItemImage.createWithIcon(
                main_scene_image.button21,
                main_scene_image.button21s,
                main_scene_image.button21d,
                main_scene_image.icon159,
                this._onClickGo2Payment,
                this
            );
            this._paymentItem[i].setPosition(cc.p(0, -70));
            menu.addChild(this._paymentItem[i]);

            this._gotItem[i] = cc.MenuItemImage.createWithIcon(
                main_scene_image.button10,
                main_scene_image.button10s,
                main_scene_image.button9d,
                main_scene_image.icon123,
                this._onClickGotDaily(type[i]),
                this
            );

            this._gotItem[i].setPosition(cc.p(0, -70));
            menu.addChild(this._gotItem[i]);

        }

        return true;
    },

    update: function () {
        cc.log("GoldCardsLayer update");

        for (var i = 0; i < 2; i++) {
            var remainDays = gameData.player.getRemainDays(i);
            var isGot = gameData.player.isGotDaily(i);
            var status = gameData.player.goldCardsStatus(i);

            this._tipLabel[i].setVisible(remainDays <= 0);
            this._nextBuyLabel[i].setVisible(remainDays > 0);
            this._paymentItem[i].setVisible(remainDays <= 0);
            this._gotItem[i].setVisible(remainDays > 0);
            this._gotItem[i].setEnabled(!isGot && status);
        }
    },

    _onClickGo2Payment: function () {
        cc.log("GoldCardsLayer _onClickGo2Payment");

        var shopLayer = ShopLayer.create();
        shopLayer._onClickVipLayer();
        MainScene.getInstance().switchTo(shopLayer);
    },

    _onClickGotDaily: function (type) {
        var that = this;
        return function () {
            cc.log("GoldCardsLayer _onClickGotDaily: " + type);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);
            gameData.shop.getDailyReward(function () {
                that.update();
            }, type);
        }
    }

});


GoldCardsLayer.create = function () {
    cc.log("GoldCardsLayer create");

    var ref = new GoldCardsLayer();
    if (ref && ref.init()) {
        return ref;
    }

    return null;
};