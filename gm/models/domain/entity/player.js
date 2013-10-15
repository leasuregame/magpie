/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-25
 * Time: 下午3:54
 * To change this template use File | Settings | File Templates.
 */


/*
 * player
 * */


var utility = require('../../common/utility');
var Entity = require('./entity');
var table = require('../../manager/table');
var _ = require("underscore");
var express = require('express');

var log4js = require('log4js');
var logger = log4js.getLogger();
var Card = require('./card');

var defaultMark = function() {
    var i, result = [];
    for (i = 0; i < 100; i++) {
        result.push(0);
    }
    return result;
};

var NOW = function() {
    return Date.now();
};


/*
 * Player 与 player 表对应的数据类，提供简单操作
 * @param {object} param 数据库 player 表中的一行记录
 * */
var Player = (function(_super) {
    utility.extends(Player, _super);

    function Player(param) {
        Player.__super__.constructor.apply(this, arguments);
    }

    Player.prototype.init = function() {
        this.cards || (this.cards = {});
        this.rank || (this.rank = {});

        addEvents(this);
    };

    Player.FIELDS = [
        'id',
        'createTime',
        'userId',
        'areaId',
        'name',
        'power',
        'lv',
        'exp',
        'money',
        'gold',
        'skillPoint',
        'lineUp',
        'ability',
        'task',
        'pass',
        'dailyGift',
        'fragments',
        'energy',
        'elixir',
        'spiritor',
        'spiritPool'
    ];

    Player.DEFAULT_VALUES = {
        power: {
            time: 0,
            value: 50
        },
        lv: 1,
        exp: 0,
        money: 1000,
        gold: 50,
        lineUp: '12:-1',
        ability: 0,
        task: {
            id: 1,
            progress: 0,
            hasWin: false
        },
        pass: {
            layer: 0,
            mark: defaultMark()
        },
        dailyGift: [],
        fragments: 0,
        energy: 0,
        elixir: 0,
        skillPoint: 0,
        spiritor: {
            lv: 0,
            spirit: 0
        },
        spiritPool: {
            lv: 0,
            exp: 0,
            collectCount: 0
        },
        cards: {},
        rank: {}

    };


    Player.prototype.toJson = function() {
        return {
            id: this.id,
            createTime: this.createTime,
            userId: this.userId,
            areaId: this.areaId,
            name: this.name,
            power: this.power,
            lv: this.lv,
            exp: this.exp,
            money: this.money,
            gold: this.gold,
            lineUp: this.lineUpObj(),
            ability: this.getAbility(),
            task: this.task,
            pass: checkPass(this.pass),
            dailyGift: this.dailyGift,
            skillPoint: this.skillPoint,
            energy: this.energy,
            fregments: this.fregments,
            elixir: this.elixir,
            spiritor: this.spiritor,
            spiritPool: this.spiritPool,
            cards: _.values(this.cards).map(function(card) {
                return card.toJson();
            }),
            rank: !_.isEmpty(this.rank) ? this.rank.toJson() : null
        };
    };

    return Player;
})(Entity);

var checkPass = function(pass) {
    if (typeof pass !== 'object') {
        pass = {
            layer: 0,
            mark: defaultMark()
        };
    }
    return pass;
};

module.exports = Player;