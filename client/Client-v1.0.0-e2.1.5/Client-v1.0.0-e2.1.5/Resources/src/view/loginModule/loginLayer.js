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

        lz.dc.beginLogPageView("登录界面");
    },

    onExit: function () {
        cc.log("LoginLayer onExit");

        this._super();

        lz.dc.endLogPageView("登录界面");
    },

    init: function () {
        cc.log("LoginLayer init");

        if (!this._super()) return false;

        user = gameData.user;

        this._loginLayerFit = gameFit.loginScene.loginLayer;

        var bgEffect = cc.BuilderReader.load(main_scene_image.uiEffect36, this);
        bgEffect.setPosition(this._loginLayerFit.bgEffectPoint);
        this.addChild(bgEffect);

        this._loginFrame = cc.BuilderReader.load(main_scene_image.uiEffect37, this);
        this._loginFrame.setPosition(this._loginLayerFit.loginFramePoint);
        this.addChild(this._loginFrame);

        this._accountEditBox = cc.EditBox.create(cc.size(440, 60), cc.Scale9Sprite.create(main_scene_image.edit));
        this._accountEditBox.setPosition(cc.p(10, 0));
        this._accountEditBox.setInputMode(cc.EDITBOX_INPUT_MODE_EMAILADDR);
        this._accountEditBox.setDelegate({
            /**
             * This method is called when the edit box text was changed.
             * @param {cc.EditBox} sender
             * @param {String} text
             */
            editBoxTextChanged: function (sender, text) {

            }
        });
        this._accountEditBox.setFont("STHeitiTC-Medium", 35);
        this._accountEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._accountEditBox.setMaxLength(20);
        this._loginFrame.controller.accountLabel.addChild(this._accountEditBox);

        this._passwordEditBox = cc.EditBox.create(cc.size(440, 60), cc.Scale9Sprite.create(main_scene_image.edit));
        this._passwordEditBox.setPosition(cc.p(10, 0));
        this._passwordEditBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._passwordEditBox.setDelegate({
            /**
             * This method is called when the edit box text was changed.
             * @param {cc.EditBox} sender
             * @param {String} text
             */
            editBoxTextChanged: function (sender, text) {

            }
        });
        this._passwordEditBox.setFont("STHeitiTC-Medium", 35);
        this._passwordEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._passwordEditBox.setMaxLength(20);
        this._loginFrame.controller.passwordLabel.addChild(this._passwordEditBox);

        this._accountEditBox.setText(user.get("account"));
        this._passwordEditBox.setText(user.get("password"));

        this._selectAreaName = StrokeLabel.create("", "STHeitiTC-Medium", 30);
        this._selectAreaName.setPosition(cc.p(0, 0));
        this._loginFrame.controller.areaName.addChild(this._selectAreaName);

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

        var areaId = user.get("area") || server.getRecommendArea();
        user.set("area", areaId);
        this._areaList = server.get("areaList");
        var len = this._areaList.length;

        for (var i = 0; i < len; ++i) {
            var area = this._areaList[i];

            if (areaId == area.id) {
                this.updateSelectAreaName(i);
            }
        }

    },

    updateSelectAreaName: function (id) {
        cc.log("LoginLayer updateSelectAreaName");

        var area = this._areaList[id];
        this._selectAreaName.setString(area.name);
        this._selectAreaName.setColor(area.color);

        this._loginFrame.setVisible(true);
    },

    updateEditBox: function () {

        this._accountEditBox.setText(user.get("account"));
        this._passwordEditBox.setText(user.get("password"));
        this._loginFrame.setVisible(true);
    },

    _onClickOpenArea: function () {
        cc.log("LoginLayer _onClickOpenArea");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._loginFrame.setVisible(false);

        var selectAreaLayer = SelectAreaLayer.create(this._areaList);
        this.addChild(selectAreaLayer, 1);
    },

    _onClickLogin: function () {
        cc.log("LoginLayer _onClickLogin");

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

            if (type == 1) {
                cc.Director.getInstance().replaceScene(MainScene.getInstance());
            } else if (type == 2) {
                //that.getParent().switchLayer(NewPlayerLayer);
                var newPlayerLayer = NewPlayerLayer.create();
                that.addChild(newPlayerLayer);
                that._loginFrame.setVisible(false);
            }
        });
    },

    _onClickRegister: function () {
        cc.log("LoginLayer _onClickRegister");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._loginFrame.setVisible(false);

        var registerLayer = RegisterLayer.create();
        this.addChild(registerLayer, 1);
    }
});

LoginLayer.create = function () {
    var ret = new LoginLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};