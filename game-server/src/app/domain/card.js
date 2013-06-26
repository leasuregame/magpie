/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-25
 * Time: 下午3:08
 * To change this template use File | Settings | File Templates.
 */


/*
 * card
 * */


(function () {
    var Card = function(param) {
        if(typeof (param.playersId) == "undefined" || typeof (param.tableId) == "undefined") {
            throw new Error("can not new Card with not param.playersId or param.tableId");
        }

        this.id = param.id;
        this.createTime = param.createTime;
        this.playersId = param.playersId;
        this.tableId = param.tableId;
        this.lv = param.lv;
        this.skillLv = param.skillLv;
        this.hpAddition = param.hpAddition;
        this.atkAddition = param.atkAddition;
    };

    module.exports = Card;

}).call(this);