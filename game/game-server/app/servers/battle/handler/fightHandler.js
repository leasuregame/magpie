var Player = require('../../../battle/player');
var Battle = require('../../../battle/battle');
var battleLog = require('../../../battle/battle_log');
var playerManager = require('../../../model/player');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

/**
 * 战斗逻辑计算
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.attack = function(msg, session, next) {
  var targetId = msg.targetId; //'aa20df79-c748-11e2-a527-377d32fa9d96'
  var playerId = 'aa20df78-c748-11e2-a527-377d32fa9d96'; //session.get('playerId');

  playerManager.fetchMany([playerId, targetId], function(err, results){
    var attacker = new Player(results[playerId]);
    attacker.setLineUp(random_liveup(attacker.heros));

    var defender = new Player(results[targetId]);
    defender.setLineUp(random_liveup(defender.heros));

    battleLog.clear();
    var battle = new Battle(attacker, defender);
    battle.process()

    next(null, {code: 200, msg: JSON.stringify(battleLog.reports())});
  });
};

var random_liveup, _,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_ = require('underscore');

random_liveup = function(heros) {
  var i, ids, lu, pos, r, _i, _ref, _res;

  ids = _.map(heros, function(h) {
    return h.card_id;
  });
  pos = ['00', '01', '02', '10', '11', '12'];
  _res = [];
  while (true) {
    r = _.random(0, 5);
    if (__indexOf.call(_res, r) < 0) {
      _res.push(r);
    }
    if (_res.length >= ids.length) {
      break;
    }
  }
  lu = '';
  for (i = _i = 0, _ref = _res.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
    lu += "" + pos[_res[i]] + ":" + ids[i] + ",";
  }
  return lu.slice(0, -1);
};