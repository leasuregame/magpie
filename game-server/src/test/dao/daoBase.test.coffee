setup = require ('./setup')
setup(1);
dbClient = require('pomelo').app.get('dbClient')
DaoBase = require('../../app/dao/mysql/daoBase')
battleLog = require('../../app/domain/entity/battleLog')
sinon = require('sinon');
DaoBase.table = 'battleLog'
DaoBase.domain = battleLog
should = require 'should'

describe "DaoBase", ->
  _insertId = 1
  
  before (done) -> dbClient.query 'delete from battleLog', (err, res) -> done()

  it "create", (done)->
    DaoBase.create {
      data: 
        id: _insertId
        own: 1
        enemy: 1
        battleLog: 'battleLog'
    }, (err, res) ->
      should.strictEqual err, null
      res.id.should.be.equal _insertId
      res.own.should.be.equal 1
      res.enemy.should.be.equal 1
      res.battleLog.should.be.equal 'battleLog'
      done()

  it "fetchOne", (done) ->
    DaoBase.fetchOne {
      where: {id: _insertId}
    }, (err, res) ->
      should.strictEqual err, null
      res.id.should.be.equal _insertId
      res.own.should.be.equal 1
      res.enemy.should.be.equal 1
      res.battleLog.should.be.equal 'battleLog'
      done()

  it "fetchOne with id not exist",(done) ->

    DaoBase.fetchOne {
      where:{id:10000}
    },(err,res) ->
      should.strictEqual res,null
      err.code.should.be.equal 404
      err.msg.should.be.equal 'can not find battleLog'
      done()


  it 'fetchMany', (done) ->
    DaoBase.fetchMany where: id: _insertId, (err, res) ->
      should.strictEqual err, null
      res.length.should.be.equal 1
      res = res[0]
      res.id.should.be.equal _insertId
      res.own.should.be.equal 1
      res.enemy.should.be.equal 1
      res.battleLog.should.be.equal 'battleLog'
      done()

  it 'update', (done) ->
      DaoBase.update {
        where:{id:_insertId},
        data:{own:2}
      },(err,res)->
        should.strictEqual err,null
        res.should.be.equal true
        done()

  it 'update with id not exist',(done) ->
    DaoBase.update {
      where:{id:10000},
      data:{own:2}
    },(err,res) ->
      should.strictEqual res,false
      should.strictEqual err,null
      done()

  it 'delete', (done) ->
    DaoBase.delete where: id: _insertId, (err, res) ->
      should.strictEqual err, null
      res.should.be.equal(true)
      done()
