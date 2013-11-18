/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-4
 * Time: 下午3:36
 * To change this template use File | Settings | File Templates.
 */


/*
 * 抽卡
 * */

var cardConfig = require('../../config/data/card');
var utility = require('../common/utility');
var Card = require('../domain/entity/card');
var table = require('../manager/table');
var _ = require("underscore");


var lottery = function (level, type, rFragments, hFragment, hCounts) {
    var card = newCard(level, hCounts);
    var fragment = gen_card_fragment(level, rFragments, hFragment);
    var consume_val = consume(level, type);
    //var pss = initPassiveSkill(card.star);

    return [card, consume_val, fragment];
};

var freeLottery = function(level, eids) {
    if (eids == null || !_.isArray(eids)){
        eids = [];
    }

    var star = level == 1 ? 3 : 4;
    var card = freeCard(star);
    while (eids.indexOf(card.tableId) > -1) {
        card = freeCard(star);
    }
    return [card, 0, 0];
};

/*
 * 抽卡，传入参数抽卡种类
 * 1：普通抽卡
 * 2：高级抽卡
 * */
var randomCardId = function (star) {
    return _.random(0, 49) * 5 + star;
};

var gen_card_star = function (level, hCounts) {
    var levelMapping = {
        "1": "LOWER",
        "2": "HIGHT"
    };
    var rateObj = utility.deepCopy(cardConfig.STAR[levelMapping[level]]);
    var margins = cardConfig.HIGHT_DRAWCARD_MARGIN;

    console.log('before count',rateObj);

    if (level == 2) { //高级抽卡特殊处理

        if (hCounts == cardConfig.MAX_HIGHT_DRAWCARD_COUNT) {
            rateObj['3'] = rateObj['4'] = 0;
            rateObj['5'] = 100;
        } else {

            for(var i = margins.length - 1; i >= 0;i--) {
                if(hCounts >= margins[i].COUNTS) {
                    var ms = margins[i];
                   // console.log('ms =',ms);
                    var count = hCounts - ms.COUNTS;
                    var rate = ms.MARGIN * count;
                    rateObj['3'] = ms['3'] - rate;
                    if(rateObj['3'] < 0) {
                        rateObj['4'] = ms['4'] + rateObj['3'];
                        rateObj['3'] = 0;
                    }

                    rateObj['5'] = ms['5'] + rate;
                    break;
                }
            }

            console.log('hCounts =',hCounts, 'after count...', rateObj['3'],rateObj['4'],rateObj['5']);
        }

    }

    console.log('after count',rateObj);

    return utility.randomValue(_.keys(rateObj), _.values(rateObj));
};

var gen_card_level = function (star) {
    if (star >= 3) {
        return cardConfig.HIGHT_LEVEL_INIT;
    }

    var levelInitObj = cardConfig.LOWER_LEVEL_INIT;
    return utility.randomValue(_.keys(levelInitObj), _.values(levelInitObj));
};

var gen_card_fragment = function (level, rCounts, hCounts) {

    var margin = utility.deepCopy(cardConfig.FRAGMENT[level]);
    var counts = (level == 1) ? rCounts : hCounts;
    console.log('counts',counts)
    counts = counts - margin.COUNTS;
    var rate = (counts <= 0 ) ? 0 : counts * margin.MARGIN;
    console.log('rate',rate);
    return utility.hitRate(rate) ? 1 : 0;
};

var newCard = function (level, hCounts) {
    var card_star = parseInt(gen_card_star(level, hCounts));
    var card_id = randomCardId(card_star);
    var card_level = parseInt(gen_card_level(card_star));

    return {
        tableId: card_id,
        star: card_star,
        lv: card_level
    };
};

var freeCard = function(star) {
    var idMap = {
        3: [13, 43, 48, 28, 148, 153, 183, 123, 18],
        4: [59, 99, 129]
    };
    return {
        tableId: idMap[star][_.random(0, idMap[star].length-1)],
        star: star,
        lv: parseInt(gen_card_level(star))
    };
};

var consume = function (level, type) {
    var mapping = cardConfig.LOTTERY_CONSUME;
    return mapping[type][level]
};

var initPassiveSkill = function (star) {
    var count = star - 2;

    var results = [];
    for (var i = 0; i < count; i++) {
        var index = _.random(cardConfig.PASSIVESKILL.TYPE.length - 1);
        var _res = cardConfig.PASSIVESKILL.VALUE_SCOPE.split('-');
        var start = parseInt(_res[0]), end = parseInt(_res[1]);
        results.push({
            name: cardConfig.PASSIVESKILL.TYPE[index],
            value: _.random(start, end)
        })
    }
    return results;
};

module.exports = {
    lottery: lottery,
    freeLottery: freeLottery
};