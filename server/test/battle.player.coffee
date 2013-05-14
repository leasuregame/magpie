Player = require '../battle/player'
Hero = require '../battle/hero'
Matrix = require '../battle/matrix'
should = require 'should'

describe 'Player', ->
  beforeEach ->
    @player = new Player()

  it 'Initial, should be liked a Player', ->
    player = new Player(1)

    player.id.should.equal(1)
    player.lv.should.equal(3)
    player.lineUp.should.equal('')
    player.hero_ids.should.not.be.empty
    player.heros.should.not.be.empty

  it '.load(), should be loaded data from db', ->
    should.strictEqual(@player.id, null)
    should.strictEqual(@player.lv, 0)
    @player.heros.should.be.empty

    @player.load(2)

    @player.id.should.equal(2)
    @player.lv.should.equal(3)
    @player.heros.should.not.be.empty

  it ".death(), should be death when all heros' hp <= 0", ->
    @player.load(1)

    @player.death().should.be.false

    @player.heros.forEach (h)->
      h.hp = 0

    @player.death().should.be.true

  it ".currentHero()", ->
    @player = new Player(1, '00:1')
    @player.currentHero().should.be.an.instanceOf(Hero)

  it ".currentHerosToBeAttacked()", ->
    @player = new Player(1, '00:1')
    @player.currentHerosToBeAttacked().should.be.an.instanceOf(Array)
    @player.currentHerosToBeAttacked()[0].should.be.an.instanceOf(Hero)

  it ".aliveHeros()", ->
    @player.load(3)
    @player.aliveHeros().should.be.an.instanceof(Array)
    @player.aliveHeros().length.should.equal(3)

  it ".setLineUp()", ->
    @player.lineUp.should.equal('')
    @player.setLineUp('00:34').lineUp.should.equal('00:34')

  it ".parseLineUp()", ->
    @player.setLineUp('00:1,01:2')
    res = @player.parseLineUp()
    res.should.be.an.instanceof(Array)
    res.should.eql([['00', '1'],['01', '2']])

    @player.setLineUp('00:1')
    @player.parseLineUp().should.eql([['00', '1']])

  it ".bindCards()", ->
    @player.load(3)
    @player.setLineUp('00:3,01:4,02:5')

    @player.matrix.should.be.an.instanceof(Matrix)
    
