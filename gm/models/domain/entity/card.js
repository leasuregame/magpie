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


var utility = require('../../common/utility');
var Entity = require('./entity');
var table = require('../../manager/table');
var _ = require("underscore");


/*
 * Card 与 card 表对应的数据类，提供简单操作
 * @param {object} param 数据库 card 表中的一行记录
 * */
var Card = (function(_super) {
    utility.extends(Card, _super);

    function Card(param) {
        Card.__super__.constructor.apply(this, arguments);

    }

    Card.FIELDS = [
        'id',
        'createTime',
        'playerId',
        'tableId',
        'star',
        'lv',
        'exp',
        'skillLv',
        'factor',
        'skillPoint',
        'elixirHp',
        'elixirAtk'
    ];

    Card.DEFAULT_VALUES = {
        star: 1,
        lv: 1,
        exp: 0,
        skillLv: 1,
        factor: 0,
        skillPoint: 0,
        elixirHp: 0,
        elixirAtk:0,
        init_hp: 0,
        init_atk: 0,
        hp: 0,
        atk: 0,
        incs: {
            spirit_hp: 0,
            spirit_atk: 0,
            ps_hp: 0,
            ps_atk: 0,
            elixir_hp: 0,
            elixir_atk: 0
        }
    };

    Card.prototype.init = function() {
        this.passiveSkills = this.passiveSkills || {};
    };

    Card.prototype.toJson = function() {
        return {
            id: this.id,
            createTime: this.createTime,
            playerId: this.playerId,
            tableId: this.tableId,
            init_hp: this.init_hp,
            init_atk: this.init_atk,
            hp: this.hp,
            atk: this.atk,
            incs: this.incs,
            star: this.star,
            lv: this.lv,
            exp: this.exp,
            skillLv: this.skillLv,
            skillPoint: this.skillPoint,
            elixir: this.elixir,
            passiveSkills: this.passiveSkills
        };
    };

    return Card;
})(Entity);

module.exports = Card;