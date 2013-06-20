express = require 'express'

test_data = require './prepare/battle_server_data'
Battle = require '../battle/battle'
Player = require '../battle/player'
PlayerManager = require('../manager/manager').player
tab = require '../manager/table'
battleLog = require '../battle/battle_log'
TABLE_DIR = (require './prepare/path').TABLE_DIR

tab.reloadTables(
    TABLE_DIR + 'skills.xml',
    TABLE_DIR + 'cards.xml'
    )


app = express()
app.get '/6v6', (req, res)->
  vs66 (data) -> res.send data

vs66 = (cb) ->
  aps = test_data.laodTestData()

  PlayerManager.fetchMany [test_data.player_id5, test_data.player_id6], (err, result) ->
    #console.log err, result

    battle = null
    # 小芳
    attacker = new Player(result[test_data.player_id5])
    attacker.setLineUp '00:4,01:9,02:129,10:184,11:24,12:204'

    # 小丽
    defender = new Player(result[test_data.player_id6])
    defender.setLineUp '00:50,01:54,02:194,10:200,11:44,12:235'

    battle = new Battle(attacker, defender)

    battleLog.clear()
    battle.process()
    
    test_data.clearTestData(aps)
    report = battleLog.reports()
    console.log report
    console.log report.steps.length
    cb "callback(" + JSON.stringify(report) + ")"

app.get '/vs', (req, res) ->
  vs (data) -> res.send data

vs = (cb) ->
  aps = test_data.laodTestData()

  PlayerManager.fetchMany [test_data.player_id7, test_data.player_id8], (err, result) ->
    console.log err, result

    battle = null
    # 小芳
    attacker = new Player(result[test_data.player_id7])
    attacker.setLineUp random_liveup(attacker.heros)

    # 小丽
    defender = new Player(result[test_data.player_id8])
    defender.setLineUp random_liveup(defender.heros)

    battle = new Battle(attacker, defender)

    battleLog.clear()
    battle.process()
    
    test_data.clearTestData(aps)
    report = battleLog.reports()
    console.log report
    console.log report.steps.length
    cb "callback(" + JSON.stringify(report) + ")"

_ = require 'underscore'
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

app.listen('3345')

module.exports = {vs: vs, vs66: vs66}
console.log 'test server running on http://localhost:3344'
