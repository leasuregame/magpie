express = require 'express'

test_data = require './prepare/battle_server_data'
Battle = require '../battle/battle'
Player = require '../battle/player'
PlayerManager = require '../model/player'
tab = require '../model/table'
battleLog = require '../battle/battle_log'

tab.reloadTables(
    './test/tables/skills.xml',
    './test/tables/cards.xml'
    )

app = express()
app.get '/6v6', (req, res)->
  test_data.laodTestData()

  PlayerManager.fetchMany [test_data.player_id5, test_data.player_id6], (err, result) ->
    console.log err, result

    battle = null
    # 小芳
    attacker = new Player(result[test_data.player_id5])
    attacker.setLineUp '00:4,01:9,02:15,10:129,11:195,12:204'

    # 小丽
    defender = new Player(result[test_data.player_id6])
    defender.setLineUp '00:50,01:54,02:59,10:139,11:174,12:235'

    battle = new Battle(attacker, defender)

    battleLog.clear()
    battle.process()
    
    test_data.clearTestData()
    report = battleLog.reports()
    console.log report
    console.log report.steps.length
    res.send JSON.stringify report


app.listen('3344')