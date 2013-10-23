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

        cc.BuilderReader.setResourcePath("../res/");

        this._urlEditBox = cc.EditBox.create(cc.size(380, 60), cc.Scale9Sprite.create(main_scene_image.edit2));
        this._urlEditBox.setPosition(cc.p(200, 1100));
        this._urlEditBox.setDelegate(this);
        this._urlEditBox.setFont("STHeitiTC-Medium", 25);
        this._urlEditBox.setFontColor(cc.c3b(200, 0, 250));
        this.addChild(this._urlEditBox);

        var okItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            this._onClickTest,
            this
        );
        okItem.setPosition(cc.p(480, 1100));

        this._menu = cc.Menu.create(okItem);
        this._menu.setPosition(cc.p(0, 0));
        this.addChild(this._menu);

        return true;
    },

    _changeEffect: function () {
        if (this._effectNode) {
            this._effectNode.removeFromParent();
            this._effectNode = null;
        }

        var url = this._urlEditBox.getText();

        cc.log(url);

        if (main_scene_image[url]) {
            var node = cc.BuilderReader.load(main_scene_image[url], this);

            cc.log(node);

            if (node != null) {
                node.setPosition(cc.p(360, 500));
                this.addChild(node);

                this._effectNode = node;
            }
        } else {
            cc.log("no find");
        }
    },

    _onClickTest: function () {
        this._changeEffect();
    }
});


MainLayer.create = function () {
    var ret = new MainLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};