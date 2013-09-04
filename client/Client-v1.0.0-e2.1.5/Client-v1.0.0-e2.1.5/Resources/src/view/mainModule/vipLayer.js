/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-4
 * Time: 上午10:00
 * To change this template use File | Settings | File Templates.
 */


/*
 * vip layer
 * */


var VipLayer = cc.Layer.extend({
    _goldLabel: null,
    _moneyLabel: null,


    onEnter: function () {
        cc.log("VipLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("VipLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        var headLabel = cc.Sprite.create(main_scene_image.icon147);
        headLabel.setAnchorPoint(cc.p(0, 0));
        headLabel.setPosition(cc.p(40, 905));
        this.addChild(headLabel);

        var goldIcon = cc.Sprite.create(main_scene_image.icon148);
        goldIcon.setPosition(cc.p(270, 934));
        this.addChild(goldIcon);

        var moneyIcon = cc.Sprite.create(main_scene_image.icon149);
        moneyIcon.setPosition(cc.p(410, 934));
        this.addChild(moneyIcon);

        this._goldLabel = cc.LabelTTF.create(0, "黑体", 20);
        this._goldLabel.setAnchorPoint(cc.p(0, 0.5));
        this._goldLabel.setPosition(cc.p(288, 932));
        this.addChild(this._goldLabel);

        this._moneyLabel = cc.LabelTTF.create(0, "黑体", 20);
        this._moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        this._moneyLabel.setPosition(cc.p(430, 932));
        this.addChild(this._moneyLabel);

        var paymentItem = cc.MenuItemImage.create(
            main_scene_image.button38,
            main_scene_image.button38s,
            this._onClickPayment,
            this
        );
        paymentItem.setPosition(cc.p(600, 934));

        var menu = cc.Menu.create(paymentItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var paymentIcon = cc.Sprite.create(main_scene_image.icon159);
        paymentIcon.setPosition(cc.p(600, 934));
        this.addChild(paymentIcon);

        return true;
    },

    update: function () {
        cc.log("VipLayer update");

        var player = gameData.player;

        this._goldLabel.setString(player.get("gold"));
        this._moneyLabel.setString(player.get("money"));

        if (this._scrollView != null) {
            this._scrollView.removeFromParent();
        }

        var scrollViewLayer = MarkLayer.create(cc.rect(40, 194, 640, 711));
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        var scrollViewHeight = MAX_VIP_LEVEL * 176 + 20;

        for (var i = 1; i <= MAX_VIP_LEVEL; ++i) {
            var y = scrollViewHeight - i * 176;

            var bgSprite = cc.Sprite.create(main_scene_image.icon162);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(cc.p(20, y));
            scrollViewLayer.addChild(bgSprite);


        }

        this._scrollView = cc.ScrollView.create(cc.size(640, 711), scrollViewLayer);
        this._scrollView.setPosition(GAME_BG_POINT);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());
    },

    _onClickPayment: function () {
        cc.log("VipLayer _onClickPayment");

        var paymentLayer = PaymentLayer.create();
        this.addChild(paymentLayer, 1);
    },

    _onClickBugVipBox: function (index) {
        return function () {
            cc.log("VipLayer _onClickByVipBox: " + index);


        }
    }
});


VipLayer.create = function () {
    var ret = new VipLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};