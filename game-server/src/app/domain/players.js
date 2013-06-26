/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-25
 * Time: 下午3:54
 * To change this template use File | Settings | File Templates.
 */


/*
* players
* */


(function () {
    var Players = function (param) {


        this.id = param.id;
        this.createTime = param.createTime;
        this.userId = param.userId;
        this.areaId = param.areaId;
        this.name = param.name;
        this.power = param.power;
        this.lv = param.lv;
        this.exp = param.exp;
        this.money = param.money;
        this.gold = param.gold;
        this.formation = param.formation;
        this.ability = param.ability;
        this.task = param.task;
        this.taskMark = param.taskMark;
        this.pass = param.pass;
        this.passMark = param.passMark;
    }

    module.exports = Players;

}).call(this);