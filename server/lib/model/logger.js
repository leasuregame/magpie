var _ = require('underscore');
var fs = require('fs');
//module.exports = log4js.getLogger('game');
var logger = (function createLogger() {
  // 文件名
  var app = process.argv[1] || '';
  var pid = process.pid;

  var filename = app.split('/').pop().split('.')[0] + '_' + date2str(new Date(), 'MM-dd-hh-mm-ss') + '_' + Math.floor(Math.random() * 1000000) + '.log';
  var filepath = './log/' + filename;
  try {
    fs.mkdirSync('./log');
  } catch (e) {};
  console.log('logfile:', filepath);
  var filestream = fs.createWriteStream(filepath, {
    flags: 'w',
    encoding: 'utf8',
    mode: 0666
  });
  var log_list = [];
  //var bWritting = false;
  filestream.on('drain', function() {
    writeToFile();
  }).on('error', function() {
    console.error('write log file fail');
  });

  function date2str(x, y) {
    var z = {
      M: x.getMonth() + 1,
      d: x.getDate(),
      h: x.getHours(),
      m: x.getMinutes(),
      s: x.getSeconds(),
      u: x.getMilliseconds()
    };
    y = y.replace(/(M+|d+|h+|m+|s+|u+)/g, function(v) {
      return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
    });
    return y.replace(/(y+)/g, function(v) {
      return x.getFullYear().toString().slice(-v.length)
    });
  }

  function format(arg) {
    if (_.isObject(arg)) {
      return JSON.stringify(arg);
    } else if (_.isNumber(arg)) {
      return arg.toString();
    } else if (_.isString(arg)) {
      return arg;
    } else if (_.isBoolean(arg)) {
      return arg.toString();
    } else if (_.isUndefined(arg)) {
      return 'undefined';
    } else if (_.isArray(arg)) {
      var outstr = '[';
      for (var i = 0, ii = arg.length; i < ii; i++) {
        outstr += format(arg[i]);
        if (i != arg.length - 1) outstr += ', ';
        else outstr += ']';
      };
      return outstr;
    }

    return arg;
  }

  function buildLog(type, args) {
    var arowlog = [date2str(new Date(), "[yyyy-MM-dd hh:mm:ss.uu]"), type];
    for (var i = 0, ii = args.length; i < ii; i++) {
      arowlog.push(format(args[i]));
    };
    arowlog.push('\n');
    return arowlog.join(' '); //空格连接
  }

  function writeToFile() {
    if (filestream.writable) {
      var str = log_list.shift();
      if (str) {
        filestream.write(str);
      }
    }
  }

  function writeLog(type, args) {
    log_list.push(buildLog(type, args));
    //buffer.write(buildLog(type,args));
    //if (bWritting) 
    //return;
    //bWritting = true;
    writeToFile();
  }
  writeLog('info', '启动logger.');
  return {
    log: writeLog
  };

})(); //
module.exports = {
  log: function() {
    //console.log.apply(console, arguments);
    logger.log('log', arguments);
  },
  info: function() {
    //console.info.apply(console, arguments);
    logger.log('info', arguments);
  }
};