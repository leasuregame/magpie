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

        lz.um.beginLogPageView("注册界面");
    },

    onExit: function () {
        cc.log("RegisterLayer onExit");

        this._super();

        lz.um.endLogPageView("注册界面");
    },

    init: function () {
        cc.log("RegisterLayer init");

        if (!this._super()) return false;

        this._registerLayerFit = gameFit.loginScene.registerLayer;

        var registerFrame = cc.BuilderReader.load(main_scene_image.uiEffect39, this);
        registerFrame.setPosition(this._registerLayerFit.registerFramePoint);
        this.addChild(registerFrame);

        var that = this;
        this._accountEditBox = cc.EditBox.create(cc.size(366, 60), cc.Scale9Sprite.create(main_scene_image.edit));
        this._accountEditBox.setAnchorPoint(cc.p(0, 0.5));
        this._accountEditBox.setPosition(cc.p(0, 0));
        this._accountEditBox.setPlaceHolder("推荐使用电话号码或邮箱");
        this._accountEditBox.setInputMode(cc.EDITBOX_INPUT_MODE_EMAILADDR);
        this._accountEditBox.setDelegate({
            /**
             * This method is called when an edit box gains focus after keyboard is shown.
             * @param {cc.EditBox} sender
             */
            editBoxEditingDidBegin: function (sender) {
                gameData.sound.playEffect(main_scene_image.click_button_sound, false);
            },

            /**
             * This method is called when an edit box loses focus after keyboard is hidden.
             * @param {cc.EditBox} sender
             */
            editBoxEditingDidEnd: function (sender) {
                that._judgeAccount();
            }
        });
        this._accountEditBox.setFont("STHeitiTC-Medium", 30);
        this._accountEditBox.setMaxLength(50);
        this._accountEditBox.setVisible(false);
        registerFrame.controller.ccbAccountLabel.addChild(this._accountEditBox);

        this._passwordEditBox = cc.EditBox.create(cc.size(366, 60), cc.Scale9Sprite.create(main_scene_image.edit));
        this._passwordEditBox.setAnchorPoint(cc.p(0, 0.5));
        this._passwordEditBox.setPosition(cc.p(0, 0));
        this._passwordEditBox.setPlaceHolder("6-20位数字或者字母");
        this._passwordEditBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._passwordEditBox.setDelegate({
            /**
             * This method is called when an edit box gains focus after keyboard is shown.
             * @param {cc.EditBox} sender
             */
            editBoxEditingDidBegin: function (sender) {
                gameData.sound.playEffect(main_scene_image.click_button_sound, false);
            },

            /**
             * This method is called when an edit box loses focus after keyboard is hidden.
             * @param {cc.EditBox} sender
             */
            editBoxEditingDidEnd: function (sender) {
                that._judgePassword();
            }
        });
        this._passwordEditBox.setFont("STHeitiTC-Medium", 30);
        //this._passwordEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._passwordEditBox.setMaxLength(20);
        this._passwordEditBox.setVisible(false);
        registerFrame.controller.ccbPasswordLabel.addChild(this._passwordEditBox);

        this._passwordAgainEditBox = cc.EditBox.create(cc.size(366, 60), cc.Scale9Sprite.create(main_scene_image.edit));
        this._passwordAgainEditBox.setAnchorPoint(cc.p(0, 0.5));
        this._passwordAgainEditBox.setPosition(cc.p(0, 0));
        this._passwordAgainEditBox.setPlaceHolder("6-20位数字或者字母");
        this._passwordAgainEditBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._passwordAgainEditBox.setDelegate({
            /**
             * This method is called when an edit box gains focus after keyboard is shown.
             * @param {cc.EditBox} sender
             */
            editBoxEditingDidBegin: function (sender) {
                gameData.sound.playEffect(main_scene_image.click_button_sound, false);
            },

            /**
             * This method is called when an edit box loses focus after keyboard is hidden.
             * @param {cc.EditBox} sender
             */
            editBoxEditingDidEnd: function (sender) {
                that._judgePasswordAgain();
            }
        });
        this._passwordAgainEditBox.setFont("STHeitiTC-Medium", 30);
        this._passwordAgainEditBox.setMaxLength(20);
        this._passwordAgainEditBox.setVisible(false);
        registerFrame.controller.ccbPasswordAgainLabel.addChild(this._passwordAgainEditBox);

        registerFrame.animationManager.setCompletedAnimationCallback(this, function () {
            this._accountEditBox.setVisible(true);
            this._passwordEditBox.setVisible(true);
            this._passwordAgainEditBox.setVisible(true);
        });

        return true;
    },

    _judgeAccount: function () {
        cc.log("User _judgeAccount");

        var text = this._accountEditBox.getText();
        var len = text.length;
        if (!text) {
            TipLayer.tip("请输入帐号");
        } else if (len < 6 || len > 50) {
            TipLayer.tip("帐号长度为6-50位");
        } else if (CHINESE_REG.test(text)) {
            TipLayer.tip("帐号不能包含中文");
        } else if (EMPTY_SPACE_REG.test(text)) {
            TipLayer.tip("帐号不能包含空格");
        } else if (!(EMAIL_REG.test(text) || ACCOUNT_REG.test(text))) {
            TipLayer.tip("帐号不能包含非法字符");
        } else {
            return true;
        }

        return false;
    },

    _judgePassword: function () {
        cc.log("User _judgePassword");

        var text = this._passwordEditBox.getText();
        var len = text.length;
        if (!text) {
            TipLayer.tip("请输入密码");
        } else if (len < 6 || len > 20) {
            TipLayer.tip("密码长度为6-20位");
        } else if (CHINESE_REG.test(text)) {
            TipLayer.tip("密码不能包含中文");
        } else if (EMPTY_SPACE_REG.test(text)) {
            TipLayer.tip("密码不能包含空格");
        } else if (!PASSWORD_REG.test(text)) {
            TipLayer.tip("密码不能包含非法字符");
        } else {
            return true;
        }

        return false;
    },

    _judgePasswordAgain: function () {
        cc.log("User _judgePasswordAgain");

        var text = this._passwordAgainEditBox.getText();
        var len = text.length;
        if (!text) {
            TipLayer.tip("请再次输入密码");
        } else if (len < 6 || len > 20) {
            TipLayer.tip("密码长度为6-20位");
        } else if (CHINESE_REG.test(text)) {
            TipLayer.tip("密码不能包含中文");
        } else if (EMPTY_SPACE_REG.test(text)) {
            TipLayer.tip("密码不能包含空格");
        } else if (!PASSWORD_REG.test(text)) {
            TipLayer.tip("密码不能包含非法字符");
        } else {
            return true;
        }

        return false;
    },

    ccbFnRegister: function () {
        cc.log("RegisterLayer ccbFnRegister");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._judgeAccount() && this._judgePassword() && this._judgePasswordAgain()) {
            var account = this._accountEditBox.getText();
            var password = this._passwordEditBox.getText();

            var that = this;
            gameData.user.register(function (data) {
                cc.log(data);

                TipLayer.tip("注册成功，请登录游戏");
                that.getParent().switchLayer(LoginLayer);
            }, account, password);
        }
    },

    ccbFnBack: function () {
        cc.log("RegisterLayer ccbFnBack");

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