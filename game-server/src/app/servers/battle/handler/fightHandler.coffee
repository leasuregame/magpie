Player = require '../../../battle/player'
Battle = require '../../../battle/battle'
battleLog = require '../../../battle/battle_log'
playerManager = require('../../../manager/playerManager')
_ = require 'underscore'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::attack = (msg, session, next)->
  targetId = msg.targetId.toString()
  playerId = msg.playerId.toString()
  playerManager.getPlayers [playerId, targetId], (err, results) ->

    #console.log 'players for fight: ', err, results
    p_data = results[playerId]
    attacker = new Player(p_data)
    attacker.setLineUp p_data.get('lineUp') #or random_liveup(attacker.heros) #
    t_data = results[targetId]
    defender = new Player(t_data)
    defender.setLineUp t_data.get('lineUp') #or random_liveup(defender.heros) #

    battleLog.clear()
    battle = new Battle(attacker, defender)
    battle.process()

    next null, {code: 200, msg: battleLog.reports()}

  #@app.get('channelService').pushMessageByUids('onChart', {msg: 'a message from battle server'}, [{uid: session.uid, sid: 'connector-server-1'}])

random_lineup = (ids)->
  #ids = _.map heros, (h) -> h.card_id
  pos = ['00', '01', '02', '10', '11', '12']

  _res = []
  idxs = _.range(0, ids.length)
  for i in ids
    r = _.random(0, idxs.length-1)
    _res.push idxs[r]
    idxs.splice(r, 1)

  lu = ''
  for i in [0..._res.length]
    lu += "#{pos[_res[i]]}:#{ids[i]},"

  lu[0...-1]