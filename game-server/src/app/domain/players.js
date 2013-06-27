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
    /*
     * Plyaers 与 players 表对应的数据类，提供简单操作
     * @param {object} row 数据库 players 表中的一行记录
     * */
    var Players = function (row) {
        if (typeof (row) == "undefined") {
            throw new Error("Players row is undefined");
        }

        var _id = row.id;
        var _createTime = row.createTime;
        var _userId = row.userId;
        var _areaId = row.areaId;
        var _name = row.name;
        var _power = row.power;
        var _lv = row.lv;
        var _exp = row.exp;
        var _money = row.money;
        var _gold = row.gold;
        var _lineUp = eval("(" + row.lineUp + ")");
        var _ability = row.ability;
        var _task = eval("(" + row.task + ")");
        var _pass = row.pass;
        var _passMark = row.passMark;

        var _nameDirty = false;
        var _powerDirty = false;
        var _lvDirty = false;
        var _expDirty = false;
        var _moneyDirty = false;
        var _goldDirty = false;
        var _lineUpDirty = false;
        var _abilityDirty = false;
        var _taskDirty = false;
        var _passDirty = false;
        var _passMarkDirty = false;

        this.getId = function () {
            return _id;
        }

        this.getCreateTime = function () {
            return _createTime;
        }

        this.getUserId = function () {
            return _userId;
        }

        this.getAreaId = function () {
            return _areaId;
        }

        this.getName = function () {
            return _name;
        }

        this.setName = function (name) {
            _name = name;
            _nameDirty = true;
        }

        this.getPower = function () {
            return _power;
        }

        this.setPower = function (power) {
            _power = power;
            _powerDirty = true;
        }

        this.getLv = function () {
            return _lv;
        }

        this.upLv = function () {
            _lv += 1;
            _lvDirty = true;
        }

        this.setLv = function (lv) {
            _lv = lv;
            _lvDirty = true;
        }

        this.getExp = function () {
            return _exp;
        }

        this.setExp = function (exp) {
            _exp = exp;
            _expDirty = true;
        }

        this.getMoney = function () {
            return _money;
        }

        this.setMoney = function (money) {
            _money = money;
            _moneyDirty = true;
        }

        this.getGold = function () {
            return _gold;
        }

        this.setGold = function (gold) {
            _gold = gold;
            _goldDirty = true;
        }

        this.getLineUp = function () {
            return _lineUp;
        }

        this.setLineUp = function (lineUp) {
            _lineUp = lineUp;
            _lineUpDirty = true;
        }

        this.getAbility = function () {
            return _ability;
        }

        this.setAbility = function (ability) {
            _ability = ability;
            _abilityDirty = true;
        }

        this.getTask = function () {
            return _task;
        }

        this.setTask = function (task) {
            _task = task;
            _taskDirty = true;
        }

        this.getPass = function () {
            return _pass;
        }

        this.upPass = function () {
            _pass += 1;
            _passDirty = true;
        }

        this.setPass = function (pass) {
            _pass = pass;
            _passDirty = true;
        }

        /*
         * 二进制标记某个关卡是否已经挑战过
         * 0 为未挑战
         * 1 为已挑战
         * */
        this.getPassMark = function () {
            return _passMark;
        }

        this.getPassMarkByIndex = function () {
            if (index < 1) {
                console.log("关卡标记索引不存在");
                return;
            }

            var mark = (_passMark >> (index - 1)) & 1;

            return (mark == 0);
        }

        this.setPassMark = function (passMark) {
            _passMark = passMark;
            _passMarkDirty = true;
        }

        this.resetPassMarkByAll = function () {
            _passMark = 0;
            _passMarkDirty = true;
        };

        this.setPassMarkByAll = function () {
            var mask = 1;

            for (var i = 0; i < _pass; ++i) {
                _passMark |= mask;
                mask <<= 1;
            }

            _passMarkDirty = true;
        }

        /*
         * 传入精英关卡序号，将其标记为已打
         * @param {number} index 关卡序号
         * */
        this.setPsssMarkByIndex = function (index) {
            if (index < 1) {
                console.log("关卡标记索引不存在");
                return;
            }

            var mask = 1 << (index - 1);

            _passMark |= mask;
            _passMarkDirty = true;
        }

        /*
         * 提交数据到数据库，只对修改标记过的数据进行提交
         * */
        this.submitData = function () {
            if (_nameDirty || _powerDirty || _lvDirty ||
                _expDirty || _moneyDirty || _goldDirty ||
                _lineUpDirty || _abilityDirty || _taskDirty ||
                _passDirty || _passMarkDirty) {
                console.log("数据没有修改，不需要提交");
                return;
            }

            var param = {};

            if (_nameDirty) {
                param.name = _name;
                _nameDirty = false;
            }

            if (_powerDirty) {
                param.power = _power;
                _powerDirty = false;
            }

            if (_lvDirty) {
                param.lv = _lv;
                _lvDirty = false;
            }

            if (_expDirty) {
                param.exp = _exp;
                _expDirty = false;
            }

            if (_moneyDirty) {
                param.money = _money;
                _moneyDirty = false;
            }

            if (_goldDirty) {
                param.gold = _gold;
                _goldDirty = false;
            }

            if (_lineUpDirty) {
                param.lineUp = _lineUp;
                _lineUpDirty = false;
            }

            if (_abilityDirty) {
                param.ability = _ability;
                _abilityDirty = false;
            }

            if (_taskDirty) {
                param.task = _task;
                _taskDirty = false;
            }

            if (_passDirty) {
                param.pass = _pass;
                _passDirty = false;
            }

            if (_passMarkDirty) {
                param.passMark = _passMark;
                _passMarkDirty = false;
            }

            // 弹出提交事件
        }
    }

    module.exports = Players;

}).call(this);