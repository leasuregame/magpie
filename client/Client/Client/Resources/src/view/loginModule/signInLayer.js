/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午10:47
 * To change this template use File | Settings | File Templates.
 */


/*
 * sign in layer
 * */


var SignInLayer = cc.Layer.extend({
    _accountEditBox: null,
    _passwordEditBox: null,

    init: function () {
        cc.log("LoginLayer init");

        if (!this._super()) return false;

        var accountLabel = cc.LabelTTF.create("账号:", "Marker Felt", 30);
        accountLabel.setPosition(cc.p(150, 500));
        this.addChild(accountLabel);

        var passwordLabel = cc.LabelTTF.create("密码:", "Marker Felt", 30);
        passwordLabel.setPosition(cc.p(150, 400));
        this.addChild(passwordLabel);

        this._accountEditBox = cc.EditBox.create(cc.size(380, 60), cc.Scale9Sprite.create("res1/yellow_edit.png"));
        this._accountEditBox.setPosition(cc.p(380, 500));
        this._accountEditBox.setDelegate(this);
        this._accountEditBox.setFont("American Typewriter", 25);
        this._accountEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._accountEditBox.setMaxLength(18);
        this.addChild(this._accountEditBox);

        this._passwordEditBox = cc.EditBox.create(cc.size(380, 60), cc.Scale9Sprite.create("res1/green_edit.png"));
        this._passwordEditBox.setPosition(cc.p(380, 400));
        this._passwordEditBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._passwordEditBox.setDelegate(this);
        this._passwordEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._passwordEditBox.setMaxLength(18);
        this.addChild(this._passwordEditBox);

        this._accountEditBox.setText("1");
        this._passwordEditBox.setText("1");

        this.signInButton = cc.MenuItemFont.create("登录", this._onClickSignIn, this);
        this.signInButton.setFontSize(45);
        this.signInButton.setPosition(260, 250);
        this.signInButton.setEnabled(false);
//        this.addChild(signInButton);

        var signUpButton = cc.MenuItemFont.create("直接进入", this._onClickSignUp, this);
        signUpButton.setFontSize(45);
        signUpButton.setPosition(460, 250);
//        this.addChild(signUpButton);

        this.menu = cc.Menu.create(this.signInButton, signUpButton);
        this.menu.setPosition(cc.p(0, 0));
        this.addChild(this.menu);

        this.schedule(function() {
            this.signInButton.setEnabled(connectSuccess);
        }, 0.5)

        return true;
    },

    _getButtonWithTitle: function (title) {
        /** Creates and return a button with a default background and title color. */
        var backgroundButton = cc.Scale9Sprite.create("res1/button.png");
        var backgroundHighlightedButton = cc.Scale9Sprite.create("res1/buttonHighlighted.png");

        var titleButton = cc.LabelTTF.create(title, "Marker Felt", 30);

        titleButton.setColor(cc.c3b(159, 168, 176));

        var button = cc.ControlButton.create(titleButton, backgroundButton);
//        button.setBackgroundSpriteForState(backgroundHighlightedButton, cc.CONTROL_STATE_HIGHLIGHTED);
//        button.setTitleColorForState(cc.WHITE, cc.CONTROL_STATE_HIGHLIGHTED);

        return button;
    },

    _onClickSignIn: function () {
        cc.log("LoginLayer _onClickSignIn");

        this.signInButton.setEnabled(false);

        cc.log(this._accountEditBox.getText());
        cc.log(this._passwordEditBox.getText());

        var user = gameData.user;

        user.set("account", this._accountEditBox.getText());
        user.set("password", this._passwordEditBox.getText());

        user.signIn(function(msg) {
            cc.log(msg);
            cc.Director.getInstance().replaceScene(MainScene.getInstance());
//            cc.Director.getInstance().replaceScene(cc.TransitionPageTurn.create(1, MainScene.getInstance(), true));
        });
    },

    _onClickSignUp: function () {
        cc.log("LoginLayer _onClickSignUp");

//        this.menu.setEnabled(false);
//        cc.Director.getInstance().replaceScene(SignUpScene.create());
//        cc.Director.getInstance().replaceScene(cc.TransitionPageTurn.create(1, SignUpScene.create(), true));
        cc.Director.getInstance().replaceScene(MainScene.getInstance());
    },

    editBoxEditingDidBegin: function (editBox) {
        cc.log("editBox " + this._getEditBoxName(editBox) + " DidBegin !");
    },

    editBoxEditingDidEnd: function (editBox) {
        cc.log("editBox " + this._getEditBoxName(editBox) + " DidEnd !");
    },

    editBoxTextChanged: function (editBox, text) {
        cc.log("editBox " + this._getEditBoxName(editBox) + ", TextChanged, text: " + text);
    },

    editBoxReturn: function (editBox) {
        cc.log("editBox " + this._getEditBoxName(editBox) + " was returned !");
    },

    _getEditBoxName: function (editBox) {
        if (this._accountEditBox == editBox) {
            return "_accountEditBox";
        } else if (this._passwordEditBox == editBox) {
            return "_passwordEditBox";
        }

        return "Unknown EditBox";
    }
})

SignInLayer.create = function () {
    var ret = new SignInLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}