Battle = require '../../app/battle/battle'
Player = require '../../app/battle/player'
PlayerManager = require('../../app/manager/playerManager')
tab = require '../../app/manager/table'
battleLog = require '../../app/battle/battle_log'
player_data =  require './prepare/player.data'
TABLE_DIR = (require './prepare/path').TABLE_DIR

describe 'Battle', ->

  describe '1 v 1', ->  

    before ->
      tab.reloadTables(
        TABLE_DIR + 'skills.xml',
        TABLE_DIR + 'cards.xml'
        )
      player_data.laodTestData()

    after ->
      player_data.clearTestData()

    # beforeEach ->
    #   @battle = null
    #   # 孙悟空
    #   @attacker = new Player(6)
    #   @attacker.setLineUp '00:7,01:8'

    #   # 杨戬
    #   @defender = new Player(7)
    #   @defender.setLineUp '00:12,01:13'

    #   @battle = new Battle(@attacker, @defender)

    # it 'check bind cards', ->
    #   @attacker.currentHero().card_id.should.be.equal(7)
    #   @attacker.nextHero().card_id.should.be.equal(8)
    #   @attacker.nextHero().card_id.should.be.equal(7)
    #   @attacker.nextHero().card_id.should.be.equal(8)

    #   @defender.currentHero().card_id.should.be.equal(12)
    #   @defender.nextHero().card_id.should.be.equal(13)
    #   @defender.nextHero().card_id.should.be.equal(12)
    #   @defender.nextHero().card_id.should.be.equal(13)

    # it 'should have a valid BattleLog object', =>
    #   @battle.battleLog.should.be.a('object').and.have.property('winner')
    #   @battle.battleLog.should.have.property('steps')

    # it 'start a battle, and fight till end', ->
    #   @battle.process()

    #   battleLog.reports().should.equal(null)
    #   #battleLog.print.should.be.equal(null)

    # it '6 v 6, normal attack', ->
    #   PlayerManager.fetchMany [player_data.player_id1, player_data.player_id2], (err, result) ->
    #     console.log err, result

    #     @battle = null
    #     # 孙悟空
    #     @attacker = new Player(result[player_data.player_id1])
    #     @attacker.setLineUp '00:1,01:2,02:3,10:4,11:5,12:6'

    #     # 杨戬
    #     @defender = new Player(result[player_data.player_id2])
    #     @defender.setLineUp '00:7,01:8,02:9,10:10,11:11,12:12'

    #     @battle = new Battle(@attacker, @defender)

    #     @battle.process()

        # console.log battleLog.reports()

    # it '6 v 6, using skill', ->
    #   PlayerManager.fetchMany [player_data.player_id3, player_data.player_id4], (err, result) ->
    #     console.log err, result

    #     @battle = null
    #     # 小芳
    #     @attacker = new Player(result[player_data.player_id3])
    #     @attacker.setLineUp '00:4,01:9,02:15,10:19,11:24,12:30'

    #     # 小丽
    #     @defender = new Player(result[player_data.player_id4])
    #     @defender.setLineUp '00:35,01:39,02:44,10:50,11:54,12:59'

    #     @battle = new Battle(@attacker, @defender)

    #     @battle.process()
    #     res = battleLog.reports()
    #     console.log JSON.stringify res

    it '6 v 6, using skill 2', ->
      PlayerManager.fetchMany [player_data.player_id5, player_data.player_id6], (err, result) ->
        console.log err, result

        @battle = null
        # 小芳
        @attacker = new Player(result[player_data.player_id5])
        @attacker.setLineUp '00:4,01:9,02:15,10:129,11:195,12:204'

        # 小丽
        @defender = new Player(result[player_data.player_id6])
        @defender.setLineUp '00:50,01:54,02:59,10:139,11:174,12:235'

        @battle = new Battle(@attacker, @defender)

        @battle.process()
        res = battleLog.reports()
        console.log JSON.stringify res