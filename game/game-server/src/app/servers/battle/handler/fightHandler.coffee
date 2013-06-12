Player = require '../../../battle/player'
Battle = require '../../../battle/battle'
battleLog = require '../../../battle/battle_log'
playerManager = require('../../../manager/manager').player
_ = require 'underscore'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::attack = (msg, session, next)->
  targetId = msg.targetId
  playerId = 'aa20df78-c748-11e2-a527-377d32fa9d96'

  playerManager.fetchMany [playerId, targetId], (err, results) ->
    attacker = new Player(results[playerId])
    attacker.setLineUp random_liveup(attacker.heros)

    defender = new Player(results[targetId])
    defender.setLineUp random_liveup(defender.heros)

    battleLog.clear()
    battle = new Battle(attacker, defender)
    battle.process()

    next null, {code: 200, msg: JSON.stringify(battleLog.reports())}

random_liveup = (heros)->
  ids = _.map heros, (h) -> h.card_id
  pos = ['00', '01', '02', '10', '11', '12']

  _res = []  
  while(true)
    r = _.random(0, 5)
    _res.push r if r not in _res
    break if _res.length >= ids.length

  lu = ''
  for i in [0..._res.length]
    lu += "#{pos[_res[i]]}:#{ids[i]},"

  lu[0...-1]