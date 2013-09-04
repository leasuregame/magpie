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
    onEnter: function () {
        cc.log("PaymentLayer onEnter");

        this._super();
        this.update();
    },

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
        closeItem.setPosition(cc.p(615, 935));

        var vipPrivilegeItem = cc.MenuItemImage.create(
            main_scene_image.button38,
            main_scene_image.button38s,
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

        var vipPrivilegeIcon = cc.Sprite.create(main_scene_image.icon164);
        vipPrivilegeIcon.setPosition(cc.p(530, 840));
        this.addChild(vipPrivilegeIcon);

        var tipLabel = cc.Sprite.create(main_scene_image.icon160);
        tipLabel.setPosition(cc.p(360, 900));
        this.addChild(tipLabel);

        var len = 6;

        var scrollViewLayer = MarkLayer.create(cc.rect(107, 260, 500, 550));
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        var scrollViewHeight = len * 110;

        for (var i = 1; i <= len; ++i) {
            var y = scrollViewHeight - i * 110;

            var bgSprite = cc.Sprite.create(main_scene_image.icon175);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(cc.p(0, y));
            scrollViewLayer.addChild(bgSprite);


        }

        this._scrollView = cc.ScrollView.create(cc.size(500, 550), scrollViewLayer);
        this._scrollView.setTouchPriority(-300);
        this._scrollView.setPosition(cc.p(107, 260));
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(500, scrollViewHeight));
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());

        return true;
    },

    update: function () {
        cc.log("PaymentLayer update");
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
    }
});


PaymentLayer.create = function () {
    var ret = new PaymentLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};