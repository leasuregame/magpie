/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-3
 * Time: 下午5:45
 * To change this template use File | Settings | File Templates.
 */

var log4js = require('log4js');
var path = require("path");
var dirName = "./logs/";

log4js.configure({
    appenders:[
        {
            type:'console'
        },
        {
            type:'file',
            filename:path.join(dirName,'index.log'),
            maxLogSize:1048576,
            backups:4,
            reloadSecs:30,
            category:'index'
        },
        {
            type:'file',
            filename:path.join(dirName,'user.log'),
            maxLogSize:1048576,
            backups:4,
            reloadSecs:30,
            category:'user'
        },
        {
            type:'file',
            filename:path.join(dirName,'player.log'),
            maxLogSize:1048576,
            backups:4,
            reloadSecs:30,
            category:'player'
        },
        {
            type:'file',
            filename:path.join(dirName,'card.log'),
            maxLogSize:1048576,
            backups:4,
            reloadSecs:30,
            category:'card'
        },
        {
            type:'file',
            filename:path.join(dirName,'rank.log'),
            maxLogSize:1048576,
            backups:4,
            reloadSecs:30,
            category:'rank'
        },
        {
            type:'file',
            filename:path.join(dirName,'daoBase.log'),
            maxLogSize:1048576,
            backups:4,
            reloadSecs:30,
            category:'daoBase'
        },
        {
            type:'file',
            filename:path.join(dirName,'msgPush.log'),
            maxLogSize:1048576,
            backups:4,
            reloadSecs:30,
            category:'msgPush'
        },
        {
            type:'file',
            filename:path.join(dirName,'reward.log'),
            maxLogSize:1048576,
            backups:4,
            reloadSecs:30,
            category:'reward'
        }

    ],
    replaceConsole:true
});



//log4js.connectLogger(log4js.getLogger('normal'), {level:'auto', format:':method :url'})



exports.logger = function(name) {
    var logger = log4js.getLogger(name);
    //logger('normal');
    logger.setLevel('info');
    return logger;
};


