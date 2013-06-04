// Generated by CoffeeScript 1.6.2
var exports, log4js;

log4js = require('log4js');

log4js.configure({
  appenders: [
    {
      category: "battle-log",
      type: "console"
    }, {
      category: "battle-log",
      type: "file",
      filename: "battle-log.log"
    }
  ]
});

exports = module.exports = log4js.getLogger('battle-log');
