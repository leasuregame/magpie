var utility = require('../../common/utility');
var Entity = require('./entity');
var configData = require('../../../config/data');
var _ = require("underscore");
var util = require('util');

var Message = (function(_super) {
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
        'createTime',
        'validDate'
    ];
    Message.DEFAULT_VALUES = {
        type: '',
        options: {},
        content: ''
    };

    Message.prototype.toJson = function() {
        if (this.type == configData.message.MESSAGETYPE.BATTLENOTICE) {
            return this.toBattleLogMessage();
        } else if (
            this.type == configData.message.MESSAGETYPE.MESSAGE || 
            this.type = configData.message.MESSAGETYPE.ADDFRIEND
        ) {
            return this.toLeaveMessage();
        } else if (this.type == configData.message.MESSAGETYPE.SYSTEM) {
            return this.toSystemMessage()
        } else {
            return this.toDefaultJson();
        }
    };

    Message.prototype.toDefaultJson = function() {
        return {
            id: this.id,
            msgId: this.msgId,
            sender: this.sender,
            receiver: this.receiver,
            type: this.type,
            status: this.status,
            options: (this.type == configData.message.MESSAGETYPE.BATTLENOTICE || this.type == configData.message.MESSAGETYPE.MESSAGE) ? this.options : void 0,
            content: this.content,
            createTime: this.createTime
        };
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
            content: type == configData.message.MESSAGETYPE.MESSAGE ? '给你留言' : '发来请求',
            createTime: this.createTime
        };
    };

    Message.prototype.toBattleLogMessage = function() {
        return {
            id: this.id,
            defier: this.options.defier || '无名氏',
            isWin: this.options.isWin || false,
            rank: this.options.curRank,
            type: this.type,
            battleLogId: this.options.battleLogId,
            createTime: this.createTime
        };
    };

    Message.prototype.toSystemMessage = function(){
        return {
            id: this.id,
            title: this.options.title || '奖励补偿',
            sender: this.options.sender || '小仙仙',
            status: this.status,
            content: this.content,
            rewards: this.options.rewards,
            type: this.type,
            createTime: this.createTime
        };
    };

    return Message;
})(Entity);

module.exports = Message;