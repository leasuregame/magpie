/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-25
 * Time: 下午3:48
 * To change this template use File | Settings | File Templates.
 */


/*
 * passive skill
 * */


(function () {
    var PassiveSkill = function (param) {
        this.id = param.id;
        this.createTime = param.createTime;
        this.cardId = param.cardId;
        this.tableId = param.tableId;
        this.value = param.value;
    }

    module.exports = PassiveSkill;

}).call(this);