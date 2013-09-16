setup = require ('./setup')
setup(1);
app = require('pomelo').app
dao = require('../../app/dao').init('mysql')
dbClient = app.get('dbClient')
async = require 'async'
should = require 'should'

describe "mysql queues (transaction)", ->
  _insertId = 1

  before (done) -> dbClient.query 'delete from battleLog', (err, res) -> done()

  it "should can be execute multiple sql in a transaction", (done)->
    sqlList = [
      {
        sql: "INSERT into battleLog (id, createTime, own, enemy, battleLog) values (?,?,?,?,?)"
        args: [_insertId, 0, 1, 1, 'battlelog']
      }
      {
        sql: 'update battleLog set enemy = ? where id = ?'
        args: [2, _insertId]
      }
      {
        sql: 'update battleLog set own = ? where id = ?'
        args: [2, _insertId]
      }
      {
        sql: 'update battleLog set battleLog = ? where id = ?'
        args: ['fuck you', _insertId]
      }
    ]

    dbClient.queues sqlList, (err, info) ->
      should.strictEqual(err, null)
      info.should.be.equal(true)

      dbClient.query 'select * from battleLog where id = ?', [_insertId], (err, res) -> 
        should.strictEqual(err, null)
        res.should.be.eql [ { id: 1, createTime: 0, own: 2, enemy: 2, battleLog: 'fuck you' } ]
        done()