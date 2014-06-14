var filter = require('../util/filter');
var tableData = require('../data/table.json');
var CONSUMPTION_SOURCE_NAME = require('../data/record').CONSUMPTION_SOURCE_NAME;

var datakeys = {
    CARDS : 'cards',
    CARD_LV_LIMIT : 'card_lv_limit'
};

var ACTOR_CARD_TV = 10000;
var EXP_CARD_TABLEID = 30000;

var gameData = function(app) {

    var getGameData = function (key) {
        return tableData.outputTables[key].rows;
    };

    var getExpCardData = function () {
        return getGameData(datakeys.CARDS)['' + EXP_CARD_TABLEID];
    }

    /**
     * 获取所有角色(神仙+经验元灵)卡
     * @param req
     * @param res
     */
    app.all('/admin/api/getActorCards', filter.authorize, function (req, res) {
        var cardsTable = getGameData(datakeys.CARDS);
        var retCards = {};
        // 加入经验卡
        retCards['' + EXP_CARD_TABLEID] = getExpCardData();
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

};

module.exports = gameData;