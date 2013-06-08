var memcached_class = require('memcached');
var _ = require('underscore');
//存读时间差问题。。刚load完，另一边调用save

memcached = new memcached_class("127.0.0.1:11211");

function buildStorage() {
  var loading = {};
  var saving = {}; //缓存正在save的数据

  function releaseKeys(keys) {
    for (var i = keys.length - 1; i >= 0; i--) {
      var k = keys[i];
      var cache = saving[k];

      if (cache && (--cache.RefCount == 0)) {
        delete saving[k];
      }
    }
  }

  function addRef(keys) {
    for (var i = keys.length - 1; i >= 0; i--) {
      var k = keys[i];
      var cache = saving[k];

      if (cache) {
        cache.RefCount++;
      }
    }
  }

  function loadKeys(keys, callback) {
    if (!_.isArray(keys)) {
      console.log('loadKeys is not array', keys);
      return callback({
        code: -1,
        msg: '系统错误。'
      });
    }
    var total = keys.length;
    var output = {};
    var newKeys = [];
    for (var i = 0, ii = total; i < ii; i++) {
      var k = keys[i];
      //1.正在保存的最新value，尝试读取
      var cache = saving[k];
      if (cache) {
        output[k] = cache.Value;
        cache.RefCount++;
        total--;
        continue;
      }

      //2.是否已有请求该key的请求。
      var cache = loading[k];
      if (cache) {
        cache.push(createLoadingCallback(k));
        continue;
      }

      //3.加入下载的key数组
      newKeys.push(k);
    };
    //4.检查是否全部key都加载完成。
    if (total == 0) {
      setTimeout(function() {
        callback(null, output);
      }, 0);

      return;
    }
    //5.如果还有需要加载的。启动加载。
    if (newKeys.length > 0) {
      for (var i = newKeys.length - 1; i >= 0; i--) {
        var k = newKeys[i];
        loading[k] = [createLoadingCallback(k)];
      };
      //console.log('memcached.getMulti',newKeys);
      memcached.getMulti(newKeys, function(err, result) {
        //转换json，和分发
        //console.log(err,result);
        for (var i = 0, ii = newKeys.length; i < ii; i++) {
          var key = newKeys[i];
          var callbacks = loading[key];
          delete loading[key];
          if (err) { //出错了。向所有callback发送
            for (var j = 0, jj = callbacks.length; j < jj; j++) {
              callbacks[j](err);
            };
            continue;
          }
          var v = result[key];
          if (!v) { //如果不存在。返回null
            result[key] = null;
          } else {
            if (_.isString(v)) {
              v = result[key] = JSON.parse(v); //cmem不需要转换。
            }
            saving[key] = {
              Value: v,
              RefCount: callbacks.length,
              callbacks: []
            };
          }

          for (var j = 0, jj = callbacks.length; j < jj; j++) {
            callbacks[j](null, result); //每次callback都可能更改数据。每次都返回最新数据。
          };
        };
      });
    }
    var onlyCallbackOnce = callback;

    function createLoadingCallback(key) {
      return function(err, result) {
        if (err && onlyCallbackOnce) {
          onlyCallbackOnce(err);
          onlyCallbackOnce = null;
        } else if (!onlyCallbackOnce) {
          return; //已经callback一个错误了。不再执行。
        }
        //output[key] = saving[key] || result[key];
        total--;
        if (total == 0) {
          for (var i = 0, ii = keys.length; i < ii; i++) {
            var k = keys[i];
            var val = saving[k];
            output[k] = val ? val.Value : null; //重新获得最新值
          }
          callback(null, output);
        }
      }
    }
  }

  function saveByKey(key, value, callback) {
    //1.判断是否已有写入在进行。
    var cache = saving[key];
    if (!cache) {
      //必须先调用过loadkey？不然RefCount不好管理，saving和已读取的分开管理也不方便。根据实际调用来说。基本都是先load再save。
      setTimeout(function() {
        callback({
          code: -1,
          msg: '未加载或加载失败只能add，不能save'
        });
      }, 0); //异步执行。防止外部未完成。
      return;
    } 
    cache.Value = value; //保存最新value
    var cbs = cache.callbacks;
    cbs.push(callback); //cache建立之际保证了callbacks数组的存在。
    if (cbs.length == 1) {
      //只有自己。表示没有其他save在执行。所以启动保存。
      (function save() {
        var cbs = cache.callbacks; //保存回调列表
        if (cbs.length == 0) return; //没有需要save。退出
        cache.callbacks = []; //删除回调，

        //执行保存，获得最新的value，而key在闭包内一直不变，
        var v = cache.Value;
        memcached.set(key, v, -1, function(err, result) {
          for (var i = 0, ii = cbs.length; i < ii; i++) {
            cbs[i](err, result);
          };

          save(); //再调用一次save执行后续的保存动作。
        });
      })();
    }
  }

  function addKey(key, value, callback) {
    memcached.add(key, value, -1, callback);
  }

  function incKey(key, callback) {
    memcached.incr(key, 1, callback);
  }

  function queryKeys(keys, callback) {
    loadKeys(keys, function(err, result) {
      releaseKeys(keys);
      callback(err, result);
    });
  }
  return {
    add: addKey,
    save: saveByKey,
    load: loadKeys,
    query: queryKeys,
    release: releaseKeys,
    addRef: addRef,
    inc: incKey,
  }
};
var storages = {};
module.exports = function(key) {
  if (!key) key = '_';
  return (storages[key] = storages[key] || buildStorage());
}