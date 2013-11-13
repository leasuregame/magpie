/**
 * Created by lcc3536 on 13-11-11.
 */


/*
 * new player layer
 * */


var NewPlayerLayer = cc.Layer.extend({
    init: function () {
        cc.log("NewPlayerLayer init");

        if (!this._super()) return false;

        var nameLabel = cc.LabelTTF.create("角色名:", "STHeitiTC-Medium", 30);
        nameLabel.setPosition(cc.p(130, 500));
        this.addChild(nameLabel);

        this._nameEditBox = cc.EditBox.create(cc.size(380, 60), cc.Scale9Sprite.create(main_scene_image.edit3));
        this._nameEditBox.setPosition(cc.p(380, 500));
        this._nameEditBox.setDelegate(this);
        this._nameEditBox.setFont("STHeitiTC-Medium", 25);
        this._nameEditBox.setMaxLength(6);
        this.addChild(this._nameEditBox);

        var backItem = cc.MenuItemFont.create("返回", this._onClickBack, this);
        backItem.setFontSize(45);
        backItem.setPosition(cc.p(80, 1050));

        var registerItem = cc.MenuItemFont.create("创建", this._onClickOk, this);
        registerItem.setFontSize(45);
        registerItem.setPosition(cc.p(320, 250));

        var menu = cc.Menu.create(backItem, registerItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    _onClickOk: function () {
        cc.log("NewPlayerLayer _onClickOk");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var name = this._nameEditBox.getText();

        gameData.user.createPlayer(function () {
            cc.Director.getInstance().replaceScene(MainScene.getInstance());
        }, name);
    },

    _onClickBack: function () {
        cc.log("NewPlayerLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.getParent().switchLayer(LoginLayer);
    }
});


NewPlayerLayer.create = function () {
    var ret = new NewPlayerLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};