/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-20
 * Time: 下午4:21
 * To change this template use File | Settings | File Templates.
 */


var PassLayer = cc.Layer.extend({
    init: function () {
        cc.log("PassLayer init");

        if (!this._super()) return false;

        var wipeOutItem = cc.MenuItemFont.create("扫荡", this._onClickWipeOut, this);
        wipeOutItem.setPosition(cc.p(250, 400));
        var wipeOutMenu = cc.Menu.create(wipeOutItem);
        this.addChild(wipeOutMenu);

        var layer = cc.Layer.create();
        layer.setAnchorPoint(cc.p(0, 0));

        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        layer.addChild(menu);

        var item = null;
        var label = null;
        var sprite = null;

        for (var i = 0; i < 100; ++i) {
            if (i > 0) {
                sprite = cc.Sprite.create("res/test/p.png");
                sprite.setScale(0.15);
                sprite.setRotation(90);
                sprite.setPosition(cc.p(130, 100 * i + 60));
                layer.addChild(sprite);
            }

            label = cc.LabelTTF.create("第" + (i + 1) + "关：", "Marker Felt", 25);
            label.setAnchorPoint(cc.p(0, 0));
            label.setPosition(cc.p(0, 100 * (i + 1)));
            layer.addChild(label);

            var cb = (function (that, index) {
                return function () {
                    that._onClickBarriers(index);
                }
            }(this, i));

            item = cc.MenuItemImage.create("res/green_edit.png", "res/green_edit.png", cb, this);
            item.setPosition(cc.p(130, 100 * i + 110));

            menu.addChild(item);
        }

        var view = cc.ScrollView.create(cc.size(300, 840), layer);
        view.setContentSize(cc.size(300, 10050));
        view.setPosition(cc.p(300, 150));
        view.setBounceable(false);
        view.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        view.updateInset();

        this.addChild(view);

        return true;
    },

    _onClickWipeOut: function () {
        cc.log("PassLayer _onClickWipeOut");

//        lzWindow.pomelo.request("logic.taskHandler.wipeOut", {playerId: 1}, function (data) {
//            cc.log(data);
//
//            if (data.code == 200) {
//                cc.log('wipeOut success.');
//            } else {
//                cc.log('wipeOut faild.');
//            }
//        });
    },

    _onClickBarriers: function (index) {
        cc.log("PassLayer _onClickBarriers");
        cc.log(index);

        var that = this;
        lzWindow.pomelo.request("logic.taskHandler.passBarrier", {playerId: 1, index: index}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log('barriers success.');
                var battleLog = BattleLog.create(data.msg);
                BattleLogNote.getInstance().pushBattleLog(battleLog);
                cc.Director.getInstance().replaceScene(cc.TransitionPageTurn.create(1, BattleScene.create(battleLog), true));
            } else {
                cc.log('barriers faild.');
                cc.log("关卡挑战失败!");
            }
        });
    }
})

PassLayer.create = function () {
    var ret = new PassLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}