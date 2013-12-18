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
                var text = sender.getText();
                var len = text.length;
                if(!text) {
                    TipLayer.tip("请输入账号");
                } else if(len < 6 || len > 50) {
                    TipLayer.tip("账号长度为6-50位");
                } else if (CHINESE_REG.test(text)) {
                    TipLayer.tip("账号不能包含中文");
                } else if (EMPTY_SPACE_REG.test(text)) {
                    TipLayer.tip("账号不能包含空格");
                } else if (!(EMAIL_REG.test(text) || ACCOUNT_REG.test(text))) {
                    TipLayer.tip("账号不能包含非法字符");
                }
            }
        });
        this._accountEditBox.setFont("STHeitiTC-Medium", 30);
        //this._accountEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._accountEditBox.setMaxLength(50);
        this._accountEditBox.setVisible(false);
        registerFrame.controller.accountLabel.addChild(this._accountEditBox);

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
                var text = sender.getText();
                var len = text.length;
                if(!text) {
                    TipLayer.tip("请输入密码");
                } else if(len < 6 || len > 20) {
                    TipLayer.tip("密码长度为6-20位");
                } else if (CHINESE_REG.test(text)) {
                    TipLayer.tip("密码不能包含中文");
                } else if (EMPTY_SPACE_REG.test(text)) {
                    TipLayer.tip("密码不能包含空格");
                } else if (!PASSWORD_REG.test(text)) {
                    TipLayer.tip("密码不能包含非法字符");
                }
            }
        });
        this._passwordEditBox.setFont("STHeitiTC-Medium", 30);
        //this._passwordEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._passwordEditBox.setMaxLength(20);
        this._passwordEditBox.setVisible(false);
        registerFrame.controller.passwordLabel.addChild(this._passwordEditBox);

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
                var text = sender.getText();
                var len = text.length;
                if(!text) {
                    TipLayer.tip("请再次输入密码");
                } else if(len < 6 || len > 20) {
                    TipLayer.tip("密码长度为6-20位");
                } else if (CHINESE_REG.test(text)) {
                    TipLayer.tip("密码不能包含中文");
                } else if (EMPTY_SPACE_REG.test(text)) {
                    TipLayer.tip("密码不能包含空格");
                } else if (!PASSWORD_REG.test(text)) {
                    TipLayer.tip("密码不能包含非法字符");
                }
            }
        });
        this._passwordAgainEditBox.setFont("STHeitiTC-Medium", 30);
        //this._passwordAgainEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._passwordAgainEditBox.setMaxLength(20);
        this._passwordAgainEditBox.setVisible(false);
        registerFrame.controller.passwordAgainLabel.addChild(this._passwordAgainEditBox);

        registerFrame.animationManager.setCompletedAnimationCallback(this, function () {
            this._accountEditBox.setVisible(true);
            this._passwordEditBox.setVisible(true);
            this._passwordAgainEditBox.setVisible(true);
        });

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

            TipLayer.tip("注册成功，请登录游戏");
            that.getParent().switch(LoginLayer.create());
            that.removeFromParent();
        }, account, password);
    },

    _onClickBack: function () {
        cc.log("RegisterLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.getParent().switch(LoginLayer.create());
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