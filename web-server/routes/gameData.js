var tableData = require('../data/table.json');
var filter = require('../util/filter');
var CONSUMPTION_SOURCE_NAME = require('../data/record').CONSUMPTION_SOURCE_NAME;
var _ = require('underscore');

var datakeys = {
    CARDS : 'cards',
    CARD_LV_LIMIT : 'card_lv_limit',
    CDKEY: 'cdkey'
};

var ACTOR_CARD_TV = 10000;
var EXP_CARD_TABLEIDS = [50001,50002,50003,50004,50005];

var gameData = function(app) {

    var getGameData = function (key) {
        return tableData.outputTables[key].rows;
    };

    var getExpCardData = function () {
        var result = {};
        var cards = getGameData(datakeys.CARDS);
        EXP_CARD_TABLEIDS.forEach(function(id) {
            result[id] = cards['' + id];
        });
        return result;
    };

    /**
     * 获取所有角色(神仙+经验元灵)卡
     * @param req
     * @param res
     */
    app.all('/admin/api/getActorCards', filter.authorize, function (req, res) {
        var cardsTable = getGameData(datakeys.CARDS);
        var retCards = {};
        // 加入经验卡
        _.extend(retCards, getExpCardData());
        // 加入神仙卡
        for (var key in cardsTable) {
            key *= 1;
            if (key < ACTOR_CARD_TV) {
                retCards[key] = cardsTable[key];
            } else {
                break;
            }
        }
        res.send(retCards);
    });

    /**
     * 获取角色卡等级上限
     * @param req
     * @param res
     */
    app.all('/admin/api/getCardLv', filter.authorize, function (req, res) {
        var cllTable = getGameData(datakeys.CARD_LV_LIMIT);
        res.send(cllTable);
    });

    /**
     * 获取魔石消费记录来源
     */
    app.all('/admin/api/getConsumeSource', filter.authorize, function (req, res) {
        res.send(CONSUMPTION_SOURCE_NAME);
    });

    /**
     * 获取激活码类型
     */
    app.get('/admin/api/cdkeytypes', filter.authorize, function(req, res) {
        var cdkeys = getGameData(datakeys.CDKEY);
        res.send(cdkeys != 'undefined' ? _.keys(cdkeys) : []);
    });


};

module.exports = gameData;