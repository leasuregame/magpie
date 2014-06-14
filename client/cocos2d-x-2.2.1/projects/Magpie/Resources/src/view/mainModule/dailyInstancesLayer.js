/**
 * Created by lujunyu on 14-6-14.
 */

var DailyInstancesLayer = cc.Layer.extend({
    _dailyInstancesLayerFit: null,

    _layers: [
        {
            titleIcon: "icon468",
            layer: ExpInstanceLayer,
            nameString: "expInstanceLayer"
        }
    ],

    init: function () {
        cc.log("DailyInstancesLayer init");

        if (!this._super()) return false;

        this._dailyInstancesLayerFit = gameFit.mainScene.dailyInstancesLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._dailyInstancesLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var scrollViewLayer = MarkLayer.create(this._dailyInstancesLayerFit.scrollViewLayerRect);
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        var index = 0;
        var len = this._layers.length;
        var scrollViewHeight = len * 200;

        for (var i = 0; i < len; i++) {
            var layer = this._layers[i];
            var y = scrollViewHeight - 200 * index - 200;

            var item = cc.MenuItemImage.create(
                main_scene_image[layer.titleIcon],
                null,
                this._onClickLayer(i),
                this
            );

            item.setAnchorPoint(cc.p(0.5, 0));
            item.setPosition(cc.p(320, y));
            menu.addChild(item);

            index++;
        }

        var scrollView = cc.ScrollView.create(this._dailyInstancesLayerFit.scrollViewSize, scrollViewLayer);
        scrollView.setPosition(this._dailyInstancesLayerFit.scrollViewPoint);
        scrollView.setBounceable(false);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView, 10);

        scrollView.setContentSize(cc.size(640, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());

        return true;
    },

    _onClickLayer: function (index) {
        return function () {
            cc.log("DailyInstancesLayer _onClickLayer: " + index);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            MainScene.getInstance().switchTo(this._layers[index].layer.create());
        }
    }

});

DailyInstancesLayer.create = function () {
    cc.log("DailyInstancesLayer create");

    var ret = new DailyInstancesLayer();
    if (ret && ret.init()) {
        return ret;
    }
    return null;

};