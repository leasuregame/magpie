Battle = require '../battle/battle'
Player = require '../battle/player'
tab = require '../model/table'
battleLog = require '../battle/battle_log'

describe 'Battle', ->

  describe '1 v 1', ->  

    before ->
      tab.reloadTables(
        './test/tables/skills.xml',
        './test/tables/cards.xml'
        )

    beforeEach ->
      @battle = null
      # 孙悟空
      @attacker = new Player(6)
      @attacker.setLineUp '00:7,01:8'

      # 杨戬
      @defender = new Player(7)
      @defender.setLineUp '00:12,01:13'

      @battle = new Battle(@attacker, @defender)

    it 'check bind cards', ->
      @attacker.currentHero().card_id.should.be.equal(7)
      @attacker.nextHero().card_id.should.be.equal(8)
      @attacker.nextHero().card_id.should.be.equal(7)
      @attacker.nextHero().card_id.should.be.equal(8)

      @defender.currentHero().card_id.should.be.equal(12)
      @defender.nextHero().card_id.should.be.equal(13)
      @defender.nextHero().card_id.should.be.equal(12)
      @defender.nextHero().card_id.should.be.equal(13)

    # it 'should have a valid BattleLog object', =>
    #   @battle.battleLog.should.be.a('object').and.have.property('winner')
    #   @battle.battleLog.should.have.property('steps')

    # it 'start a battle, and fight till end', ->
    #   @battle.process()

    #   battleLog.reports().should.equal(null)
    #   #battleLog.print.should.be.equal(null)

    it '6 v 6', ->
      @battle = null
      # 孙悟空
      @attacker = new Player(8)
      @attacker.setLineUp '00:16,01:17,02:18,10:19,11:20,12:21'

      # 杨戬
      @defender = new Player(9)
      @defender.setLineUp '00:22,01:23,02:24,10:25,11:26,12:27'

      @battle = new Battle(@attacker, @defender)

      @battle.process()

      battleLog.reports().should.equal(null)