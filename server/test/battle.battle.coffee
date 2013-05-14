Battle = require '../battle/battle'
Player = require '../battle/player'
tab = require '../model/table'

describe 'Battle', ->

  describe '1 v 1', ->
    
    @battle = null

    it 'setup', =>
      tab.reloadTables(
        './test/tables/skills.xml',
        './test/tables/cards.xml'
        )

      @attacker = new Player(6)
      @attacker.setLineUp '00:7'

      @defender = new Player(7)
      @defender.setLineUp '00:12'

      @battle = new Battle(@attacker, @defender)

    # it 'should have a valid BattleLog object', =>
    #   @battle.battleLog.should.be.a('object').and.have.property('winner')
    #   @battle.battleLog.should.have.property('steps')

    it 'start a battle, and fight till end', =>
      @battle.execute()

      @battle.battleLog.print.should.equal(@battle.battleLog.reports())