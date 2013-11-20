/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-11-21
 * Time: 上午3:46
 * To change this template use File | Settings | File Templates.
 */

var SelectAreaLayer = LazyLayer.extend({

    _areaList: null,

    onEnter: function () {
        cc.log("SelectAreaLayer onEnter");

        this._super();

        lz.dc.beginLogPageView("选区界面");
    },

    onExit: function () {
        cc.log("SelectAreaLayer onExit");

        this._super();

        lz.dc.endLogPageView("选区界面");
    },

    init: function (areaList) {

        cc.log("SelectAreaLayer init");

        if (!this._super()) return false;

        this._areaList = areaList;

        var selectAreaEffect = cc.BuilderReader.load(main_scene_image.uiEffect38, this);
        selectAreaEffect.setPosition(cc.p(320, 568));
        this.addChild(selectAreaEffect, 1);

        //var scrollViewLayer = cc.Layer.create();
        var scrollViewLayer = MarkLayer.create(cc.rect(-320, -300, 640, 400));
        var len = this._areaList.length;

        var scrollViewHeight = len * 70 + 10;
        if (scrollViewHeight < 400) {
            scrollViewHeight = 400;
        }
        var menu = cc.Menu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        var scrollView = cc.ScrollView.create(cc.size(640, 400), scrollViewLayer);
        scrollView.setPosition(cc.p(-320, -300));
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        selectAreaEffect.controller.areaList.addChild(scrollView, 1);

        for (var i = 0; i < len; ++i) {

            var areaItem = cc.MenuItemImage.create(
                main_scene_image.up95,
                main_scene_image.up95,
                this._onClickArea(i),
                this
            );

            areaItem.setPosition(cc.p(320, scrollViewHeight - i * 70 - 70));

            var area = this._areaList[i];

            var areaLabel = StrokeLabel.create(area.desc, "STHeitiTC-Medium", 35);
            areaLabel.setColor(area.color);
            areaLabel.setPosition(cc.p(180, scrollViewHeight - i * 70 - 90));
            scrollView.addChild(areaLabel);

            menu.addChild(areaItem);
        }

        scrollView.setContentSize(cc.size(640, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());

        return true;
    },


    _onClickArea: function (id) {
        return function () {
            cc.log("SelectAreaLayer _onClickArea: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var area = lz.server.get("areaList")[id];
            var user = gameData.user;

            if (!area.canLogin) {
                cc.log("服务器正在维护");

                TipLayer.tip("服务器正在维护");

                return;
            }

            user.set("area", area.id);
            var parent = this.getParent();
            parent.updateSelectAreaName(id);
            this.removeFromParent();
        }
    }
});


SelectAreaLayer.create = function (areaList) {
    var ret = new SelectAreaLayer();

    if (ret && ret.init(areaList)) {
        return ret;
    }

    return null;
};