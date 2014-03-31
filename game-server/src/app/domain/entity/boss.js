var utility = require('../../common/utility');
var Entity = require('./entity');
var _ = require("underscore");
var table = require('../../manager/table');
var configData = require('../../../config/data');

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
        'finder',
        'killer', 
        'hp',
        'status',
        'createTime',
        'deathTime'
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

    Boss.prototype.isDisappear = function(){
        var bossData = table.getTableItem('boss', this.tableId);

        var nature_disppear = this.createTime + (bossData.live_time + bossData.disappear_time) * 60 * 60 * 1000 < new Date().getTime();
        if (nature_disppear) return true;

        if (this.deathTime) {
            var death_disppear = this.deathTime + bossData.disappear_time * 60 * 60 * 1000 < new Date().getTime();
            return death_disppear;
        } else {
            return false;
        }
    };

    Boss.prototype.isDeath = function() {
        var hp = this.hp;
        var total_hp = 0;
        if (_.isObject(hp)){            
            _.values(hp).forEach(function(item) {
                if (!_.isUndefined(item.hp) && item.hp > 0) {
                    total_hp += item.hp;
                }
            });
        }

        return total_hp == 0 || this.status == configData.bossStatus.STATUS.DEATH;
    };

    Boss.prototype.updateHp = function(key, hp) {
        var hp_obj = utility.deepCopy(this.hp);
        hp_obj[key].hp = _.max([hp, 0]);
        this.hp = hp_obj;
    };

    Boss.prototype.toJson = function(){
        
        return {
            bossId: this.id,
            playerId: this.playerId,
            finder: this.finder,
            killer: this.killer,
            tableId: this.tableId,
            countLeft: this.countLeft(),
            status: this.status,
            timeLeft: this.timeLeft()
        };
    };

    return Boss;
})(Entity);

module.exports = Boss;