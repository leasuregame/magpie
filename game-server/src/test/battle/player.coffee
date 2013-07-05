Player = require '../../app/battle/player'
Hero = require '../../app/battle/hero'
Matrix = require '../../app/battle/matrix'
should = require 'should'

describe 'Player', -> 
  player = new Player {
    id: 'aa20df72-c748-11e2-a527-377d32fa9d96',
    lv: 10,
    name: '小强',
    exp: 456,
    power: 60,
    money: 100000,
    lineUp: '00:4,01:9,02:129,10:184,11:24,12:204',
    hero_ids:[
      {id: 1, lv: 52, star: 4, card_id: 4, skill_lv: 1, sp_value: [{name: 'dodge', value: 50}]},
      {id: 2, lv: 45, star: 4, card_id: 9, skill_lv: 1, sp_value: [{name: 'dodge', value: 50}]},
      {id: 3, lv: 37, star:4, card_id: 129, skill_lv: 1, sp_value: [{name: 'hp_improve', value: 50}]},
      {id: 4, lv: 37, star:4, card_id: 184, skill_lv: 1, sp_value: [{name: 'hp_improve', value: 50}]},
      {id: 5, lv: 55, star: 4, card_id: 24, skill_lv: 1, sp_value: [{name: 'akt_improve', value: 50}]},
      {id: 6, lv: 46, star: 4, card_id: 204, skill_lv: 1, sp_value: [{name: 'dmg_rebound', value: 50}]}
    ]
  }

  it 'should be liked a Player', ->

    ply = new Player()
    ply.id.should.equal 0
    ply.lv.should.equal(0)
    ply.exp.should.equal(0)
    ply.power.should.equal(0)
    ply.money.should.equal(0)
    ply.lineUp.should.equal('')
    ply.hero_ids.should.be.empty
    ply.heros.should.be.empty


  it ".death(), should be death when all heros' hp <= 0", ->
    player.death().should.be.false

    player.heros.forEach (h)->
      h.hp = 0

    player.death().should.be.true

  # it ".currentHero()", ->
  #   PlayerManager.fetch player_data.player_id1, (err, model) ->
  #     player = new Player(model)
  #     player.setLineUp '00:1'

      
  #     player.currentHero().should.be.an.instanceOf(Hero)

  # it ".aliveHeros()", ->
  #   PlayerManager.fetch player_data.player_id1, (err, model) ->
  #     player = new Player(model)
  #     player.aliveHeros().should.be.an.instanceof(Array)
  #     player.aliveHeros().length.should.equal(6)

  # it ".setLineUp()", ->
  #   PlayerManager.fetch player_data.player_id1, (err, model) ->
  #     player = new Player(model)
  #     player.lineUp.should.equal('')
  #     player.setLineUp('00:6')
  #     player.lineUp.should.be.equal('00:6')

  # it ".parseLineUp()", ->
  #   PlayerManager.fetch player_data.player_id1, (err, model) ->
  #     player = new Player(model)
  #     player.setLineUp('00:1,01:2')
  #     res = player.parseLineUp()
  #     res.should.be.an.instanceof(Array)
  #     res.should.eql([['00', '1'],['01', '2']])

  #     player.setLineUp('00:1')
  #     player.parseLineUp().should.eql([['00', '1']])

  # it ".bindCards()", ->
  #   PlayerManager.fetch player_data.player_id1, (err, model) ->
  #     player = new Player(model)
  #     player.setLineUp('00:3,01:4,02:5')

  #     player.matrix.should.be.an.instanceof(Matrix)
  #     player.matrix.all().length.should.be.equal(3)
  #     player.matrix.attackElement('all').length.should.equal(3)
    
