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
    init: function () {
        cc.log("PaymentLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(540, 720));
        bgSprite.setPosition(cc.p(360, 580));
        this.addChild(bgSprite);

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button37,
            main_scene_image.button37s,
            this._onClickClose,
            this
        );
        closeItem.setPosition(cc.p(605, 925));

        var vipPrivilegeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button38,
            main_scene_image.button38s,
            main_scene_image.icon164,
            this._onClickVipPrivilege,
            this
        );
        vipPrivilegeItem.setPosition(cc.p(530, 840));

        var menu = cc.Menu.create(
            closeItem,
            vipPrivilegeItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var tipLabel = cc.Sprite.create(main_scene_image.icon160);
        tipLabel.setPosition(cc.p(260, 900));
        this.addChild(tipLabel);

        var paymentTypeList = gameData.shop.getPaymentTypeList();
        var len = paymentTypeList.length;

        var scrollViewLayer = MarkLayer.create(cc.rect(107, 260, 500, 550));
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
                main_scene_image.icon159,
                this._onClickPayment(paymentTypeList[i].id),
                this
            );
            paymentItem.setPosition(cc.p(421, y + 50));
            menu.addChild(paymentItem);

        }

        var scrollView = cc.ScrollView.create(cc.size(500, 550), scrollViewLayer);
        scrollView.setTouchPriority(-300);
        scrollView.setPosition(cc.p(108, 260));
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        scrollView.setContentSize(cc.size(500, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());

        return true;
    },

    _onClickClose: function () {
        cc.log("PaymentLayer _onClickClose");

        this.removeFromParent();
    },

    _onClickVipPrivilege: function () {
        cc.log("PaymentLayer _onClickVipPrivilege");

        var parent = this.getParent();

        var vipPrivilegeLayer = VipPrivilegeLayer.create();
        parent.addChild(vipPrivilegeLayer, 1);

        this.removeFromParent();
    },

    _onClickPayment: function (id) {
        return function () {
            cc.log("PaymentLayer _onClickPayment: " + id);

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
};