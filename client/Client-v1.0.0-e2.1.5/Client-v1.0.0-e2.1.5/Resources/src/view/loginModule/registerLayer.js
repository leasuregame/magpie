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
    _accountEditBox: null,
    _passwordEditBox: null,
    _passwordAgainEditBox: null,

    init: function () {
        cc.log("RegisterLayer init");

        if (!this._super()) return false;

        var accountLabel = cc.LabelTTF.create("账号(必填):", "STHeitiTC-Medium", 30);
        accountLabel.setPosition(cc.p(150, 700));
        this.addChild(accountLabel);

        var passwordLabel = cc.LabelTTF.create("密码(必填):", "STHeitiTC-Medium", 30);
        passwordLabel.setPosition(cc.p(150, 600));
        this.addChild(passwordLabel);

        var passwordAgainLabel = cc.LabelTTF.create("重复密码:", "STHeitiTC-Medium", 30);
        passwordAgainLabel.setPosition(cc.p(150, 500));
        this.addChild(passwordAgainLabel);

        this._accountEditBox = cc.EditBox.create(cc.size(380, 60), cc.Scale9Sprite.create(main_scene_image.edit2));
        this._accountEditBox.setPosition(cc.p(420, 700));
        this._accountEditBox.setInputMode(cc.EDITBOX_INPUT_MODE_EMAILADDR);
        this._accountEditBox.setDelegate(this);
        this._accountEditBox.setFont("American Typewriter", 25);
        this._accountEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._accountEditBox.setMaxLength(18);
        this.addChild(this._accountEditBox);

        this._passwordEditBox = cc.EditBox.create(cc.size(380, 60), cc.Scale9Sprite.create(main_scene_image.edit1));
        this._passwordEditBox.setPosition(cc.p(420, 600));
        this._passwordEditBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._passwordEditBox.setDelegate(this);
        this._passwordEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._passwordEditBox.setMaxLength(18);
        this.addChild(this._passwordEditBox);

        this._passwordAgainEditBox = cc.EditBox.create(cc.size(380, 60), cc.Scale9Sprite.create(main_scene_image.edit1));
        this._passwordAgainEditBox.setPosition(cc.p(420, 500));
        this._passwordAgainEditBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._passwordAgainEditBox.setDelegate(this);
        this._passwordAgainEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._passwordAgainEditBox.setMaxLength(18);
        this.addChild(this._passwordAgainEditBox);

        var registerAndLoginButton = cc.MenuItemFont.create("注册", this._onClickRegister, this);
        registerAndLoginButton.setPosition(260, 250);

        var backButton = cc.MenuItemFont.create("返回", this._onClickBack, this);
        backButton.setPosition(460, 250);

        var menu = cc.Menu.create(registerAndLoginButton, backButton);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

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

            that.getParent().switchLayer(LoginLayer);
        }, account, password);
    },

    _onClickBack: function () {
        cc.log("RegisterLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.getParent().switchLayer(LoginLayer);
    }
});


RegisterLayer.create = function () {
    var ret = new RegisterLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};