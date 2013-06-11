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
    init: function () {
        cc.log("LoginLayer init");

        if (!this._super()) return false;


        return true;
    }
})