/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-27
 * Time: 下午5:17
 * To change this template use File | Settings | File Templates.
 */

/*
*
* */

var CardList = function() {
    this.cardList = [];

    this.init = function() {

    }

    this.insert = function(databaseId, id, level, skillLevel) {
        list.push(Card.create(databaseId, id, level, skillLevel));
    }
}

CardList.create = function(cardList) {
    var list = new CardList();
    var len = cardList.length;

    for(var i = 0; i < len; ++i) {
        list.push(Card.create(cardList.databaseId, cardList.id, cardList.level, cardList.skillLevel));
    }

    return list;
}