/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-27
 * Time: 下午5:17
 * To change this template use File | Settings | File Templates.
 */


/*
* card list
* */


var CardList = Entity.extend({
    _cardList : {},

    init : function() {

    },

    push: function(card) {
        this._cardList[card.get("id")] = card;
    },

    getCardByIndex : function(index) {
        return this._cardList[index];
    },

    update: function() {

    }
})


CardList.create = function() {
    var cardList = new CardList();

    if(cardList && cardList.init()) {
        return cardList;
    }

    return null;
}