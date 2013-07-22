require './setup'
DaoBase = require('../../app/dao/mysql/daoBase')
battleLog = require('../../app/domain/battleLog')
DaoBase.domain = battleLog
should = require 'should'

describe "DaoBase", ->
  it "create", ->
    DaoBase.create {
      table: 'battleLog',
      data: 
        own: 1
        enemy: 1
        battleLog: 'battleLog'
    }, (err, res) ->
      console.log 'result: ', err, res
      should.strictEqual err, null
      res.should.be.equal 1

  it "fetch", ->
    DaoBase.fetchOne {
      table: 'battleLog'
      where: {id: 1}
    }, (err, res) ->
      console.log 'fetch result: ', err, res