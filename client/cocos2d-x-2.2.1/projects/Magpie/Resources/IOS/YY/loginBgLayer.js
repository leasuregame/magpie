/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-12-18
 * Time: 下午2:50
 * To change this template use File | Settings | File Templates.
 */


/*
 * login bg layer
 * */


var LoginBgLayer = cc.Layer.extend({
    _loginBgLayerFit: null,

    init: function () {
        cc.log("LoginBgLayer init");

        if (!this._super()) return false;

        this._loginBgLayerFit = gameFit.loginScene.loginBgLayer;

        var bgEffect = cc.BuilderReader.load(main_scene_image.uiEffect104, this);
        this.addChild(bgEffect);

        if(gameDevice != "Iphone5") {
            bgEffect.setPosition(cc.p(360, 432));
            bgEffect.controller.ccbTitleNode.setPosition(cc.p(0, 170));
        } else {
            bgEffect.setPosition(cc.p(320, 568));
        }

        var application = cc.Application.getInstance();
        if (typeof (application.getAppVersion) != "undefined") {
            var appVersionLabel = StrokeLabel.create(
                application.getAppVersion(),
                "STHeitiTC-Medium",
                25
            );
            appVersionLabel.setAnchorPoint(cc.p(1, 1));
            appVersionLabel.setPosition(this._loginBgLayerFit.appVersionLabelPoint);
            this.addChild(appVersionLabel);
        }

        return true;
    }
});


LoginBgLayer.create = function () {
    cc.log("LoginBgLayer create");

    var ret = new LoginBgLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};
