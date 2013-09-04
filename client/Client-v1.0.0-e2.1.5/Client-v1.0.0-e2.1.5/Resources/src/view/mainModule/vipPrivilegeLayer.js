/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-4
 * Time: 下午4:11
 * To change this template use File | Settings | File Templates.
 */


/*
 * vip privilege layer
 * */


var VipPrivilegeLayer = LazyLayer.extend({
    init: function () {
        cc.log("VipPrivilegeLayer init");

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

        var menu = cc.Menu.create(closeItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var scrollViewLayer = MarkLayer.create(cc.rect(40, 194, 640, 711));
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        var scrollViewHeight = MAX_VIP_LEVEL * 315;

        for (var i = 1; i <= MAX_VIP_LEVEL; ++i) {
            var y = scrollViewHeight - i * 315;

            var bgSprite = cc.Sprite.create(main_scene_image.icon169);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(cc.p(0, y));
            scrollViewLayer.addChild(bgSprite);


        }

        this._scrollView = cc.ScrollView.create(cc.size(500, 600), scrollViewLayer);
        this._scrollView.setTouchPriority(-300);
        this._scrollView.setPosition(cc.p(110, 260));
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(500, scrollViewHeight));
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());

        return true;
    },

    _onClickClose: function () {
        cc.log("VipPrivilegeLayer _onClickClose");

        var parent = this.getParent();

        var paymentLayer = PaymentLayer.create();
        parent.addChild(paymentLayer, 1);

        this.removeFromParent();


    }
});


VipPrivilegeLayer.create = function () {
    var ret = new VipPrivilegeLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};