/**
 * Created by lcc3536 on 14-1-9.
 */


/*
 * reward layer
 * */


var RewardLayer = LazyLayer.extend({
    init: function (data) {
        cc.log("RewardLayer init");

        if (!this._super()) return false;

        var keys = Object.keys(data);
        var len = keys.length;

        var scrollViewLayer = MarkLayer.create(this._level9BoxLayerFit.scrollViewLayerRect2);

        var scrollViewHeight = len * 120;
        if (scrollViewHeight < 480) {
            scrollViewHeight = 480;
        }

        var x = 140;
        for (var i = 0; i < len; i++) {
            var key = keys[i];

            if (rewardGoodsUrl[key] != undefined && data[key] > 0) {

                var y = scrollViewHeight - i * 120 - 60;
                var goodName = lz.getNameByKey(key);
                var goodIcon = rewardGoodsUrl[key];

                var goodsSprite = cc.Sprite.create(main_scene_image[goodIcon]);
                goodsSprite.setPosition(cc.p(x - 10, y));
                scrollViewLayer.addChild(goodsSprite);

                var nameLabel = StrokeLabel.create(goodName.name, "STHeitiTC-Medium", 25);
                nameLabel.setColor(cc.c3b(255, 252, 175));
                nameLabel.setAnchorPoint(cc.p(0, 0.5));
                nameLabel.setPosition(cc.p(x + 50, y + 20));
                scrollViewLayer.addChild(nameLabel);

                var countBgIcon = cc.Sprite.create(main_scene_image.icon334);
                countBgIcon.setPosition(cc.p(x + 170, y - 20));
                scrollViewLayer.addChild(countBgIcon);

                var countLabel = StrokeLabel.create("数量    " + data[key], "STHeitiTC-Medium", 25);
                countLabel.setAnchorPoint(cc.p(0, 0.5));
                countLabel.setPosition(cc.p(x + 50, y - 20));
                scrollViewLayer.addChild(countLabel);
            }
        }

        var scrollView = cc.ScrollView.create(cc.size(500, 480), scrollViewLayer);
        scrollView.setTouchPriority(-300);
        scrollView.setPosition(this._level9BoxLayerFit.scrollViewPoint2);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this._tipLabel.addChild(scrollView);

        scrollView.setContentSize(cc.size(500, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());
        this._tipLabel.setVisible(false);

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickOk,
            this
        );
        okItem.setPosition(this._level9BoxLayerFit.okItemPoint);

        var menu = cc.Menu.create(okItem);
        menu.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
        menu.setPosition(cc.p(0, 0));
        this._tipLabel.addChild(menu);

        return true;
    }
});


RewardLayer.create = function (data) {
    var ret = new RewardLayer();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
};

RewardLayer.pop = function (data) {
    var rewardLayer = RewardLayer.create(data);

    MainScene.getInstance().addChild(rewardLayer, 10);
};
