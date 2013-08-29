var utility = require('../../common/utility');
var Entity = require('./entity');
var _ = require("underscore");

var Message = (function (_super) {
    utility.extends(Message, _super);

    function Message(param) {
        Message.__super__.constructor.apply(this, arguments);
    }

    Message.FIELDS = [
        'id',
        'playerId',
        'type',
        'options',
        'content',
        'createTime'
    ];
    Message.DEFAULT_VALUES = {
        type: '',
        options: {},
        content: ''
    };

    Message.prototype.toJson = function(){
        return {
            id: this.id,
            playerId: this.playerId,
            type: this.type,
            status: this.status,
            options: this.options,
            content: this.content,
            createTime: this.createTime
        }
    };

    return Message;
})(Entity);

module.exports = Message;