dao = require('../../app/dao')

describe "Dao Factory", ->
  it "should can be init with specific 'mysql' type", ->
    _dao = dao.init('mysql')
    _dao.should.be.a('object')
    _dao.should.be.equal(dao)
