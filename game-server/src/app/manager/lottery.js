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


var _ = require("underscore");

var lottery = function() {
    var cardList1 = [];
    var cardList2 = [];
    var cardList3 = [];

    for(var i = 1; i <= 250; ++i) {
        var index = (i - 1) % 5;

        if(index >= 0 && index <= 2) {
            cardList1.push(i);
        }

        if(index >= 1 && index <= 3) {
            cardList2.push(i);
        }

        if(index >= 2 && index <= 4) {
            cardList3.push(i);
        }
    }

    var getRandomCard = function(cardList) {
        var len = cardList.length;

        return cardList(0, len - 1);
    }

    this.lottery = function(level) {
        if(level == 1) {
            return getRandomCard(cardList1);
        }

        if(level == 2) {
            return getRandomCard(cardList2);
        }

        if(level == 3) {
            return getRandomCard(cardList3);
        }

        return 0;
    }
}