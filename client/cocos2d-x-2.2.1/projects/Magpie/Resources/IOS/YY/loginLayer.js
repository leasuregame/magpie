/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-12-30
 * Time: 下午2:26
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
    _accountLabel: null,
    _selectAreaName: null,
    _loginFrame: null,

    onEnter: function () {
        cc.log("LoginLayer onEnter");

        this._super();

        lz.um.beginLogPageView("YY登录界面");
    },

    onExit: function () {
        cc.log("LoginLayer onExit");

        this._super();
        this.unscheduleAllCallbacks();

        lz.um.endLogPageView("YY登录界面");
    },

    init: function () {
        cc.log("LoginLayer init");

        if (!this._super()) return false;

        user = gameData.user;

        this._loginLayerFit = gameFit.loginScene.loginLayer;

        this._loginFrame = cc.BuilderReader.load(main_scene_image.uiEffect107, this);

        this.addChild(this._loginFrame);

        if (gameDevice != "Iphone5") {
            this._loginFrame.setPosition(cc.p(360, 540));
        } else {
            this._loginFrame.setPosition(cc.p(320, 568));
        }

        this._accountLabel = StrokeLabel.create("当前未登录", "STHeitiTC-Medium", 30);
        this._accountLabel.setAnchorPoint(cc.p(0, 0.5));
        this._accountLabel.setPosition(cc.p(0, 0));
        this._loginFrame.controller.ccbAccountLabel.addChild(this._accountLabel);

        this._selectAreaName = StrokeLabel.create("", "STHeitiTC-Medium", 30);
        this._selectAreaName.setAnchorPoint(cc.p(0, 0.5));
        this._selectAreaName.setPosition(cc.p(0, 0));
        this._loginFrame.controller.ccbAreaNameLabel.addChild(this._selectAreaName);

        this.updateAreaList();

        this.schedule(this.updateAccountLabel, 1);

        return true
    },

    updateAreaList: function () {
        cc.log("LoginLayer updateAreaList");

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

    updateAccountLabel: function () {
        var str = "当前未登录";

        if (lz.platformIsLogin && lz.platformIsLogin()) {
            var yyUser = yyAdapter.YYGetUser();
            str = yyUser.userName;
        }

        this._accountLabel.setString(str);
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

        var that = this;
        gameData.user.login(function (type) {
            cc.log(type);

            if (type == 2) {
                that.getParent().switchLayer(NewPlayerLayer);
            }
        });
    },

    ccbFnAccountLogin: function () {
        cc.log("LoginLayer ccbFnAccountLogin");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        yyAdapter.YYLogin();
    }
});

LoginLayer.create = function () {
    var ret = new LoginLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};