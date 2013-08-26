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


var SYSTEM_MESSAGE = 0;
var FRIEND_MESSAGE = 1;
var BATTLE_MESSAGE = 2;

var Message = Entity.extend({
    _messageList: [],

    init: function () {
        cc.log("Message init");

        return true;
    },

    push: function (msg) {
        cc.log("Message push");

        this._messageList.push(msg);
    }
});


Message.create = function () {
    var ret = new Message();

    if (ret) {
        return ret;
    }

    return null;
};