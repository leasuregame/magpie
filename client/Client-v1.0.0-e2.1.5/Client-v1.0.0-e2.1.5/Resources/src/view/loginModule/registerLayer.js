/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-5
 * Time: 下午3:23
 * To change this template use File | Settings | File Templates.
 */


/*
 * register layer
 * */


var RegisterLayer = cc.Layer.extend({
    _registerLayerFit: null,

    _accountEditBox: null,
    _passwordEditBox: null,
    _passwordAgainEditBox: null,

    onEnter: function () {
        cc.log("RegisterLayer onEnter");

        this._super();

        lz.dc.beginLogPageView("注册界面");
    },

    onExit: function () {
        cc.log("RegisterLayer onExit");

        this._super();

        lz.dc.endLogPageView("注册界面");
    },

    init: function () {
        cc.log("RegisterLayer init");

        if (!this._super()) return false;

        this._registerLayerFit = gameFit.loginScene.registerLayer;

        var registerFrame = cc.BuilderReader.load(main_scene_image.uiEffect39, this);
        registerFrame.setPosition(this._registerLayerFit.registerFramePoint);
        this.addChild(registerFrame);

        var controller = registerFrame.controller;

        this._accountEditBox = cc.EditBox.create(cc.size(380, 60), cc.Scale9Sprite.create(main_scene_image.edit));
        this._accountEditBox.setPosition(cc.p(60, 0));
        this._accountEditBox.setInputMode(cc.EDITBOX_INPUT_MODE_EMAILADDR);
        this._accountEditBox.setDelegate(this);
        this._accountEditBox.setFont("American Typewriter", 35);
        this._accountEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._accountEditBox.setMaxLength(18);
        controller.accountLabel.addChild(this._accountEditBox, 1);

        this._passwordEditBox = cc.EditBox.create(cc.size(380, 60), cc.Scale9Sprite.create(main_scene_image.edit));
        this._passwordEditBox.setPosition(cc.p(60, 0));
        this._passwordEditBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._passwordEditBox.setDelegate(this);
        this._passwordEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._passwordEditBox.setMaxLength(18);
        controller.passwordLabel.addChild(this._passwordEditBox, 1);

        this._passwordAgainEditBox = cc.EditBox.create(cc.size(380, 60), cc.Scale9Sprite.create(main_scene_image.edit));
        this._passwordAgainEditBox.setPosition(cc.p(60, 0));
        this._passwordAgainEditBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._passwordAgainEditBox.setDelegate(this);
        this._passwordAgainEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._passwordAgainEditBox.setMaxLength(18);
        controller.passwordAgainLabel.addChild(this._passwordAgainEditBox, 1);


        return true;
    },

    canRegister: function (account, password, passwordAgain) {
        cc.log("User canRegister");

        if (!account) {
            TipLayer.tip("请输入账号");
            return false;
        }

        if (!password) {
            TipLayer.tip("请输入密码");
            return false;
        }

        if (!passwordAgain) {
            TipLayer.tip("请再次输入密码");
            return false;
        }

        if (password != passwordAgain) {
            TipLayer.tip("两次密码输入不一致");
            return false;
        }

        return true;
    },

    _onClickRegister: function () {
        cc.log("RegisterLayer _onClickRegister");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var user = gameData.user;

        var account = this._accountEditBox.getText();
        var password = this._passwordEditBox.getText();
        var passwordAgain = this._passwordAgainEditBox.getText();

        if (!this.canRegister(account, password, passwordAgain)) {
            return;
        }

        var that = this;
        user.register(function (data) {
            cc.log(data);

            that.getParent().updateEditBox();
            that.removeFromParent();
        }, account, password);
    },

    _onClickBack: function () {
        cc.log("RegisterLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        this.getParent().updateEditBox();
        this.removeFromParent();
    }
});


RegisterLayer.create = function () {
    var ret = new RegisterLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};