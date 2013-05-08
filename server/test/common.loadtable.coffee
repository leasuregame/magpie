loadtable = require '../common/loadtable'

describe 'load data from xml file', ->
  it 'loadtable from xml file', ->
    res = loadtable('./test/data/jineng.xml')
    res.clinet.should.eql(null)
    res.exports.should.eql(null)