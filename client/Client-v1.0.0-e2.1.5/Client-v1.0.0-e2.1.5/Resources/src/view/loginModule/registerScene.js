/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-5
 * Time: 下午3:18
 * To change this template use File | Settings | File Templates.
 */


/*
 * register scene
 * */


var RegisterScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        var registerLayer = RegisterLayer.create();
        this.addChild(registerLayer);
    }
});


RegisterScene.create = function () {
    var ret = new RegisterScene();

    if (ret) {
        return ret;
    }

    return null;
};