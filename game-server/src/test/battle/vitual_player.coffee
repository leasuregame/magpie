VPlayer = require '../../app/battle/virtual_player'
Hero = require '../../app/battle/hero'
Matrix = require '../../app/battle/matrix'
should = require 'should'
TABLE_DIR = (require './prepare/path').TABLE_DIR
tab = require '../../app/manager/table'

describe "Virtual Player", ->
  before ->
    tab.reloadTables(
      TABLE_DIR + 'skills.xml',
      TABLE_DIR + 'cards.xml',
      TABLE_DIR + 'tasks.xml'
      )

  it "should can be initial", ->
    player = new VPlayer({
      formation: '00:3,02:4,11:5'
      cards: '3#4#5'
      })
    player.lineUp.should.be.equal('00:3,02:4,11:5')
    player.cards.should.eql([{tableId: 3}, {tableId: 4}, {tableId: 5}])
    player.should.be.equal('')