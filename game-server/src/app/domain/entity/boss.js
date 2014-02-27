var utility = require('../../common/utility');
var Entity = require('./entity');
var _ = require("underscore");

var Boss = (function (_super) {
    utility.extends(Boss, _super);

    function Boss(param) {
        Boss.__super__.constructor.apply(this, arguments);
    }

    Boss.FIELDS = [
        'id',
        'tableId',
        'playerId',
        'atkCount',
        'hp',
        'status',
        'created'
    ];

    Boss.DEFAULT_VALUES = {
        atkCount: 0,
        hp: 0,
        status: 1
    };

    Boss.prototype.toJson = function(){
        return {
            id: this.id,
            playerId: this.playerId,
            tableId: this.tableId,
            atkCount: this.atkCount,
            hp: this.hp,
            status: this.status,
            created: this.created
        };
    };

    return Boss;
})(Entity);

module.exports = Boss;