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

    onEnter: function () {
        cc.log("PaymentLayer onEnter");

        this._super();

        lz.dc.beginLogPageView("充值界面");
    },

    onExit: function () {
        cc.log("PaymentLayer onExit");

        this._super();

        lz.dc.endLogPageView("充值界面");
    },

    init: function () {
        cc.log("PaymentLayer init");

        if (!this._super()) return false;

        this._paymentLayerFit = gameFit.mainScene.paymentLayer;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 640, 1136);
        bgLayer.setPosition(this._paymentLayerFit.bgLayerPoint);
        this.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(this._paymentLayerFit.bgSpriteContentSize);
        bgSprite.setPosition(this._paymentLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

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
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var tipIcon = cc.Sprite.create(main_scene_image.icon160);
        tipIcon.setPosition(this._paymentLayerFit.tipIconPoint);
        this.addChild(tipIcon);

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

            tipLabel.setAnchorPoint(cc.p(0, 0.5));
            tipLabel.setPosition(this._paymentLayerFit.tipLabelPoint);
            this.addChild(tipLabel);
        }

        var paymentTypeList = gameData.shop.getPaymentTypeList();
        var len = paymentTypeList.length;

        var scrollViewLayer = MarkLayer.create(this._paymentLayerFit.scrollViewLayerRect);
        var menu = LazyMenu.create();
        menu.setTouchPriority(-200);
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        var scrollViewHeight = len * 110;

        for (var i = 0; i < len; ++i) {
            var y = scrollViewHeight - 110 - i * 110;

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

            var paymentItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button21,
                main_scene_image.button21s,
                main_scene_image.icon300,
                this._onClickPayment(paymentTypeList[i].id),
                this
            );
            paymentItem.setPosition(cc.p(421, y + 50));
            menu.addChild(paymentItem);

        }

        var scrollView = cc.ScrollView.create(this._paymentLayerFit.scrollViewSize, scrollViewLayer);
        scrollView.setTouchPriority(-300);
        scrollView.setPosition(this._paymentLayerFit.scrollViewPoint);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        scrollView.setContentSize(cc.size(500, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());

        return true;
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

    _onClickPayment: function (id) {
        return function () {
            cc.log("PaymentLayer _onClickPayment: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var parent = this.getParent();
            gameData.shop.payment(function (data) {
                cc.log(data);

                parent.update();
            }, id);
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