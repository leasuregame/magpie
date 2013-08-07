loadtable = require '../../app/common/loadtable'
TABLE_DIR = (require './prepare/path').TABLE_DIR

describe 'load data from xml file', ->
  it 'loadtable from xml file', ->
    res = loadtable(
      TABLE_DIR + 'skills.xml'
      TABLE_DIR + 'cards.xml'
      TABLE_DIR + 'tasks.xml'
      TABLE_DIR + 'rank.xml'
    )
    
    #res.should.equal(null)
    (typeof res.monster_cards).should.equal('undefined')
    Object.keys(res.exports.cards).length.should.be.above(250)