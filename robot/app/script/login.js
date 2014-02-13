/////////////////////////////////////////////////////////////
var WebSocket = require('ws');
var Protocol = require('pomelo-protocol');
var Package = Protocol.Package;
var Message = Protocol.Message;
var EventEmitter = require('events').EventEmitter;
var protocol = require('pomelo-protocol');
var protobuf = require('pomelo-protobuf');
var cwd = process.cwd();
var utils = require(cwd + '/app/script/utils');
var moveStat = require(cwd + '/app/script/statistic').moveStat;
var attackStat = require(cwd + '/app/script/statistic').attackStat;
var areaStat = require(cwd + '/app/script/statistic').areaStat;
var util = require('util');

if (typeof Object.create !== 'function') {
  Object.create = function(o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}

var JS_WS_CLIENT_TYPE = 'js-websocket';
var JS_WS_CLIENT_VERSION = '0.0.1';

var RES_OK = 200;
var RES_OLD_CLIENT = 501;

var pomelo = Object.create(EventEmitter.prototype); // object extend from object
var socket = null;
var reqId = 0;
var callbacks = {};
var handlers = {};
var routeMap = {};

var heartbeatInterval = 5000;
var heartbeatTimeout = heartbeatInterval * 2;
var nextHeartbeatTimeout = 0;
var gapThreshold = 100; // heartbeat gap threshold
var heartbeatId = null;
var heartbeatTimeoutId = null;

var handshakeCallback = null;

var handshakeBuffer = {
  'sys': {
    type: JS_WS_CLIENT_TYPE,
    version: JS_WS_CLIENT_VERSION
  },
  'user': {}
};

var initCallback = null;

pomelo.init = function(params, cb) {
  pomelo.params = params;
  params.debug = true;
  initCallback = cb;
  var host = params.host;
  var port = params.port;

  var url = 'ws://' + host;
  if (port) {
    url += ':' + port;
  }

  if (!params.type) {
    console.log('init websocket');
    handshakeBuffer.user = params.user;
    handshakeCallback = params.handshakeCallback;
    this.initWebSocket(url, cb);
  }
};

pomelo.initWebSocket = function(url, cb) {
  console.log(url);
  var onopen = function(event) {
    console.log('[pomeloclient.init] websocket connected!');
    var obj = Package.encode(Package.TYPE_HANDSHAKE, Protocol.strencode(JSON.stringify(handshakeBuffer)));
    send(obj);
  };
  var onmessage = function(event) {
    processPackage(Package.decode(event.data), cb);
    // new package arrived, update the heartbeat timeout
    if (heartbeatTimeout) {
      nextHeartbeatTimeout = Date.now() + heartbeatTimeout;
    }
  };
  var onerror = function(event) {
    pomelo.emit('io-error', event);
    console.log('socket error %j ', event);
  };
  var onclose = function(event) {
    pomelo.emit('close', event);
    console.log('socket close %j ', event);
  };
  socket = new WebSocket(url);
  socket.binaryType = 'arraybuffer';
  socket.onopen = onopen;
  socket.onmessage = onmessage;
  socket.onerror = onerror;
  socket.onclose = onclose;
};

pomelo.disconnect = function() {
  if (socket) {
    if (socket.disconnect) socket.disconnect();
    if (socket.close) socket.close();
    console.log('disconnect');
    socket = null;
  }

  if (heartbeatId) {
    clearTimeout(heartbeatId);
    heartbeatId = null;
  }
  if (heartbeatTimeoutId) {
    clearTimeout(heartbeatTimeoutId);
    heartbeatTimeoutId = null;
  }
};

pomelo.request = function(route, msg, cb) {
  msg = msg || {};
  route = route || msg.route;
  if (!route) {
    console.log('fail to send request without route.');
    return;
  }

  reqId++;
  sendMessage(reqId, route, msg);

  callbacks[reqId] = cb;
  routeMap[reqId] = route;
};

pomelo.notify = function(route, msg) {
  msg = msg || {};
  sendMessage(0, route, msg);
};

var sendMessage = function(reqId, route, msg) {
  var type = reqId ? Message.TYPE_REQUEST : Message.TYPE_NOTIFY;

  //compress message by protobuf
  var protos = !! pomelo.data.protos ? pomelo.data.protos.client : {};
  if ( !! protos[route]) {
    msg = protobuf.encode(route, msg);
  } else {
    msg = Protocol.strencode(JSON.stringify(msg));
  }

  var compressRoute = 0;
  if (pomelo.dict && pomelo.dict[route]) {
    route = pomelo.dict[route];
    compressRoute = 1;
  }

  msg = Message.encode(reqId, type, compressRoute, route, msg);
  var packet = Package.encode(Package.TYPE_DATA, msg);
  send(packet);
};


var _host = "";
var _port = "";
var _token = "";

/*
var send = function(packet){
   if (!!socket) {
    socket.send(packet.buffer || packet,{binary: true, mask: true});
   } else {
    setTimeout(function() {
      entry(_host, _port, _token, function() {console.log('Socket is null. ReEntry!')});
    }, 3000);
   }
};
*/

var send = function(packet) {
  if ( !! socket) {
    socket.send(packet.buffer || packet, {
      binary: true,
      mask: true
    });
  }
};


var handler = {};

var heartbeat = function(data) {
  var obj = Package.encode(Package.TYPE_HEARTBEAT);
  if (heartbeatTimeoutId) {
    clearTimeout(heartbeatTimeoutId);
    heartbeatTimeoutId = null;
  }

  if (heartbeatId) {
    // already in a heartbeat interval
    return;
  }

  heartbeatId = setTimeout(function() {
    heartbeatId = null;
    send(obj);

    nextHeartbeatTimeout = Date.now() + heartbeatTimeout;
    heartbeatTimeoutId = setTimeout(heartbeatTimeoutCb, heartbeatTimeout);
  }, heartbeatInterval);
};

var heartbeatTimeoutCb = function() {
  var gap = nextHeartbeatTimeout - Date.now();
  if (gap > gapThreshold) {
    heartbeatTimeoutId = setTimeout(heartbeatTimeoutCb, gap);
  } else {
    console.error('server heartbeat timeout');
    pomelo.emit('heartbeat timeout');
    pomelo.disconnect();
  }
};

var handshake = function(data) {
  data = JSON.parse(Protocol.strdecode(data));
  if (data.code === RES_OLD_CLIENT) {
    pomelo.emit('error', 'client version not fullfill');
    return;
  }

  if (data.code !== RES_OK) {
    pomelo.emit('error', 'handshake fail');
    return;
  }

  handshakeInit(data);

  var obj = Package.encode(Package.TYPE_HANDSHAKE_ACK);
  send(obj);
  if (initCallback) {
    initCallback(socket);
    initCallback = null;
  }
};

var onData = function(data) {
  //probuff decode
  var msg = Message.decode(data);

  if (msg.id > 0) {
    msg.route = routeMap[msg.id];
    delete routeMap[msg.id];
    if (!msg.route) {
      return;
    }
  }

  msg.body = deCompose(msg);

  processMessage(pomelo, msg);
};

var onKick = function(data) {
  pomelo.emit('onKick');
};

handlers[Package.TYPE_HANDSHAKE] = handshake;
handlers[Package.TYPE_HEARTBEAT] = heartbeat;
handlers[Package.TYPE_DATA] = onData;
handlers[Package.TYPE_KICK] = onKick;

var processPackage = function(msg) {
  handlers[msg.type](msg.body);
};

var processMessage = function(pomelo, msg) {
  if (!msg || !msg.id) {
    // server push message
    // console.error('processMessage error!!!');
    pomelo.emit(msg.route, msg.body);
    return;
  }

  //if have a id then find the callback function with the request
  var cb = callbacks[msg.id];

  delete callbacks[msg.id];
  if (typeof cb !== 'function') {
    return;
  }

  cb(msg.body);
  return;
};

var processMessageBatch = function(pomelo, msgs) {
  for (var i = 0, l = msgs.length; i < l; i++) {
    processMessage(pomelo, msgs[i]);
  }
};

var deCompose = function(msg) {
  var protos = !! pomelo.data.protos ? pomelo.data.protos.server : {};
  var abbrs = pomelo.data.abbrs;
  var route = msg.route;

  try {
    //Decompose route from dict
    if (msg.compressRoute) {
      if (!abbrs[route]) {
        console.error('illegal msg!');
        return {};
      }

      route = msg.route = abbrs[route];
    }
    if ( !! protos[route]) {
      return protobuf.decode(route, msg.body);
    } else {
      return JSON.parse(Protocol.strdecode(msg.body));
    }
  } catch (ex) {
    console.error('route, body = ' + route + ", " + msg.body);
  }

  return msg;
};

var handshakeInit = function(data) {
  if (data.sys && data.sys.heartbeat) {
    heartbeatInterval = data.sys.heartbeat * 1000; // heartbeat interval
    heartbeatTimeout = heartbeatInterval * 2; // max heartbeat timeout
  } else {
    heartbeatInterval = 0;
    heartbeatTimeout = 0;
  }

  initData(data);

  if (typeof handshakeCallback === 'function') {
    handshakeCallback(data.user);
  }
};

//Initilize data used in pomelo client
var initData = function(data) {
  if (!data || !data.sys) {
    return;
  }
  pomelo.data = pomelo.data || {};
  var dict = data.sys.dict;
  var protos = data.sys.protos;

  //Init compress dict
  if ( !! dict) {
    pomelo.data.dict = dict;
    pomelo.data.abbrs = {};

    for (var route in dict) {
      pomelo.data.abbrs[dict[route]] = route;
    }
  }

  //Init protobuf protos
  if ( !! protos) {
    pomelo.data.protos = {
      server: protos.server || {},
      client: protos.client || {}
    };
    if ( !! protobuf) {
      protobuf.init({
        encoderProtos: protos.client,
        decoderProtos: protos.server
      });
    }
  }
};

/////////////////////////////////////////////////////////////
var START = 'start';
var END = 'end';
var DirectionNum = 8;


var ActFlagType = {
  EXPLORE: 0,
  LOGIN: 1,
  PASS: 2
};

var monitor = function(type, name, reqId) {
  if (typeof actor !== 'undefined') {
    //console.log('add monitor: ', actor.id);
    actor.emit(type, name, reqId);
  } else {
    //console.log('not actor.....');
    console.error(Array.prototype.slice.call(arguments, 0));
  }
};

var offset = (typeof actor !== 'undefined') ? actor.id + 1 : 30;

var loginEvent = function() {
  pomelo.init({
    host: "127.0.0.1",
    port: 3010,
    log: true
  }, function() {

    monitor('incr', 'login');
    monitor(START, 'login', ActFlagType.LOGIN);
    pomelo.request('connector.userHandler.login', {
      account: 'robotUser' + offset,
      password: '1',
      areaId: 1
    }, function(data) {
      monitor(END, 'login', ActFlagType.LOGIN);
      console.log(data.code);
      if (typeof data.msg == 'string') {
        console.log(data.msg);
      }

      console.log(data.msg.user.account + ' login succeed.');
      var intervalTime = Math.floor(Math.random() * 10000 + 3000);
      var intervalTime1 = Math.floor(Math.random() * 20000 + 5000);

      // pomelo.disconnect();
      // loginEvent();

      setInterval(function() {
        exploreEvent();
      }, intervalTime);

      setInterval(function() {
      	passEvent();
      }, intervalTime1);

    });

  });
};

loginEvent();

var exploreEvent = function() {
  monitor('incr', 'explore');
  monitor(START, 'explore', ActFlagType.EXPLORE);

  pomelo.request('area.taskHandler.explore', {}, function(data) {
    monitor(END, 'explore', ActFlagType.EXPLORE);
    if (data.code != 200) {
      console.log('explore： ', data.code);
      console.log('explore result: ', data.msg);
    }
  });
};

var passEvent = function() {
  monitor('incr', 'passBarrier');
  monitor(START, 'passBarrier', ActFlagType.PASS);

  pomelo.request('area.taskHandler.passBarrier', {}, function(data) {
    monitor(END, 'passBarrier', ActFlagType.PASS);
    //console.log('passBarrier ', data.code);
    //console.log('passBarrier result: ', data.msg);
  });
};