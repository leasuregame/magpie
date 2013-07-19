/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-5
 * Time: 下午3:18
 * To change this template use File | Settings | File Templates.
 */


/*
* sign up scene
* */


var SignUpScene = cc.Scene.extend({
    onEnter : function() {
        this._super();

        var signUpLayer = SignUpLayer.create();
        this.addChild(signUpLayer);
    }
})


SignUpScene.create = function() {
    var ret = new SignUpScene();

    if(ret) {
        return ret;
    }

    return null;
}