require './setup'
app = require('pomelo').app
dao = require('../../app/dao').init('mysql')
dbClient = app.get('dbClient')
should = require 'should'

describe "Player Dao Access Object", ->
  uid = 1
  pid = 1
  areaId = 1
  name = 'test_player_name'

  describe "#createPlayer", ->

    describe "When player not exists", ->
      after (done) ->
        dbClient.delete 'delete from player where id = ?', [pid], -> done()

      it "should can create a player", (done) ->
        dao.player.createPlayer( {
          id: pid
          userId: uid
          areaId: areaId
          name: name
        }, (err, res) ->
          should.strictEqual null, err
          res.id.should.be.equal(pid)
          res.name.should.be.equal(name)
          res.areaId.should.be.equal(areaId)
          done()
        )

      it "should return error with param wrong", (done) ->
        dao.player.createPlayer {}, (err, res) -> 
          should.strictEqual null, res
          err.code.should.be.equal(400)
          
          dao.player.createPlayer {userId: uid}, (err, res) ->
            should.strictEqual null, res
            err.code.should.be.equal(400)
            done()


    describe "when player exists", ->
      before (done) ->
        dbClient.insert 'insert into player (id, userId, areaId, name, createTime) values (?,?,?,?,?)',
          [pid, uid, areaId, name, Date.now()], -> done()

      after (done) ->
        dbClient.delete 'delete from player where id = ?', [pid], -> done()

      it "should can not create duplicate player", (done) ->
        dao.player.createPlayer {
          id: pid
          userId: uid
          areaId: areaId
          name: name
        }, (err, res) ->
          should.strictEqual null, res
          err.should.eql { code: 'ER_DUP_ENTRY', msg: 'ER_DUP_ENTRY: Duplicate entry \'1\' for key \'PRIMARY\'' }
          done()


  describe "#getPlayer", ->
    before (done) ->
      dbClient.insert 'insert into player (id, userId, areaId, name, createTime) values (?,?,?,?,?)',
        [pid, uid, areaId, name, Date.now()], -> done()

    after (done) ->
      dbClient.delete 'delete from player where id = ?', [pid], -> done()

    describe "when player exists", ->
      it "should can get the existed user with id", (done) ->
        dao.player.getPlayerById pid, (err, res) ->
          should.strictEqual null, err
          res.id.should.be.equal(pid)
          res.name.should.be.equal(name)
          # check other property of res
          done()

      it "should can get the existed user with name", (done) ->
        dao.player.getPlayerByName name, (err, res) ->
          should.strictEqual null, err
          res.id.should.be.equal(pid)
          res.name.should.be.equal(name)
          # check other property of res
          done()

    describe "when player not exists", ->
      it "get user with id should return error", (done) ->
        pid_not_exists = 100000
        dao.player.getPlayerById pid_not_exists, (err, res) ->
          should.strictEqual null, res
          err.should.eql {code: null, msg: 'Player not exists'}
          done()

      it "get user with name should return error", (done) ->
        name_not_exists = 'not exists name'
        dao.player.getPlayerByName name_not_exists, (err, res) ->
          should.strictEqual null, res
          err.should.eql {code: null, msg: 'Player not exists'}
          done()

    describe "get all player info", ->
      it "should can be got all the player infomation", ->

  describe "#deletePlayer", ->

    before (done) ->
      dbClient.insert 'insert into player (id, userId, areaId, name, createTime) values (?,?,?,?,?)',
        [pid, uid, areaId, name, Date.now()], -> done()

    after (done) ->
      dbClient.delete 'delete from player where id = ?', [pid], -> done()

    it "when player exists, should can be delete a player", (done) ->
      dao.player.deletePlayerById pid, (err, res) ->
        should.strictEqual err, null
        res.should.be.ok
        done()

    it "when player not exists, should return false", (done) ->
      dao.player.deletePlayerById pid+10000, (err, res) ->
        should.strictEqual err, null
        res.should.not.be.ok
        done()

  describe "#updatePlayer", ->
    create_time = Date.now()

    before (done) ->
      dbClient.insert 'insert into player (id, userId, areaId, name, createTime) values (?,?,?,?,?)',
        [pid, uid, areaId, name, create_time], -> done()

    after (done) ->
      dbClient.delete 'delete from player where id = ?', [pid], -> done()

    describe "updatePlayerById", ->
      it "should can be update player with specific fields", (done) ->
        dao.player.updatePlayerById pid, {
          areaId: 5
          name: 'new name'
          userId: 10
          money: 1000
        }, (err, res) ->
          should.strictEqual null, err
          res.should.be.ok

          dbClient.query 'select * from player where id = ?', [pid], (err, res) ->
            res.length.should.be.equal(1)

            player = res[0]
            player.should.eql { 
              id: 1,
              createTime: create_time,
              userId: 10,
              areaId: 5,
              name: 'new name',
              power: 0,
              lv: 0,
              exp: 0,
              money: 1000,
              gold: 0,
              lineUp: '',
              ability: 0,
              task: '',
              pass: 0,
              passMark: null 
            }
            done()

    describe "updatePlayerByName", ->
      it "should can be update player with specific fields", (done) ->
        dao.player.updatePlayerByName name, {
          areaId: 5
          name: 'new name'
          userId: 10
          money: 1000
        }, (err, res) ->
          should.strictEqual null, err
          res.should.be.ok

          dbClient.query 'select * from player where id = ?', [pid], (err, res) ->
            res.length.should.be.equal(1)

            player = res[0]
            player.should.eql { 
              id: 1,
              createTime: create_time,
              userId: 10,
              areaId: 5,
              name: 'new name',
              power: 0,
              lv: 0,
              exp: 0,
              money: 1000,
              gold: 0,
              lineUp: '',
              ability: 0,
              task: '',
              pass: 0,
              passMark: null 
            }
            done()





