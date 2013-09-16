dao = require('../../app/dao')
should = require 'should'

describe "Dao Factory", ->
  it "should can be init with specific 'mysql' type", ->
    _dao = dao.init('mysql')
    #console.log _dao
    _dao.should.be.a('object')
    _dao.should.be.equal(dao)
