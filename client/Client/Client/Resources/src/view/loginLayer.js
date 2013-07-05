/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午10:47
 * To change this template use File | Settings | File Templates.
 */


/*
 * login layer
 * */

var LoginLayer = cc.Layer.extend({
    init: function () {
        cc.log("LoginLayer init");

        if (!this._super()) return false;


        this._box4 = cc.EditBox.create(cc.size(180, 40), cc.Scale9Sprite.create("res/extensions/yellow_edit.png"));
        this._box4.setPlaceholderFontColor(cc.c3b(255, 0, 0));
        this._box4.setPlaceHolder("Tooltip:");
        this._box4.setPosition(cc.p(220, 140));
        this._box4.setDelegate(this);
        this._box4.setFontColor(cc.c3b(5, 4, 10));
        this._box4.setMaxLength(10);
        this.addChild(this._box4);

        this._box2 = cc.EditBox.create(cc.size(130, 40), cc.Scale9Sprite.create("res/extensions/green_edit.png"));
        this._box2.setText("EditBox Sample");
        this._box2.setPosition(cc.p(220, 190));
        this._box2.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._box2.setFontColor(cc.c3b(255, 250, 0));
        this._box2.setDelegate(this);
        this.addChild(this._box2);

        return true;
    }
})

LoginLayer.create = function () {
    var ret = new LoginLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}