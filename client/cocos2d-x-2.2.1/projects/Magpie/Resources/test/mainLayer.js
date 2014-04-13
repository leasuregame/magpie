/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午11:19
 * To change this template use File | Settings | File Templates.
 */


/*
 * main layer
 * */


var MainLayer = cc.Layer.extend({
    _effectNode: null,
    _urlEditBox: null,

    init: function () {
        cc.log("MainLayer init");

        if (!this._super()) return false;

        cc.BuilderReader.setResourcePath("../");

        this._urlEditBox = cc.EditBox.create(cc.size(200, 40), cc.Scale9Sprite.create(main_scene_image.edit2));
        this._urlEditBox.setPosition(cc.p(150, 1100));
        this._urlEditBox.setDelegate(this);
        this._urlEditBox.setFontColor(cc.c3b(200, 0, 250));
        this.addChild(this._urlEditBox, 10);

        this._speedEditBox = cc.EditBox.create(cc.size(200, 40), cc.Scale9Sprite.create(main_scene_image.edit2));
        this._speedEditBox.setPosition(cc.p(370, 1100));
        this._speedEditBox.setDelegate(this);
        this._speedEditBox.setFontColor(cc.c3b(200, 0, 250));
        this.addChild(this._speedEditBox, 10);
        this._speedEditBox.setText("1.3");

        var okItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            this._onClickTest,
            this
        );
        okItem.setPosition(cc.p(600, 1100));

        this._menu = cc.Menu.create(okItem);
        this._menu.setPosition(cc.p(0, 0));
        this.addChild(this._menu, 10);

        return true;
    },

    _clearEffect: function () {
        cc.log("清除特效");

        if (this._effectNode) {
            this._effectNode.removeFromParent();
            this._effectNode = null;
        }
    },

    _changeEffect: function () {
        this._clearEffect();

        var url = this._urlEditBox.getText();
        var speed = parseFloat(this._speedEditBox.getText()) || 1;

        cc.Director.getInstance().getScheduler().setTimeScale(speed);

        if (main_scene_image[url]) {
            cc.log("加入特效");

            var node = cc.BuilderReader.load(main_scene_image[url], this);

            cc.log(node);
            cc.log(this);

            if (node != null) {
                node.setPosition(cc.p(360, 568));
                this.addChild(node);

//                node.animationManager.setCompletedAnimationCallback(this, this._clearEffect);

                this._effectNode = node;
            }
        } else {
            cc.log("特效" + url + "找不到,可能配置出错");
        }
    },

    _onClickTest: function () {
        this._changeEffect();
    },

    callback: function () {
        cc.log("回调成功");
    }
});


MainLayer.create = function () {
    var ret = new MainLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};