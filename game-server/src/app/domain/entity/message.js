var utility = require('../../common/utility');
var Entity = require('./entity');
var _ = require("underscore");
var util = require('util');

var Message = (function (_super) {
    utility.extends(Message, _super);

    function Message(param) {
        Message.__super__.constructor.apply(this, arguments);
    }

    Message.FIELDS = [
        'id',
        'msgId',
        'sender',
        'receiver',
        'type',
        'status',
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
            msgId: this.msgId,
            sender: this.sender,
            receiver: this.receiver,
            type: this.type,
            status: this.status,
            options: this.options,
            content: this.content,
            createTime: this.createTime
        }
    };

    Message.prototype.toLeaveMessage = function() {
        return {
            id: this.id,
            sender: this.sender,
            senderName: this.options.playerName,
            receiver: this.receiver,
            type: this.type,
            status: this.status,
            text: this.content,
            content: util.format('%s 给你发了一条留言', this.options.playerName),
            createTime: this.createTime
        };
    };

    return Message;
})(Entity);

module.exports = Message;