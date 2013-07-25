/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-20
 * Time: 下午4:21
 * To change this template use File | Settings | File Templates.
 */


/*
 * pass layer
 * */


var PassLayer = cc.Layer.extend({
    _pass: null,

    init: function () {
        cc.log("PassLayer init");

        if (!this._super()) return false;

        this._pass = gameData.pass;

        var bgSprite = cc.Sprite.create(main_scene_image.bg5);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, 200));
        this.addChild(bgSprite);

        var tipLabel = cc.Sprite.create(main_scene_image.bg6);
        tipLabel.setAnchorPoint(cc.p(0, 0));
        tipLabel.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, 868));
        this.addChild(tipLabel);

        var wipeOutItem = cc.MenuItemImage.create(main_scene_image.button9, main_scene_image.button9s, this._onClickWipeOut, this);
        wipeOutItem.setPosition(cc.p(543, 34));
        var wipeOutMenu = cc.Menu.create(wipeOutItem);
        wipeOutMenu.setPosition(cc.p(0, 0));
        tipLabel.addChild(wipeOutMenu);

        var iconSprite = cc.Sprite.create(main_scene_image.icon15);
        iconSprite.setPosition(cc.p(543, 34));
        tipLabel.addChild(iconSprite);

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
                sprite = cc.Sprite.create("res1/test/p.png");
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
                    that._onClickDefiance(index);
                }
            }(this, i));

            item = cc.MenuItemImage.create("res1/green_edit.png", "res1/green_edit.png", cb, this);
            item.setPosition(cc.p(130, 100 * i + 110));

            menu.addChild(item);
        }

        var view = cc.ScrollView.create(cc.size(160, 730), layer);
        view.setContentSize(cc.size(300, 10050));
        view.setPosition(cc.p(280, 200));
        view.setBounceable(false);
        view.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        view.updateInset();

        this.addChild(view);

        return true;
    },

    _onClickWipeOut: function () {
        cc.log("PassLayer _onClickWipeOut");

        this._pass.wipeOut(function (data) {
            cc.log(data);
        });
    },

    _onClickDefiance: function (index) {
        cc.log("PassLayer _onClickDefiance");
        cc.log(index);

        this._pass.defiance(function (data, id) {
            cc.log(data);

            var scene = BattleScene.create(BattleLogNote.getInstance().getBattleByBattleLogId(id));

            cc.Director.getInstance().replaceScene(cc.TransitionPageTurn.create(1, scene, true));
        }, index);
    }
})

PassLayer.create = function () {
    var ret = new PassLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}