require './setup'
app = require('pomelo').app
dao = require('../../app/dao').init('mysql')
dbClient = app.get('dbClient')
async = require 'async'
should = require 'should'

describe "mysql queues (transaction)", ->
  it "should can be execute multiple sql in a transaction", ->
    sqlList = [
      {
        sql: "INSERT into battleLog (id, createTime, own, enemy, battleLog) values (?,?,?,?,?)"
        args: [1, 0, 1, 1, 'battlelog']
      }
      {
        sql: 'update battleLog set enemy = ? where id = ?'
        args: [2, 1]
      }
      {
        sql: 'update battleLog set own = ? where id = ?'
        args: [2, 1]
      }
      {
        sql: 'update battleLog set battleLog = ? where id = ?'
        args: ['fuck you', 1]
      }
    ]

    dbClient.queues sqlList, (err, info) ->
      console.log 'result: ', err, info
      should.strictEqual(info, '')