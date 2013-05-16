var _ = require('underscore'),
  memcached = require('memcached'),
  server_config = require('../server_config'),
  database = new memcached("127.0.0.1:11211");

var _key = '_b_';
var start_time = new Date().getTime();
var count = 1;
database.get(_key, function(err, data) {
  //console.warn(err, data);
  if (!data) {
    database.add(_key, [start_time], -1, function(err, result) {
      // if(err)
      //  console.warn('err add data');
    });
    return;
  }
  if (_.isString(data)) {
    data = JSON.parse(data);
  }
  //data =  JSON.parse(data);
  data.push(start_time);
  database.set(_key, data, -1, function(err, result) {
    // if(err)
    //    console.warn('err set data');
  });
});


module.exports = {
  saveData: function(data) {
    var tmp = count + _key + start_time;
    this.addData(tmp, data, function(err, result) {
      // if(err)
      //  console.warn('err add data');
    });
    count++;
    return tmp;
  },
  modifyKey: function(port) {
    _key = '_' + port;
  },
  getData: function(key, cb) {
    database.get(key, function(err, data) {
      cb(err, data);
    });
  },
  addData: function(key, data, cb) {
    database.add(key, data, -1, cb);
  },
  setData: function(key, data, cb) {
    database.set(key, data, -1, cb);
  },
  getMultiData: function(keys, cb) {
    database.getMulti(keys, function(err, data) {
      cb(err, data);
    });
  },
  delData: function(key, cb) {
    database.del(key, function(err, data) {
      //console.warn(err, data);
      cb(err, data)
    });
  }
};