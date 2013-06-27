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
    /*
     * Card 与 card 表对应的数据类，提供简单操作
     * @param {object} row 数据库 card 表中的一行记录
     * */
    var Card = function (row) {
        if (typeof (row) == "undefined") {
            throw new Error("Card row is undefined");
        }

        var _id = row.id;
        var _createTime = row.createTime;
        var _playersId = row.playersId;
        var _tableId = row.tableId;
        var _lv = row.lv;
        var _exp = row.exp;
        var _skillLv = row.skillLv;
        var _hpAddition = row.hpAddition;
        var _atkAddition = row.atkAddition;

        var _playersIdDirty = false;
        var _tableIdDirty = false;
        var _lvDirty = false;
        var _expDirty = false;
        var _skillLvDirty = false;
        var _hpAdditionDirty = false;
        var _atkAdditionDirty = false;

        this.getId = function () {
            return _id;
        }

        this.getCreateTime = function () {
            return _createTime;
        }

        this.getPlayersId = function () {
            return _playersId;
        }

        this.setPlayersId = function (playersId) {
            _playersId = playersId;
            _playersIdDirty = true;
        }

        this.getTableId = function () {
            return _tableId;
        }

        this.setTableId = function (tableId) {
            _tableId = tableId;
            _tableIdDirty = true;
        }

        this.getLv = function () {
            return _lv;
        }

        this.setLv = function (lv) {
            _lv = lv;
            _lvDirty = true;
        }

        this.upLv = function () {
            _lv += 1;
            _lvDirty = true;
        }

        this.getExp = function () {
            return _exp;
        }

        this.setExp = function (exp) {
            _exp = exp;
            _expDirty = true;
        }

        this.getSkillLv = function () {
            return _skillLv;
        }

        this.setSkillLv = function (skillLv) {
            _skillLv = skillLv;
            _skillLvDirty = true;
        }

        this.upSkillLv = function () {
            _skillLv += 1;
            _skillLvDirty = true;
        }

        this.getHpAddition = function () {
            return _hpAddition;
        }

        this.setHpAddition = function (hpAddition) {
            _hpAddition = hpAddition;
            _hpAdditionDirty = true;
        }

        this.getAtkAddition = function () {
            return _atkAddition;
        }

        this.setAtkAddition = function (atkAddition) {
            _atkAddition = atkAddition;
            _atkAdditionDirty = true;
        }

        /*
         * 提交数据到数据库，只对修改标记过的数据进行提交
         * */
        this.submitData = function () {
            if (_playersIdDirty || _tableIdDirty || _lvDirty || _expDirty || _skillLvDirty || _hpAdditionDirty || _atkAdditionDirty) {
                console.log("数据没有修改，不需要提交");
                return;
            }

            var param = {};

            if (_playersIdDirty) {
                param.playersId = _playersId;
                _playersIdDirty = false;
            }

            if (_tableIdDirty) {
                param.tableId = _tableId;
                _tableIdDirty = false;
            }

            if (_lvDirty) {
                param.lv = _lv;
                _lvDirty = false;
            }

            if (_expDirty) {
                param.exp = _exp;
                _expDirty = false;
            }

            if (_skillLvDirty) {
                param.skillLv = _skillLvl;
                _skillLvDirty = false;
            }

            if (_hpAdditionDirty) {
                param.hpAddition = _hpAddition;
                _hpAdditionDirty = false;
            }

            if (_atkAdditionDirty) {
                param.atkAddition = _atkAddition;
                _atkAdditionDirty = false;
            }

            // 弹出提交事件
        }
    };

    module.exports = Card;

}).call(this);