/**
 * Created by lujunyu on 14-1-9.
 */

var SHOW_GIFT_BAG = 1;
var BUY_GIFT_BAG = 2;

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
            if (vipBoxGoods[key] != undefined && reward[key] > 0) {
                total++;
            }
        }

        var scrollViewHeight = total * 120;
        if (scrollViewHeight < 480) {
            scrollViewHeight = 480;
        }

        var index = 0;
        var x = 140;
        for (var i = 0; i < len; i++) {
            var key = keys[i];

            if (vipBoxGoods[key] != undefined && reward[key] > 0) {

                var y = scrollViewHeight - index * 110 - 60;
                var goods = vipBoxGoods[key];
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

        var scrollView = cc.ScrollView.create(cc.size(500, 480), scrollViewLayer);
        scrollView.setTouchPriority(-300);
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
                lazyLayer.removeFromParent();
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
                lazyLayer.removeFromParent();
            },
            this
        );
        cancelItem.setPosition(this._giftBagLayerFit.cancelItemPoint);
        cancelItem.setVisible(type == BUY_GIFT_BAG);

        var menu = cc.Menu.create(okItem, buyItem, cancelItem);
        menu.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
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

    MainScene.getInstance().addChild(giftBagLayer, 10);
}
