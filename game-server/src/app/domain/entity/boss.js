var utility = require('../../common/utility');
var Entity = require('./entity');
var _ = require("underscore");
var table = require('../../manager/table');

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
        'createTime'
    ];

    Boss.DEFAULT_VALUES = {
        atkCount: 0,
        status: 1
    };

    Boss.prototype.countLeft = function(){
        var bossData = table.getTableItem('boss', this.tableId);
        return _.max([bossData.atk_count - this.atkCount, 0]);
    };

    Boss.prototype.timeLeft = function(){
        var bossData = table.getTableItem('boss', this.tableId);
        var t = this.createTime + (bossData.live_time || 12) * 60 * 60 * 1000 - new Date().getTime();
        return t < 0 ? 0 : t;
    };

    Boss.prototype.toJson = function(){
        
        return {
            bossId: this.id,
            playerId: this.playerId,
            tableId: this.tableId,
            countLeft: this.countLeft(),
            status: this.status,
            timeLeft: this.timeLeft()
        };
    };

    return Boss;
})(Entity);

module.exports = Boss;