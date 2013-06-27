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
    /*
     * PassiveSkill 与 passiveSkill 表对应的数据类，提供简单操作
     * @param {object} row 数据库 passiveSkill 表中的一行记录
     * */
    var PassiveSkill = function (row) {
        if (typeof (row) == "undefined") {
            throw new Error("PassiveSkill row is undefined");
        }

        var _id = row.id;
        var _createTime = row.createTime;
        var _cardId = row.cardId;
        var _tableId = row.tableId;
        var _value = row.value;

        var _tableIdDirty = false;
        var _valueDirty = false;

        var getId = function () {
            return _id;
        }

        var getCreateTime = function () {
            return _createTime;
        }

        var getCardId = function () {
            return _cardId;
        }

        var getTableId = function () {
            return _tableId;
        }

        var setTableId = function (tableId) {
            _tableId = tableId;
            _tableIdDirty = true;
        }

        var getValue = function () {
            return valse;
        }

        var setValue = function (value) {
            _value = value;
            _valueDirty = true;
        }

        /*
         * 提交数据到数据库，只对修改标记过的数据进行提交
         * */
        this.submitData = function () {
            if (_tableIdDirty || _valueDirty) {
                console.log("数据没有修改，不需要提交");
                return;
            }

            var param = {};

            if (_tableIdDirty) {
                param.tableId = _tableId;
                _tableIdDirty = false;
            }

            if (_valueDirty) {
                param.value = _value;
                _valueDirty = false;
            }

            // 弹出提交事件
        }
    }

    module.exports = PassiveSkill;

}).call(this);