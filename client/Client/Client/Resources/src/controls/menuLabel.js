/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-14
 * Time: 上午11:24
 * To change this template use File | Settings | File Templates.
 */


var MenuLabel = cc.Node.extend({
    _menu : null,

    ctor : function() {
        this._super();
    },

    init : function() {
        this._super();

    },

    updata : function() {

    },

    _clickHome : function() {
        cc.log("_clickHome");
    },

    _clickPVE : function() {
        cc.log("_clickPVE");
    },

    _clickPVP : function() {
        cc.log("_clickPVP");
    },

    _clickShop : function() {
        cc.log("_clickShop");
    },

    _clickFriend : function() {
        cc.log("_clickFriend");
    },

    _clickOther : function() {
        cc.log("_clickOther");
    }
})


/*
 * 单例
 * */
MenuLabel.getInstance = singleton(MenuLabel);