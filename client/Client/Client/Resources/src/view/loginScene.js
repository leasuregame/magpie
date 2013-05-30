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
    ctor : function() {
        cc.log("LoginScene ctor");

        this._super();
    },

    onEnter : function() {
        if(!this._super()) return false;

        cc.log("loginScene onEnter");

        return true;
    }
})