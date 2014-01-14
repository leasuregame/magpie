var utility = require('../../common/utility');
var Entity = require('./entity');
var _ = require("underscore");
var util = require('util');

var GoldCard = (function(_super) {
    utility.extends(GoldCard, _super);

    function GoldCard(param) {
        GoldCard.__super__.constructor.apply(this, arguments);
    }

    GoldCard.FIELDS = ['id', 'orderId', 'orderNo', 'playerId', 'type', 'flag', 'created', 'validDate'];
    GoldCard.DEFAULT_VALUES = {
        flag: 0,
        type: ''
    };

    GoldCard.prototype.daysRemaining = function(dateString) {
        var today = new Date(dateString || new Date().toDateString());
        var validDate = new Date(this.validDate);
        var days = (validDate - today)/(1000*60*60*24);
        return days>=0 ? days+1 : 0;
    };

    GoldCard.prototype.setFlag = function() {
        if (this.daysRemaining() <= 0) {
            return;
        }
        var days = getDays(this.created);
        this.set('flag', utility.mark(parseInt(this.flag), days).toString());
    };

    GoldCard.prototype.hasFlag = function() {
        return utility.hasMark(parseInt(this.flag), getDays(this.created));
    };

    GoldCard.prototype.toJson = function() {
        return {
            id: this.id,
            type: this.type,
            remainingDays: this.daysRemaining(),
            hasGot: this.hasFlag()
        };
    };

    return GoldCard;
})(Entity);

var getDays = function(created) {
    var today = new Date(new Date().toDateString());
    var cdata = new Date(created);
    var days = (today - cdata)/(1000*60*60*24);
    return days+1;
};

module.exports = GoldCard;