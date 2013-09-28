VPlayer = require '../../app/battle/virtual_player'
Hero = require '../../app/battle/hero'
should = require 'should'
tab = require '../../app/manager/table'

describe "Virtual Player", ->
  before ->
    #tab.reloadTables()

  it "should can be initial", ->
    taskConfig = tab.getTable('task_config')
    taskConfig.forEach (id, data) ->
      player = new VPlayer(data)
      player.lineUp.should.be.equal('1:0,2:1')
      player.cards.should.eql([{tableId: 3}, {tableId: 4}, {tableId: 5}])
      player.is_monster.should.equal(true)

  it "随机阵型", ->
    player = new VPlayer({
      is_random: 1,
      cards: '20001#20002#20003'
    })
    player.lineUp.should.be.equal('')
    player.cards.should.eql({})
    player.is_monster.should.equal(true)
    