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

        var index = 0;
        var len = this._layers.length;
        var scrollViewHeight = len * 200;

        var slideLabel = [];

        for (var i = 0; i < len; i++) {
            var layer = this._layers[i];
            var y = scrollViewHeight - 200 * index - 200;

            slideLabel[index] = cc.Node.create();
            slideLabel[index].setPosition(cc.p(0, 0));

            if (!DailyInstances.IsShowHandler[layer.nameString]()) {
                continue;
            }

            var item = cc.MenuItemImage.create(
                main_scene_image[layer.titleIcon],
                null,
                this._onClickLayer(i),
                this
            );

            item.setAnchorPoint(cc.p(0.5, 0));
            item.setPosition(cc.p(320, y));

            var menu = LazyMenu.create(item);
            menu.setPosition(cc.p(0, 0));
            slideLabel[index].addChild(menu);

            scrollViewLayer.addChild(slideLabel[index]);

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

        var slideLayer = SlideLayer.create({
            labels: slideLabel
        });

        slideLayer.showSlide();

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

DailyInstancesLayer.canEnter = function () {
    var limitLv = outputTables.exp_pass_config.rows[1].limit_lv;
    var lv = gameData.player.get("lv");

    if (lv >= limitLv) {
        return true;
    }

    TipLayer.tip("搜仙" + limitLv + "级开放");

    return false;
};