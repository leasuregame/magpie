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

var EMAIL_REG = /^(?=\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$).{6,50}$/;
var ACCOUNT_REG = /^[\w+-]{6,50}$/;
var PASSWORD_REG = /^[a-zA-Z0-9]{6,20}$/;
var EMPTY_SPACE_REG = /\s+/g;
var CHINESE_REG = /^[\u4e00-\u9fa5]{1,6}$/;
var NICKNAME_REG = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,6}$/;

var LoginLayer = cc.Layer.extend({
    _loginLayerFit: null,

    _areaList: null,
    _selectAreaEffect: null,
    _scrollView: null,
    _loginItem: null,
    _accountEditBox: null,
    _passwordEditBox: null,
    _selectAreaName: null,
    _loginFrame: null,

    onEnter: function () {
        cc.log("LoginLayer onEnter");

        this._super();

        lz.um.beginLogPageView("AppStore登录界面");
    },

    onExit: function () {
        cc.log("LoginLayer onExit");

        this._super();
        this.unscheduleAllCallbacks();

        lz.um.endLogPageView("AppStore登录界面");
    },

    init: function () {
        cc.log("LoginLayer init");

        if (!this._super()) return false;

        user = gameData.user;

        this._loginLayerFit = gameFit.loginScene.loginLayer;

        this._loginFrame = cc.BuilderReader.load(main_scene_image.uiEffect37, this);
        this._loginFrame.setPosition(this._loginLayerFit.loginFramePoint);
        this.addChild(this._loginFrame);

        this._loginFrame.controller.ccbAccountNode.setPosition(this._loginLayerFit.accountNodePoint);
        this._loginFrame.controller.ccbPasswordNode.setPosition(this._loginLayerFit.passwordNodePoint);
        this._loginFrame.controller.ccbStartGameNode.setPosition(this._loginLayerFit.startGameNodePoint);

        this._accountEditBox = cc.EditBox.create(cc.size(395, 60), cc.Scale9Sprite.create(main_scene_image.edit));
        this._accountEditBox.setAnchorPoint(cc.p(0, 0.5));
        this._accountEditBox.setPosition(cc.p(0, -3));

        this._accountEditBox.setInputMode(cc.EDITBOX_INPUT_MODE_EMAILADDR);
        this._accountEditBox.setDelegate({
            /**
             * This method is called when an edit box gains focus after keyboard is shown.
             * @param {cc.EditBox} sender
             */
            editBoxEditingDidBegin: function (sender) {
                gameData.sound.playEffect(main_scene_image.click_button_sound, false);
            }
        });

        this._accountEditBox.setFont("STHeitiTC-Medium", 35);
        this._accountEditBox.setMaxLength(50);
        this._loginFrame.controller.ccbAccountLabel.addChild(this._accountEditBox);


        this._passwordEditBox = cc.EditBox.create(cc.size(395, 60), cc.Scale9Sprite.create(main_scene_image.edit));
        this._passwordEditBox.setAnchorPoint(cc.p(0, 0.5));
        this._passwordEditBox.setPosition(cc.p(0, 0));

        this._passwordEditBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._passwordEditBox.setDelegate({
            /**
             * This method is called when an edit box gains focus after keyboard is shown.
             * @param {cc.EditBox} sender
             */
            editBoxEditingDidBegin: function (sender) {
                gameData.sound.playEffect(main_scene_image.click_button_sound, false);
            }
        });
        this._passwordEditBox.setFont("STHeitiTC-Medium", 35);
        this._passwordEditBox.setMaxLength(20);
        this._loginFrame.controller.ccbPasswordLabel.addChild(this._passwordEditBox);

        this._accountEditBox.setText(user.get("account"));
        this._passwordEditBox.setText(user.get("password"));

        this._selectAreaName = StrokeLabel.create("", "STHeitiTC-Medium", 30);
        this._selectAreaName.setPosition(cc.p(0, 0));
        this._loginFrame.controller.ccbAreaName.addChild(this._selectAreaName);

        this.updateAreaList();
        return true
    },

    updateAreaList: function () {
        cc.log("LoginLayer upateAreaList");

        var that = this;
        lz.server.connectGateServer(function () {
            that.addAreaList();

            that.scheduleOnce(that.updateAreaList, GATE_SERVER_TIMEOUT);
        });

    },

    addAreaList: function () {
        cc.log("LoginLayer addAreaList");

        var server = lz.server;
        var user = gameData.user;

        var areaId = server.getRecommendArea();
        user.set("area", areaId);
        this._areaList = server.get("areaList");
        var len = this._areaList.length;

        for (var i = 0; i < len; ++i) {
            var area = this._areaList[i];

            if (areaId == area.id) {
                this.resetAreaName(i);
            }
        }
    },

    resetAreaName: function (id) {
        cc.log("LoginLayer resetAreaName");

        var area = this._areaList[id];
        this._selectAreaName.setString(area.name);
        this._selectAreaName.setColor(cc.c3b(255, 225, 62));
    },

    updateSelectAreaName: function (id) {
        cc.log("LoginLayer updateSelectAreaName");

        this.resetAreaName(id);
        this._loginFrame.setVisible(true);
    },

    updateEditBox: function () {

        this._accountEditBox.setText(user.get("account"));
        this._passwordEditBox.setText(user.get("password"));
        this._loginFrame.setVisible(true);
    },

    ccbFnOpenArea: function () {
        cc.log("LoginLayer ccbFnOpenArea");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._loginFrame.setVisible(false);

        var selectAreaLayer = SelectAreaLayer.create(this._areaList);
        this.addChild(selectAreaLayer, 1);
    },

    ccbFnLogin: function () {
        cc.log("LoginLayer ccbFnLogin");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var user = gameData.user;

        user.set("account", this._accountEditBox.getText());
        user.set("password", this._passwordEditBox.getText());

        if (!user.canLogin()) {
            return;
        }

        var that = this;
        user.login(function (type) {
            cc.log(type);

            if (type == 2) {
                that.getParent().switchLayer(NewPlayerLayer);
            }
        });
    },

    ccbFnRegister: function () {
        cc.log("LoginLayer ccbFnRegister");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        this.getParent().switchLayer(RegisterLayer);
    }
});

LoginLayer.create = function () {
    var ret = new LoginLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};