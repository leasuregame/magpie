/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午10:37
 * To change this template use File | Settings | File Templates.
 */


/*
 * login scene
 * */


var LoginScene = cc.Scene.extend({
    onEnter: function () {
        cc.log("LoginScene onEnter");

        this._super();

        var loginLayer = LoginLayer.create();
        this.addChild(loginLayer);
    }
});


LoginScene.create = function () {
    var ret = new LoginScene();

    if (ret) {
        return ret;
    }

    return null;
};