/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-1
 * Time: 下午5:46
 * To change this template use File | Settings | File Templates.
 */

var cardDao = require('./dao/mysql/cardDao');
var async = require('async');
var table = require('./manager/table');

function Card() {
};

Card.table = "cards";

Card.update = function (data, cb) {

    console.log(data);
    var card = {
        where: {
            id: data.id
        },
        data: {
            lv: data.lv,
            skillLv: data.skillLv,
            elixirHp: data.elixirHp,
            elixirAtk: data.elixirAtk,
            star: data.star,
            tableId: data.tableId,
            passiveSkills: data.passiveSkills
        }
    };

    cardDao.update(card, function (err, isOK) {
        if (err) {
            console.log(err);
            return cb(err, null);
        } else {
            var name = Card.getName(data.tableId);
            return cb(null, name);
        }
    });


};


Card.create = function (card, cb) {

    if (Card.isTableIdExist(card.tableId) == false) {
        return cb('tableIdError', null);
    }
    else {
        var options = {
            data: card
        };

        options.data['createTime'] = Date.now();

        async.waterfall([
            function (callback) {
                genSkillInc(options.data);
                console.log("after genSkillInc:", options.data);
                callback();
            },
            function (callback) {
                cardDao.create(options, function (err, card) {
                    if (err) {
                        return cb(err, null);
                    }
                    else callback(null, card);
                });
            },
            function (card, callback) {
                var cardId = card["insertId"];
                var options = {
                    where: {
                        id: cardId
                    }
                };
                cardDao.getCardInfo(options, function (err, card) {

                    if (err) {
                        return cb(err, null);
                    } else {

                        card.name = Card.getName(card.tableId);
                        console.log(card);
                        callback(null, card);
                    }
                });

            }

        ], function (err, card) {
            if (err) {
                return cb(err, null);
            } else {
                return cb(null, card);
            }
        });
    }
};

Card.delete = function (cardId, cb) {

    var options = {
        where: {
            id: cardId
        }
    };

    cardDao.delete(options, function (err, isOK) {
        if (err) {
            console.log(err);
            return cb(err, false);
        } else {
            return cb(null, true);
        }
    });
};

Card.isTableIdExist = function (tableId) {
    var data = table.getTableItem(Card.table, tableId);
    if (data) {
        return true;
    }
    return false;
};

Card.getName = function (tableId) {
    var data = table.getTableItem(Card.table, tableId);
    return data.name;
};

Card.setCardsName = function (cards) {
    cards.forEach(function (card) {
        card.name = Card.getName(card.tableId);
    });
};


var genSkillInc = function (card) {
    card.factor = _.random(1, 1000);
    // var cdata, max, min, skill;
    // if (card.star < 3)
    //     return;
    // cdata = table.getTableItem('cards', card.tableId);
    // skill = cdata.skill_id_linktarget;
    // if (skill != null) {
    //     min = skill["star" + card.star + "_inc_min"] * 10;
    //     max = skill["star" + card.star + "_inc_max"] * 10;
    //     return card.skillInc = _.random(min, max) / 10;
    // } else {
    //     throw new Error('can not file skill info of card: ' + card.tableId);
    // }
};


module.exports = Card;




