loadtable = require '../common/loadtable'

describe 'load data from xml file', ->
  it 'loadtable from xml file', ->
    res = loadtable('./test/data/skills.xml')
    res.should.eql(null)
    #res.exports.should.eql(null)