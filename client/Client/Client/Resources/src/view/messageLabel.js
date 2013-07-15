/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-15
 * Time: 下午3:00
 * To change this template use File | Settings | File Templates.
 */


/*
* message label
* */


var MessageLabel = cc.Layer.extend({
    onEnter: function() {
        cc.log("MessageLabel onEnter");

        this._super();
    },

    init: function() {
        cc.log("MessageLabel init");

        if(!this._super()) return false;

        return true;
    },

    update: function() {
        cc.log("MessageLabel update");
    }
})


MessageLabel.create = function() {
    var ret = new MessageLabel();

    if(ret && ret.init()) {
        return ret;
    }

    return null;
}