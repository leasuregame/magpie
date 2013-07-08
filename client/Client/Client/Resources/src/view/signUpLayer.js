/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-5
 * Time: 下午3:23
 * To change this template use File | Settings | File Templates.
 */


/*
 * sign up layer
 * */


var SignUpLayer = cc.Layer.extend({
    _accountEditBox: null,
    _passwordEditBox: null,
    _passwordAgainEditBox: null,
    _nameEditBox: null,

    init: function () {
        cc.log("SignUpLayer init");

        if (!this._super()) return false;

        var accountLabel = cc.LabelTTF.create("账号(必填):", "Marker Felt", 30);
        accountLabel.setPosition(cc.p(150, 700));
        this.addChild(accountLabel);

        var passwordLabel = cc.LabelTTF.create("密码(必填):", "Marker Felt", 30);
        passwordLabel.setPosition(cc.p(150, 600));
        this.addChild(passwordLabel);

        var passwordAgainLabel = cc.LabelTTF.create("重复密码:", "Marker Felt", 30);
        passwordAgainLabel.setPosition(cc.p(150, 500));
        this.addChild(passwordAgainLabel);

        var nameLabel = cc.LabelTTF.create("昵称(可选):", "Marker Felt", 30);
        nameLabel.setPosition(cc.p(150, 400));
        this.addChild(nameLabel);

        this._accountEditBox = cc.EditBox.create(cc.size(380, 60), cc.Scale9Sprite.create("res/yellow_edit.png"));
        this._accountEditBox.setPosition(cc.p(420, 700));
        this._accountEditBox.setDelegate(this);
        this._accountEditBox.setFont("American Typewriter", 25);
        this._accountEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._accountEditBox.setMaxLength(18);
        this.addChild(this._accountEditBox);

        this._passwordEditBox = cc.EditBox.create(cc.size(380, 60), cc.Scale9Sprite.create("res/green_edit.png"));
        this._passwordEditBox.setPosition(cc.p(420, 600));
        this._passwordEditBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._passwordEditBox.setDelegate(this);
        this._passwordEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._passwordEditBox.setMaxLength(18);
        this.addChild(this._passwordEditBox);

        this._passwordAgainEditBox = cc.EditBox.create(cc.size(380, 60), cc.Scale9Sprite.create("res/green_edit.png"));
        this._passwordAgainEditBox.setPosition(cc.p(420, 500));
        this._passwordAgainEditBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._passwordAgainEditBox.setDelegate(this);
        this._passwordAgainEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._passwordAgainEditBox.setMaxLength(18);
        this.addChild(this._passwordAgainEditBox);

        this._nameEditBox = cc.EditBox.create(cc.size(380, 60), cc.Scale9Sprite.create("res/yellow_edit.png"));
        this._nameEditBox.setPosition(cc.p(420, 400));
        this._nameEditBox.setDelegate(this);
        this._nameEditBox.setFont("American Typewriter", 25);
        this._nameEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._nameEditBox.setMaxLength(18);
        this.addChild(this._nameEditBox);

        var signUpAndSignInButton = cc.MenuItemFont.create("注册", this._onClickSignUpAndSignIn, this);
        signUpAndSignInButton.setPosition(260, 250);
//        this.addChild(signUpAndSignInButton);

        var backButton = cc.MenuItemFont.create("返回", this._onClickBack, this);
        backButton.setPosition(460, 250);
//        this.addChild(backButton);

        var menu = cc.Menu.create(signUpAndSignInButton, backButton);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

//        signUpAndSignInButton.addTargetWithActionForControlEvent(this, this._onClickSignUpAndSignIn, cc.CONTROL_EVENT_TOUCH_DOWN);
//        backButton.addTargetWithActionForControlEvent(this, this._onClickBack, cc.CONTROL_EVENT_TOUCH_DOWN);

        return true;
    },

    _getButtonWithTitle: function (title) {
        /** Creates and return a button with a default background and title color. */
        var backgroundButton = cc.Scale9Sprite.create("res/button.png");
        var backgroundHighlightedButton = cc.Scale9Sprite.create("res/buttonHighlighted.png");

        var titleButton = cc.LabelTTF.create(title, "Marker Felt", 30);

        titleButton.setColor(cc.c3b(159, 168, 176));

        var button = cc.ControlButton.create(titleButton, backgroundButton);
        button.setBackgroundSpriteForState(backgroundHighlightedButton, cc.CONTROL_STATE_HIGHLIGHTED);
        button.setTitleColorForState(cc.WHITE, cc.CONTROL_STATE_HIGHLIGHTED);

        return button;
    },

    _onClickSignUpAndSignIn: function () {
        cc.log("_onClickSignUpAndSignIn");

        lzWindow.pomelo.request('connector.userHandler.register', {
            account: this._accountEditBox.getText(),
            password: this._passwordEditBox.getText()
            //name: this._nameEditBox.getText()
        }, function (data) {
            cc.log(data);
        });
    },

    _onClickBack: function () {
        cc.log("_onClickBack");
        cc.Director.getInstance().replaceScene(cc.TransitionPageTurn.create(1, SignInScene.create(), false));
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
        } else if (this._passwordAgainEditBox == editBox) {
            return "_passwordAgainEditBox";
        } else if (this._nameEditBox == editBox) {
            return "_nameEditBox";
        }

        return "Unknown EditBox";
    }
})


SignUpLayer.create = function () {
    var ret = new SignUpLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}