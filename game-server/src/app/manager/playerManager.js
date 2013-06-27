// Generated by CoffeeScript 1.6.3
(function() {
  var Cache, Manager, dao, playerList;

  dao = require('pomelo').app.get('dao');

  Cache = require('../common/cache');

  playerList = new Cache();

  Manager = (function() {
    function Manager() {}

    Manager.createPlayer = function(uid, name, params, cb) {
      return dao.player.createPlayer(uid, name, params, function(err, player) {
        if (err !== null) {
          cb(err, null);
          return;
        }
        playerList.put(player.id, player);
        return cb(null, player);
      });
    };

    Manager.getPlayer = function(params, cb) {
      var _player;
      if (params.pid != null) {
        _player = playerList.get(params.pid);
        if (typeof player !== "undefined" && player !== null) {
          cb(null, _player);
          return;
        }
        dao.player.getPlayerById(params.pid, function(err, player) {
          if (err !== null) {
            cb(err, null);
            return;
          }
          playerList.put(player.id, player);
          cb(null, player);
        });
      }
      if (params.name != null) {

      }
    };

    return Manager;

  })();

  module.exports = Manager;

}).call(this);
