/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-4
 * Time: 下午2:34
 * To change this template use File | Settings | File Templates.
 */


/*
 * payment layer
 * */


var PaymentLayer = LazyLayer.extend({
    _paymentLayerFit: null,
    _scrollView: null,

    onEnter: function () {
        cc.log("PaymentLayer onEnter");

        this._super();
        this.update();

        lz.um.beginLogPageView("充值界面");
    },

    onExit: function () {
        cc.log("PaymentLayer onExit");

        this._super();

        lz.um.endLogPageView("充值界面");
    },

    init: function () {
        cc.log("PaymentLayer init");

        if (!this._super()) return false;

        this._paymentLayerFit = gameFit.mainScene.paymentLayer;

        this._scrollView = null;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 640, 1136);
        bgLayer.setPosition(this._paymentLayerFit.bgLayerPoint);
        this.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(this._paymentLayerFit.bgSpriteContentSize);
        bgSprite.setPosition(this._paymentLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var tipIcon = cc.Sprite.create(main_scene_image.icon304);
        tipIcon.setPosition(this._paymentLayerFit.tipIconPoint);
        this.addChild(tipIcon);

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button37,
            main_scene_image.button37s,
            this._onClickClose,
            this
        );
        closeItem.setPosition(this._paymentLayerFit.closeItemPoint);

        var vipPrivilegeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button21,
            main_scene_image.button21s,
            main_scene_image.icon164,
            this._onClickVipPrivilege,
            this
        );
        vipPrivilegeItem.setScale(1.1);
        vipPrivilegeItem.setPosition(this._paymentLayerFit.vipPrivilegeItemPoint);

        var menu = cc.Menu.create(
            closeItem,
            vipPrivilegeItem
        );
        menu.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY - 2);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var nextVipCash = gameData.shop.getNextVipCash();
        var vip = gameData.player.get("vip");
        cc.log(nextVipCash);
        if (nextVipCash) {
            var tipLabel = ColorLabelTTF.create(
                {
                    string: "您是",
                    fontName: "STHeitiTC-Medium",
                    fontSize: 20
                },
                {
                    string: "VIP" + vip,
                    fontName: "STHeitiTC-Medium",
                    fontSize: 20,
                    isStroke: true,
                    color: cc.c3b(255, 248, 69)
                },
                {
                    string: "再冲",
                    fontName: "STHeitiTC-Medium",
                    fontSize: 20
                },
                {
                    string: nextVipCash,
                    fontName: "STHeitiTC-Medium",
                    fontSize: 20,
                    isStroke: true,
                    color: cc.c3b(255, 248, 69)
                },
                {
                    string: "元即可享受",
                    fontName: "STHeitiTC-Medium",
                    fontSize: 20
                },
                {
                    string: "VIP" + (vip + 1),
                    fontName: "STHeitiTC-Medium",
                    fontSize: 20,
                    isStroke: true,
                    color: cc.c3b(255, 248, 69)
                }
            );

            tipLabel.setAnchorPoint(cc.p(0, 0));
            tipLabel.setPosition(this._paymentLayerFit.tipLabelPoint);
            this.addChild(tipLabel);
        }

        return true;
    },

    update: function () {
        cc.log("PaymentLayer update");

        if (this._scrollView) {
            this._scrollView.removeFromParent();
            this._scrollView = null;
        }

        var paymentTypeList = gameData.shop.getPaymentTypeList();
        var len = paymentTypeList.length;

        var scrollViewLayer = MarkLayer.create(this._paymentLayerFit.scrollViewLayerRect);
        scrollViewLayer.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY - 1);

        var menu = LazyMenu.create();
        menu.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY);
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        var scrollViewHeight = len * 110;
        var y = scrollViewHeight;

        var firstPaymentState = gameData.player.get("firstRechargeBox");
        if (firstPaymentState != GOT_FIRST_RECHARGER_BOX) {

            scrollViewHeight += 230;

            var firstPaymentIcon = cc.Sprite.create(main_scene_image.icon376);
            firstPaymentIcon.setAnchorPoint(cc.p(0, 0));
            firstPaymentIcon.setPosition(cc.p(-8, y));
            scrollViewLayer.addChild(firstPaymentIcon);

            var table = outputTables.first_recharge_box.rows[1];

            var cardItem = CardHeadNode.getCardHeadItem(Card.create({
                tableId: table.card_id,
                lv: table.card_lv,
                skillLv: 1
            }));

            cardItem.setScale(0.6);
            cardItem.setAnchorPoint(cc.p(0, 0));
            cardItem.setPosition(cc.p(24, y + 101));
            menu.addChild(cardItem);

            var getRewardItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button10,
                main_scene_image.button10s,
                main_scene_image.button9d,
                main_scene_image.icon123,
                this._onClickGetReward,
                this
            );

            getRewardItem.setPosition(cc.p(255, y + 44));
            getRewardItem.setScale(0.7);
            getRewardItem.setEnabled(firstPaymentState == HAS_FIRST_RECHARGER_BOX);
            menu.addChild(getRewardItem);
        }


        /*
         * 周卡月卡
         */

        var paymentsCards = ['月卡', '周卡'];
        var isBought = false;
        var i = 0;

        for (; i < 2; i++) {
            y -= 110;
            var pCard = paymentTypeList[i];
            var remainDays = gameData.player.getRemainDays(i);

            var bgSprite = cc.Sprite.create(main_scene_image.icon175);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(cc.p(0, y));
            scrollViewLayer.addChild(bgSprite);

            var iconSprite = cc.Sprite.create(main_scene_image["icon" + (342 + i)]);
            iconSprite.setPosition(cc.p(55, y + 52));
            scrollViewLayer.addChild(iconSprite);

            var nameLabel = StrokeLabel.create(paymentsCards[i] + ':', "STHeitiTC-Medium", 22);
            nameLabel.setColor(cc.c3b(255, 244, 73));
            nameLabel.setPosition(cc.p(132, y + 80));
            scrollViewLayer.addChild(nameLabel);

            var cashIcon = cc.Sprite.create(main_scene_image.icon173);
            cashIcon.setPosition(cc.p(185, y + 80));
            scrollViewLayer.addChild(cashIcon);

            var priceLabel = StrokeLabel.create(pCard.cash, "STHeitiTC-Medium", 22);
            priceLabel.setPosition(cc.p(220, y + 80));
            scrollViewLayer.addChild(priceLabel);

            var firstLabel = cc.LabelTTF.create("首次", "STHeitiTC-Medium", 20);
            firstLabel.setAnchorPoint(cc.p(0, 0.5));
            firstLabel.setPosition(cc.p(110, y + 52));
            firstLabel.setVisible(remainDays <= 0);
            scrollViewLayer.addChild(firstLabel);

            var goldIcon1 = cc.Sprite.create(main_scene_image.icon148);
            goldIcon1.setScale(0.7);
            if (remainDays > 0) {
                goldIcon1.setPosition(cc.p(235, y + 52));
            } else {
                goldIcon1.setPosition(cc.p(175, y + 52));
            }
            scrollViewLayer.addChild(goldIcon1);

            var firstGetLabel = cc.LabelTTF.create(pCard.cash * 10 + pCard.gold, "STHeitiTC-Medium", 20);
            firstGetLabel.setAnchorPoint(cc.p(0, 0.5));
            firstGetLabel.setPosition(cc.p(200, y + 52));
            firstGetLabel.setVisible(remainDays <= 0);
            scrollViewLayer.addChild(firstGetLabel);

            var dailyLabel = cc.LabelTTF.create("每日返还", "STHeitiTC-Medium", 20);
            dailyLabel.setAnchorPoint(cc.p(0, 0.5));
            dailyLabel.setPosition(cc.p(110, y + 24));
            dailyLabel.setVisible(remainDays <= 0);
            scrollViewLayer.addChild(dailyLabel);

            var goldIcon2 = cc.Sprite.create(main_scene_image.icon148);
            goldIcon2.setScale(0.7);
            goldIcon2.setPosition(cc.p(215, y + 24));
            goldIcon2.setVisible(remainDays <= 0);
            scrollViewLayer.addChild(goldIcon2);

            var dailyGetLabel = cc.LabelTTF.create(pCard.daily_gold, "STHeitiTC-Medium", 20);
            dailyGetLabel.setAnchorPoint(cc.p(0, 0.5));
            dailyGetLabel.setPosition(cc.p(240, y + 24));
            dailyGetLabel.setVisible(remainDays <= 0);
            scrollViewLayer.addChild(dailyGetLabel);

            var tipLabel = cc.LabelTTF.create("每日可领取", "STHeitiTC-Medium", 20);
            tipLabel.setAnchorPoint(cc.p(0, 0.5));
            tipLabel.setPosition(cc.p(110, y + 52));
            tipLabel.setVisible(remainDays > 0);
            scrollViewLayer.addChild(tipLabel);

            var dayLabel = cc.LabelTTF.create(pCard.daily_gold + " x " + pCard.valid_days + "天", "STHeitiTC-Medium", 20);
            dayLabel.setAnchorPoint(cc.p(0, 0.5));
            dayLabel.setPosition(cc.p(255, y + 52));
            dayLabel.setVisible(remainDays > 0);
            scrollViewLayer.addChild(dayLabel);

            var nextBuyLabel = cc.LabelTTF.create("距离下次购买：" + remainDays + "天", "STHeitiTC-Medium", 20);
            nextBuyLabel.setAnchorPoint(cc.p(0, 0.5));
            nextBuyLabel.setPosition(cc.p(110, y + 24));
            nextBuyLabel.setVisible(remainDays > 0);
            scrollViewLayer.addChild(nextBuyLabel);

            var paymentItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button21,
                main_scene_image.button21s,
                main_scene_image.button21d,
                main_scene_image.icon159,
                this._onClickPayment(paymentTypeList[i]),
                this
            );
            paymentItem.setPosition(cc.p(421, y + 50));
            paymentItem.setEnabled(remainDays == 0);
            menu.addChild(paymentItem);
        }

        for (; i < len; ++i) {
            y -= 110;

            var bgSprite = cc.Sprite.create(main_scene_image.icon175);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(cc.p(0, y));
            scrollViewLayer.addChild(bgSprite);

            var cashIcon = cc.Sprite.create(main_scene_image.icon173);
            cashIcon.setPosition(cc.p(30, y + 52));
            scrollViewLayer.addChild(cashIcon);

            var goldIcon = cc.Sprite.create(main_scene_image.icon148);
            goldIcon.setScale(0.7);
            goldIcon.setPosition(cc.p(155, y + 52));
            scrollViewLayer.addChild(goldIcon);

            var otherGoldIcon = cc.Sprite.create(main_scene_image.icon166);
            otherGoldIcon.setPosition(cc.p(270, y + 53));
            scrollViewLayer.addChild(otherGoldIcon);

            var equalIcon = StrokeLabel.create("=", "STHeitiTC-Medium", 40);
            equalIcon.setPosition(cc.p(122, y + 47));
            scrollViewLayer.addChild(equalIcon);

            var cashLabel = StrokeLabel.create(paymentTypeList[i].cash, "STHeitiTC-Medium", 28);
            cashLabel.setPosition(cc.p(76, y + 50));
            scrollViewLayer.addChild(cashLabel);

            var goldLabel = StrokeLabel.create(paymentTypeList[i].cash * 10, "STHeitiTC-Medium", 28);
            goldLabel.setPosition(cc.p(210, y + 50));
            scrollViewLayer.addChild(goldLabel);

            var otherGoldLabel = StrokeLabel.create(paymentTypeList[i].gold, "STHeitiTC-Medium", 28);
            otherGoldLabel.setPosition(cc.p(320, y + 50));
            scrollViewLayer.addChild(otherGoldLabel);

            var url = (i == 2) ? "icon365" : "icon364";
            var tipIcon = cc.Sprite.create(main_scene_image[url]);
            tipIcon.setPosition(cc.p(40, y + 90));
            tipIcon.setVisible(gameData.player.isFirstPayment(paymentTypeList[i].id));
            scrollViewLayer.addChild(tipIcon);

            var paymentItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button21,
                main_scene_image.button21s,
                main_scene_image.icon159,
                this._onClickPayment(paymentTypeList[i]),
                this
            );
            paymentItem.setPosition(cc.p(421, y + 50));
            menu.addChild(paymentItem);

        }

        this._scrollView = cc.ScrollView.create(this._paymentLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY - 3);
        this._scrollView.setPosition(this._paymentLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(500, scrollViewHeight));
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());
    },

    _onClickGetReward: function () {
        cc.log("PaymentLayer _onClickGetReward");

        var that = this;
        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        gameData.activity.getFirstRechargeBox(function (reward) {
            lz.tipReward(reward);
            that.update();
        });

    },

    _onClickClose: function () {
        cc.log("PaymentLayer _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();
    },

    _onClickVipPrivilege: function () {
        cc.log("PaymentLayer _onClickVipPrivilege");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var parent = this.getParent();

        var vipPrivilegeLayer = VipPrivilegeLayer.create();
        parent.addChild(vipPrivilegeLayer, 1);

        this.removeFromParent();
    },

    _onClickPayment: function (product) {
        var that = this;
        return function () {
            cc.log("PaymentLayer _onClickPayment: " + product);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var cb = function () {
                that.update();
            };

            gameData.payment.buy({cb: cb, product: product});
        }
    }
});


PaymentLayer.create = function () {
    var ret = new PaymentLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};

PaymentLayer.pop = function () {
    var paymentLayer = PaymentLayer.create();

    MainScene.getInstance().getLayer().addChild(paymentLayer, 10);

    return paymentLayer;
};