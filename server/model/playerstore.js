var storage = require('./storage')()
  , Err = require('./error')
  , t = require('./utility').t
  , newguid = require('./utility').guid;

function createLRU() {
  var lru_players = {};
  var lru_player_count = 0;
  var lru_first = null;
  var lru_last = null;
  var lru_max = 4000;
  var lru_min = 3500;
  var lru_min_time = 30*1000;//30秒

  function LRU_add(id,data) {
    var infos = lru_players[id];
    if (infos) {
      infos.t = t();//更新最后时间
      infos.prev && (infos.prev.next = infos.next);
      infos.next && (infos.next.prev = infos.prev);
      if (data) {
        infos.data = data;
      }
    } else {
      lru_player_count ++;
      infos = lru_players[id] = {t:t(),id:id,data:data};
    }
    if (lru_last) {
      lru_last.next = infos;
      infos.prev = lru_last;
      infos.next = null;

      lru_last = infos;
    } else {
      lru_first = lru_last = infos;
      infos.prev = null;
      infos.next = null;
    }
  }
  function LRU_release(cb) {
    var min_time = t() - lru_min_time;
    if (lru_player_count >= lru_max && (lru_first.t <= min_time) ) {
      var lru_curr = lru_first;
      while(lru_player_count >= lru_min && lru_curr.t <= min_time ) {
        if (lru_curr.lock && lru_curr.lock > 0) {
          lru_curr = lru_curr.next;
          continue;
        }
        delete lru_players[lru_curr.id];
        lru_curr.next && (lru_curr.next.prev = lru_curr.prev);
        lru_curr.prev && (lru_curr.prev.next = lru_curr.next);
        
        lru_curr = lru_curr.next;
        lru_player_count--;
        cb(lru_curr.id,lru_curr.data);
      }
    }
  }
  function LRU_lock(id) {
    if (lru_last && lru_last.id == id) {
      if (!lru_last.data)
        return lru_last.data;
      if (lru_last.lock)
        lru_last.lock ++;
      else 
        lru_last.lock = 1;
      lru_last.t = t();
      return lru_last.data;
    } else  {
      var player = lru_players[id];
      if (player) {
        if (!player.data)
          return player.data;
        if (player.lock)
          player.lock ++;
        else 
          player.lock = 1;
        player.t = t();
        return player.data;
      }
    }
    return null;
  }
  function LRU_unlock(id) {
    if (lru_last && lru_last.id == id) {
      if (lru_last.lock)
        lru_last.lock--;
      else
        return false;
      return true;
    } else  {
      var player = lru_players[id];
      if (player) {
        if (player.lock)
          player.lock --;
        else
          return false;
        return true;
      }
    }
    return false;
  }
  function LRU_reload(id) {
    var player = lru_players[id];
    if (player) {
      player.data = null;
    }
  }
  return {
    add : LRU_add,
    release : LRU_release,
    lock : LRU_lock,
    unlock : LRU_unlock,
    reload : LRU_reload,
  }
}

function createTimeoutTimer(timeout) {
  var timers = [];

  function addListener(guid,cb) {
    timers.push({cb:cb,t:t()+timeout});
  }
  function fire() {
    var now = t();
    var bDel = false;
    for (var i = 0; i < timers.length; i++) {
      if (timers[i] <= now) {
        timers[i].cb();
      } else {
        timers.splice(0,i);
        bDel = true;
        break;
      }
    };
    if (!bDel) {
      timers.length = 0;
    }
  }
  setInterval(fire,1000);//每秒触法
  return  {
    addListener:addListener,
  }
}

var lru_cache = createLRU();
var timer = createTimeoutTimer(15000);
function tryRunApiImpl(api,err,data,response) {
  try{
    api(err,data,response);
  } catch(e) {
    //console.log('捕捉异常');
    if (e.msg) {
      response?response(e):api(e);
    } else {
      e = {code:e.number,msg:e.message,file:e.filename,stack:e.stack};
      response?response(e):api(e);
    }
    //console.dir(e);
  }
}
module.exports = {
  forceReloadPlayer : function(playerid) {
    lru_cache.reload(playerid);
  },
  loadPlayer : function(playerid,cb,apiImpl) {
    //新版本用于减少release调用。增加LRU淘汰算法.
    var bCompleteApi;
    var timeCompleteApi;//用于判断超时。没有调用response。
    var responseWaitForSave = true;
    var responseResult;
    function response(err,data2,notNeedSave) {
      if (responseResult) return;
      data2 = data2 || {};
      data2.ct = t();
      responseResult = [err,data2];
      if (err) {
        if (notNeedSave !== undefined)
          responseWaitForSave = !notNeedSave;
        else 
          responseWaitForSave = false;
      }
      else
        responseWaitForSave = !notNeedSave; 
      tryResponse();
    }
    function callApi(err,data) {
      timer.addListener(function(){
        response({code:-1,msg:'服务器api没有执行完成或超时'});
      });
      tryRunApiImpl(apiImpl,err,data,response);
      bCompleteApi = true;
      tryResponse();//尝试回滚。
    }
    function saveCallback(err,result) {
      if (data)//闭包
        lru_cache.unlock(playerid);

      if (err) {
        cb(err);
      } else {
        cb(responseResult[0],responseResult[1]);
      }
    }
    function tryResponse() {
      if (bCompleteApi && responseResult) {
        if (responseWaitForSave && data) {
          var newdata = lru_cache.lock(playerid); 
          if (newdata) {
            lru_cache.unlock(playerid);
            storage.save(playerid,data,saveCallback);
          } else 
            cb({code:-1,msg:'数据被重置'});
        } else {
          cb(responseResult[0],responseResult[1]);
        }
      }
      lru_cache.release(function(player_id,player_data){
        storage.release([player_id]);
      });
    }
    var data = lru_cache.lock(playerid);
    if (data) {
      callApi(null,data);
    } else {
      storage.load([playerid],function(err,result) {
        data = lru_cache.lock(playerid);//2次检查
        if (data) {
          callApi(null,data);
        } else if (err) {
          callApi(err);
        } else if (!result || !(data = result[playerid])) {
          callApi(null,null);//{code:,msg:'没有加载到数据'}
        } else {
          lru_cache.add(playerid,data);
          data = lru_cache.lock(playerid);
          callApi(null,data);
        }
      });
    }
  },


  //只读。不写，不缓存。
  loadMultiPlayer : function(player_list,apiImpl) {
    // storage.load(player_list,function(err,result) {
    //  storage.release(player_list);
    //  tryRunApiImpl(apiImpl,err,result);//按时间缓存。
    // });
    player_list = player_list || [];
    if (player_list.length == 0) {
      return tryRunApiImpl(apiImpl,null,[]);
    }
    var dispatch = require('./dispatch');
    function dispatchPlayerInfo(openid,cb) {
      dispatch('getPlayerInfo',openid,{},function(err,result){
        if (err) return cb(err);
        cb(null,result.info);
      });
    }
    var ret = {};
    var count = 0;
    var len = player_list.length;
    function getPlayerInfo(openid) {
      dispatchPlayerInfo(openid,function(err,result) {
        if (err) {
          apiImpl && tryRunApiImpl(apiImpl,err);
          apiImpl = null;
        } else if (apiImpl) {
          ret[openid] = result;
          count++;
          if (count == len) {
            apiImpl && tryRunApiImpl(apiImpl,err,ret);
          }
        }
      });
    }
    for (var i = len - 1; i >= 0; i--) {
      getPlayerInfo(player_list[i]);
    };
  },
  
  addPlayer : function(playerid,player_data,apiImpl) {
    storage.add(playerid,player_data,function(err,result){
      return tryRunApiImpl(apiImpl,err,result);
    });
  },
}








