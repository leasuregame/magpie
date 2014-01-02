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

        var bgEffect = cc.BuilderReader.load(main_scene_image.uiEffect36, this);
        bgEffect.setPosition(this._loginBgLayerFit.bgEffectPoint);
        this.addChild(bgEffect);

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
