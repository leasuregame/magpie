/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-22
 * Time: 下午3:19
 * To change this template use File | Settings | File Templates.
 */

var queue = [];
var loopQueue = []; //循环队列
var timeTick = 15; // 默认时间戳：30秒
var validTime = 10 * 60; //默认有效时间：10分钟
var len4Queue; //消息队列可容纳长度
var route = 'onSystemMessage';
var msgQueue = module.exports;
var app = null;


msgQueue.init = function(opts) {
    app = opts.app;
    if (opts.timeTick)
        timeTick = opts.timeTick;
    if (opts.vaildTime)
        validTime = opts.validTime;
    len4Queue = validTime / timeTick;
    queue = [];
    loopQueue = [];
    setInterval(msgQueue.dealSendAndLoopQueue, timeTick * 1000);
};

msgQueue.dealSendAndLoopQueue = function() {
    msgQueue.send();
    msgQueue.dealWithLoopQueue();
};

/*
 插入消息: 从后往前扫到第一条优先级不低于本消息的，在其后面插入
 msg = {
     msg  //消息内容
     type //优先级，默认为0，游戏产生，1为系统消息，2为紧急消息
     lastTime4send //最后一次发送时间，循环队列使用
     validDuration //有效时长，循环队列使用（小时）
     tick  //时间间隔，循环队列使用
 }
 */

msgQueue.push = function(msg) {
    if (msg.validDuration && !msg.lastTime4send) {
        msg.lastTime4send = Date.now();
        msg.validDuration = msg.lastTime4send + parseInt(msg.validDuration * 3600 * 1000);
        msg.tick = msg.tick || timeTick;
        msgQueue.pushMsg2LoopQueue(msg);
    }

    if (queue.length == 0) {
        queue.splice(0, 0, msg);
        return;
    }

    for (var i = queue.length - 1; i >= 0; i--) {
        if (queue[i].type >= msg.type) {
            queue.splice(i + 1, 0, msg);
            break;
        }
        if (i == 0) {
            queue.splice(0, 0, msg);
        }
    }

    if (queue.length > len4Queue) {
        msgQueue.pop()
    }
};

msgQueue.pushMsg2LoopQueue = function(msg) {
    loopQueue.push(msg);
};

//处理循环信息队列
msgQueue.dealWithLoopQueue = function() {

    var time = Date.now();
    for (var i = 0; i < loopQueue.length; i++) {
        var msg = loopQueue[i];
        if (time > msg.validDuration) {
            loopQueue.splice(i, 1);
            i--;
        } else if (msg.lastTime4send + msg.tick * 1000 < time) {
            msg.lastTime4send = time;
            msgQueue.push(msg);
        }
    }
};

/*
 删除消息：从头往后扫到第一条优先级与最后一条相同的信息并删除
 type 优先级
 */
msgQueue.pop = function() {
    var type = queue[queue.length - 1].type;

    for (var i = 0; i < queue.length; i++) {
        if (queue[i].type == type) {
            queue.splice(i, 1);
            break;
        }
    }
};

/*
 发送消息
 */
msgQueue.send = function() {

    var m = queue[0];
    if (!m) {
        return;
    }

    var msg = {
        route: route,
        msg: m.msg,
        type: m.type
    };
    queue.splice(0, 1);
    app.get('messageService').pushMessage(msg, function(err, res) {
        if (err) {
            console.log(err);
        }
    });
};