/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-11-21
 * Time: 上午3:46
 * To change this template use File | Settings | File Templates.
 */


/*
 * select area layer
 * */


var SelectAreaLayer = cc.Layer.extend({
    _selectAreaLayerFit: null,

    _areaList: null,

    onEnter: function () {
        cc.log("SelectAreaLayer onEnter");

        this._super();

        lz.um.beginLogPageView("选区界面");
    },

    onExit: function () {
        cc.log("SelectAreaLayer onExit");

        this._super();

        lz.um.endLogPageView("选区界面");
    },

    init: function (areaList) {

        cc.log("SelectAreaLayer init");

        if (!this._super()) return false;

        this._selectAreaLayerFit = gameFit.loginScene.selectAreaLayer;

        this._areaList = areaList;

        var selectAreaFrame = cc.BuilderReader.load(main_scene_image.uiEffect38, this);
        selectAreaFrame.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(selectAreaFrame, 1);

        var scrollViewLayer = MarkLayer.create(cc.rect(-40, 0, 640, 580));
        var len = this._areaList.length;

        var scrollViewHeight = len * 70 + 10;
        if (scrollViewHeight < 580) {
            scrollViewHeight = 580;
        }

        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        var scrollView = cc.ScrollView.create(cc.size(640, 580), scrollViewLayer);
        scrollView.setPosition(cc.p(-320, -320));
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        selectAreaFrame.controller.ccbAreaList.addChild(scrollView, 1);

        for (var i = len - 1; i >= 0; --i) {
            var y = scrollViewHeight - (len - 1 - i) * 63 - 31;

            var areaItem = cc.MenuItemImage.create(
                main_scene_image.button85,
                main_scene_image.button85s,
                this._onClickArea(i),
                this
            );

            areaItem.setPosition(cc.p(320, y));

            var area = this._areaList[i];

            var areaLabel = cc.LabelTTF.create(area.desc, "STHeitiTC-Medium", 32);
            areaLabel.setColor(area.color);
            areaLabel.setPosition(cc.p(140, 30));
            areaItem.addChild(areaLabel);

            var statusLabel =  cc.LabelTTF.create(area.statusName, "STHeitiTC-Medium", 32);
            statusLabel.setColor(area.color);
            statusLabel.setPosition(cc.p(440, 30));
            areaItem.addChild(statusLabel);

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