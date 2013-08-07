/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午10:37
 * To change this template use File | Settings | File Templates.
 */


/*
 * sign in scene
 * */


var SignInScene = cc.Scene.extend({
    onEnter: function () {
        cc.log("SignInScene onEnter");

        this._super();

        var loginLayer = SignInLayer.create();
        this.addChild(loginLayer);
    }
})

SignInScene.create = function () {
    var ret = new SignInScene();

    if (ret) {
        return ret;
    }

    return null;
}