loadtable = require '../common/loadtable'
TABLE_DIR = (require './prepare/path').TABLE_DIR

describe 'load data from xml file', ->
  it 'loadtable from xml file', ->
    res = loadtable(
      TABLE_DIR + 'skills.xml',
      TABLE_DIR + 'cards.xml'
    )
    
    #res.exports.should.equal(null)