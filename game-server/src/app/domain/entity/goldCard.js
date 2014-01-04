var utility = require('../../common/utility');
var Entity = require('./entity');
var _ = require("underscore");
var util = require('util');

var GoldCard = (function(_super) {
    utility.extends(GoldCard, _super);

    function GoldCard(param) {
        GoldCard.__super__.constructor.apply(this, arguments);
    }

    GoldCard.FIELDS = ['id', 'orderId', 'playerId', 'type', 'flag', 'created', 'validDate'];
    GoldCard.DEFAULT_VALUES = {
        flag: 0,
        type: ''
    };

    GoldCard.prototype.toJson = function() {
        return {
            id: this.id,
            orderId: this.orderId,
            playerId: this.playerId,
            type: this.type,
            flag: this.flag,
            created: this.created,
            validDate: this.validDate
        };
    };

    return GoldCard;
})(Entity);

module.exports = GoldCard;