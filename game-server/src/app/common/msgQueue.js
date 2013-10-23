/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-22
 * Time: 下午3:19
 * To change this template use File | Settings | File Templates.
 */

var queue = [];
var loopQueue = []; //循环队列
var timeTick = 30; // 默认时间戳：30秒
var validTime = 10 * 60; //默认有效时间：10分钟
var len4Queue; //消息队列可容纳长度
var route = 'onSystemMessage';
var msgQueue = module.exports;
var app = null;
var oldTime = 0;

msgQueue.init = function(opts) {
    app = opts.app;
    if(opts.timeTick)
        timeTick = opts.timeTick;
    if(opts.vaildTime)
        validTime = opts.validTime;
    len4Queue = validTime / timeTick;
    queue = [];
    loopQueue = [];
    oldTime = Date.now();
    setInterval(msgQueue.send,timeTick * 1000);
};

/*
 插入消息: 从后往前扫到第一条优先级不低于本消息的，在其后面插入
 msg = {
     msg  //消息内容
     type //优先级，默认为0，游戏产生，1为系统消息，2为紧急消息
     lastTime4send //最后一次发送时间，循环队列使用
     validDuration //有效时长，循环队列使用
     tick  //时间间隔，循环队列使用
 }
 */

msgQueue.push = function(msg) {

    if(queue.length == 0) {
        queue.splice(0, 0 ,msg);
        return;
    }

    for(var i = queue.length - 1;i >= 0;i--) {
        if(queue[i].type >= msg.type) {
            queue.splice(i + 1, 0 ,msg);
            break;
        }
        if(i == 0) {
            queue.splice(0, 0, msg);
        }
    }

    if(queue.length > len4Queue) {
        msgQueue.pop()
    }

    console.log('queue = ',queue);
};

/*
 删除消息：从头往后扫到第一条优先级与最后一条相同的信息并删除
 type 优先级
 */
msgQueue.pop = function() {
    var type = queue[queue.length- 1].type;

    for(var i = 0;i < queue.length;i++) {
        if(queue[i].type == type) {
            queue.splice(i,1);
            break;
        }
    }
};

/*
 发送消息
 */
msgQueue.send = function() {

    var m = queue[0];
    if(!m) {
        return;
    }

    var msg = {
        route: route,
        msg: m.msg
    };
    oldTime = Date.now() - oldTime;
    console.log('***send*** time: ',oldTime, 'msg: ',msg);
    queue.splice(0,1);
    app.get('messageService').pushMessage(msg,function(err,res){
        if(err) {
            console.log(err);
        }
    });
};


