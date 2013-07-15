/**
 * Created with JetBrains WebStorm.
 * User: lcc
 * Date: 13-7-10
 * Time: 下午3:29
 * To change this template use File | Settings | File Templates.
 */


/*
* message
* */


var Message = Entity.extend({
    _messageList : [],

    init : function() {

        return true;
    },

    push: function(msg) {
        this._messageList.push(msg);
    },

    getLastMessage: function() {
        return this._messageList[this._messageList.length];
    }
})


Message.create = function() {
    var ret = new Message();

    if(ret) {
        return ret;
    }

    return null;
}