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
    _loginLayerFit: null,

    _accountEditBox: null,
    _passwordEditBox: null,

    init: function () {
        cc.log("LoginLayer init");

        if (!this._super()) return false;

        lz.server.connectGateServer();
        user = gameData.user;

        this._loginLayerFit = gameFit.loginScene.loginLayer;

        var accountLabel = cc.LabelTTF.create("账号:", "STHeitiTC-Medium", 30);
        accountLabel.setPosition(this._loginLayerFit.accountLabelPoint);
        this.addChild(accountLabel);

        var passwordLabel = cc.LabelTTF.create("密码:", "STHeitiTC-Medium", 30);
        passwordLabel.setPosition(this._loginLayerFit.passwordLabelPoint);
        this.addChild(passwordLabel);

        this._accountEditBox = cc.EditBox.create(cc.size(380, 60), cc.Scale9Sprite.create(main_scene_image.edit2));
        this._accountEditBox.setPosition(this._loginLayerFit.accountEditBoxPoint);
        this._accountEditBox.setDelegate(this);
        this._accountEditBox.setFont("STHeitiTC-Medium", 25);
        this._accountEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._accountEditBox.setMaxLength(18);
        this.addChild(this._accountEditBox);

        this._passwordEditBox = cc.EditBox.create(cc.size(380, 60), cc.Scale9Sprite.create(main_scene_image.edit1));
        this._passwordEditBox.setPosition(this._loginLayerFit.passwordEditBoxPoint);
        this._passwordEditBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._passwordEditBox.setDelegate(this);
        this._passwordEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._passwordEditBox.setMaxLength(18);
        this.addChild(this._passwordEditBox);

        this._accountEditBox.setText(user.get("account"));
        this._passwordEditBox.setText(user.get("password"));

        this.loginButton = cc.MenuItemFont.create("登录", this._onClickLogin, this);
        this.loginButton.setFontSize(45);
        this.loginButton.setPosition(this._loginLayerFit.loginButtonPoint);
        this.loginButton.setEnabled(false);

        var registerButton = cc.MenuItemFont.create("注册", this._onClickRegister, this);
        registerButton.setFontSize(45);
        registerButton.setPosition(this._loginLayerFit.registerButtonPoint);

        this.menu = cc.Menu.create(this.loginButton, registerButton);
        this.menu.setPosition(cc.p(0, 0));
        this.addChild(this.menu);

        this.schedule(this._changeLoginEnabled, 0.5);

        return true
    },

    _changeLoginEnabled: function () {
        if (lz.server.isConnect()) {
            this.unschedule(this._changeLoginEnabled);
            this.loginButton.setEnabled(true);
        }
    },

    _onClickLogin: function () {
        cc.log("LoginLayer _onClickLogin");

        this.loginButton.setEnabled(false);

        cc.log(this._accountEditBox.getText());
        cc.log(this._passwordEditBox.getText());

        var user = gameData.user;

        user.set("account", this._accountEditBox.getText());
        user.set("password", this._passwordEditBox.getText());

        var that = this;
        user.login(function (success) {
            cc.log(success);

            if (success) {
                cc.Director.getInstance().replaceScene(MainScene.getInstance());
            } else {
                that.loginButton.setEnabled(true);
            }

//            cc.Director.getInstance().replaceScene(cc.TransitionPageTurn.create(1, MainScene.getInstance(), true));
        });
    },

    _onClickRegister: function () {
        cc.log("LoginLayer _onClickRegister");

//        cc.Director.getInstance().replaceScene(RegisterScene.create());
//        cc.Director.getInstance().replaceScene(cc.TransitionPageTurn.create(1, RegisterScene.create(), true));
        cc.Director.getInstance().replaceScene(MainScene.getInstance());
    }
});

LoginLayer.create = function () {
    var ret = new LoginLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};