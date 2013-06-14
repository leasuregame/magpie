PlayerManager = require('../manager/manager').player
Player = require '../battle/player'
Hero = require '../battle/hero'
Matrix = require '../battle/matrix'
should = require 'should'
tab = require '../manager/table'
player_data =  require './prepare/player.data'
TABLE_DIR = (require './prepare/path').TABLE_DIR

describe 'Player', ->
  before ->
    tab.reloadTables(
        TABLE_DIR + 'skills.xml',
        TABLE_DIR + 'cards.xml'
        )
    player_data.laodTestData()

  after ->
    player_data.clearTestData()

  it 'Initial, should be liked a Player', ->

    player = new Player()
    player.id.should.equal 0
    player.lv.should.equal(0)
    player.exp.should.equal(0)
    player.power.should.equal(0)
    player.money.should.equal(0)
    player.lineUp.should.equal('')
    player.hero_ids.should.be.empty
    player.heros.should.be.empty


  it ".death(), should be death when all heros' hp <= 0", ->
    PlayerManager.fetch player_data.player_id1, (err, model) ->
      console.log err, model
      ply = new Player(model)
      ply.death().should.be.false

      ply.heros.forEach (h)->
        h.hp = 0

      ply.death().should.be.true

  it ".currentHero()", ->
    PlayerManager.fetch player_data.player_id1, (err, model) ->
      ply = new Player(model)
      ply.setLineUp '00:1'

      
      ply.currentHero().should.be.an.instanceOf(Hero)

  it ".aliveHeros()", ->
    PlayerManager.fetch player_data.player_id1, (err, model) ->
      ply = new Player(model)
      ply.aliveHeros().should.be.an.instanceof(Array)
      ply.aliveHeros().length.should.equal(6)

  it ".setLineUp()", ->
    PlayerManager.fetch player_data.player_id1, (err, model) ->
      ply = new Player(model)
      ply.lineUp.should.equal('')
      ply.setLineUp('00:6')
      ply.lineUp.should.be.equal('00:6')

  it ".parseLineUp()", ->
    PlayerManager.fetch player_data.player_id1, (err, model) ->
      ply = new Player(model)
      ply.setLineUp('00:1,01:2')
      res = ply.parseLineUp()
      res.should.be.an.instanceof(Array)
      res.should.eql([['00', '1'],['01', '2']])

      ply.setLineUp('00:1')
      ply.parseLineUp().should.eql([['00', '1']])

  it ".bindCards()", ->
    PlayerManager.fetch player_data.player_id1, (err, model) ->
      ply = new Player(model)
      ply.setLineUp('00:3,01:4,02:5')

      ply.matrix.should.be.an.instanceof(Matrix)
      ply.matrix.all().length.should.be.equal(3)
      ply.matrix.attackElement('all').length.should.equal(3)
    
