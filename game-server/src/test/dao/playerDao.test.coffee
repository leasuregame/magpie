require './setup'
app = require('pomelo').app
dao = require('../../app/dao').init('mysql')
dbClient = app.get('dbClient')
async = require 'async'
should = require 'should'

describe "Player Dao Access Object", ->
  uid = 1000
  pid = 1000
  areaId = 10
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
          err.should.be.equal('param error')
          
          dao.player.createPlayer {userId: uid}, (err, res) ->
            should.strictEqual null, res
            err.should.be.equal('param error')
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
          err.should.eql { code: 'ER_DUP_ENTRY', msg: 'ER_DUP_ENTRY: Duplicate entry \'1000\' for key \'PRIMARY\'' }
          done()


  describe "#getPlayer", ->
    before (done) ->
      dbClient.insert 'insert into player (id, userId, areaId, name, createTime) values (?,?,?,?,?)',
        [pid, uid, areaId, name, Date.now()], -> done()

    after (done) ->
      dbClient.delete 'delete from player where id = ?', [pid], -> done()

    describe "when player exists", ->
      it "should can get the existed user with id", (done) ->
        dao.player.getPlayer {id: pid}, (err, res) ->
          should.strictEqual null, err
          res.id.should.be.equal(pid)
          res.name.should.be.equal(name)
          # check other property of res
          done()

      it "should can get the existed user with name", (done) ->
        dao.player.getPlayer {name: name}, (err, res) ->
          should.strictEqual null, err
          res.id.should.be.equal(pid)
          res.name.should.be.equal(name)
          # check other property of res
          done()

      it "shoudl can get the existed user with userId", (done) ->
        dao.player.getPlayer {userId: uid}, (err, res) ->
          should.strictEqual null, err
          res.id.should.be.equal(pid)
          res.name.should.be.equal(name)
          # check other property of res
          done()

    describe "when player not exists", ->
      it "get user with id should return error", (done) ->
        pid_not_exists = 100000
        dao.player.getPlayer {id: pid_not_exists}, (err, res) ->
          should.strictEqual null, res
          err.should.eql {code: null, msg: 'Player not exists with params: {\"id\":100000}'}
          done()

      it "get user with name should return error", (done) ->
        name_not_exists = 'not exists name'
        dao.player.getPlayer {name: name_not_exists}, (err, res) ->
          should.strictEqual null, res
          err.should.eql {code: null, msg: 'Player not exists with params: {\"name\":\"not exists name\"}'}
          done()

    describe "get all player info", ->
      _pid = 1001
      now = Date.now()
      
      before (done) ->
        async.series([
          (cb) -> dbClient.insert 'insert into player (id, userId, areaId, name, createTime) values (?,?,?,?,?)', [_pid, uid, areaId, name+'__', now], cb
          
          (cb) -> dbClient.insert 'insert into card (id, playerId, tableId, createTime) values (?,?,?,?)', [1, _pid, 1, now], cb
          (cb) -> dbClient.insert 'insert into passiveSkill (id, cardId, name, value, createTime) values (?,?,?,?,?)', [1, 1, 'hp_improve', 10, now], cb
          
          (cb) -> dbClient.insert 'insert into card (id, playerId, tableId, createTime) values (?,?,?,?)', [2, _pid, 2, now], cb
          (cb) -> dbClient.insert 'insert into passiveSkill (id, cardId, name, value, createTime) values (?,?,?,?,?)', [2, 2, 'hp_improve', 10, now], cb

          (cb) -> dbClient.insert 'insert into card (id, playerId, tableId, createTime) values (?,?,?,?)', [3, _pid, 3, now], cb
          (cb) -> dbClient.insert 'insert into passiveSkill (id, cardId, name, value, createTime) values (?,?,?,?,?)', [3, 3, 'hp_improve', 10, now], cb

          (cb) -> dbClient.insert 'insert into card (id, playerId, tableId, createTime) values (?,?,?,?)', [4, _pid, 4, now], cb
          (cb) -> dbClient.insert 'insert into passiveSkill (id, cardId, name, value, createTime) values (?,?,?,?,?)', [4, 4, 'hp_improve', 10, now], cb

          (cb) -> dbClient.insert 'insert into card (id, playerId, tableId, createTime) values (?,?,?,?)', [5, _pid, 5, now], cb
          (cb) -> dbClient.insert 'insert into passiveSkill (id, cardId, name, value, createTime) values (?,?,?,?,?)', [5, 5, 'hp_improve', 10, now], cb
          ], (err, res) -> 
            if err
              console.log '创建测试数据出错:', err
            done()
        )

      after (done) ->
        dbClient.delete 'delete from player where id = ?', [_pid], ->
          dbClient.delete 'delete from card', ->
            dbClient.delete 'delete from passiveSkill', -> done()
          
      it "should can be got all the player infomation", (done) ->
        dao.player.getPlayerInfo _pid, (err, player) ->
          should.strictEqual null, err
          #player.toJson().should.be.equal({})
          player.should.be.a('object')
          player.userId.should.be.equal(uid)
          player.name.should.be.equal(name+'__')
          Object.keys(player.cards).length.should.be.equal(5)
          
          done()

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

  # describe "#updatePlayer", ->
  #   create_time = Date.now()

  #   before (done) ->
  #     dbClient.insert 'insert into player (id, userId, areaId, name, createTime) values (?,?,?,?,?)',
  #       [pid, uid, areaId, name, create_time], -> done()

  #   after (done) ->
  #     dbClient.delete 'delete from player where id = ?', [pid], -> done()

  #   describe "updatePlayerById", ->
  #     it "should can be update player with specific fields", (done) ->
  #       dao.player.updatePlayerById pid, {
  #         areaId: 5
  #         name: 'new name'
  #         userId: 10
  #         money: 1000
  #       }, (err, res) ->
  #         should.strictEqual null, err
  #         res.should.be.ok

  #         dbClient.query 'select * from player where id = ?', [pid], (err, res) ->
  #           res.length.should.be.equal(1)

  #           player = res[0]
  #           player.should.eql { 
  #             id: 1,
  #             createTime: create_time,
  #             userId: 10,
  #             areaId: 5,
  #             name: 'new name',
  #             power: 0,
  #             lv: 0,
  #             exp: 0,
  #             money: 1000,
  #             gold: 0,
  #             lineUp: '',
  #             ability: 0,
  #             task: '',
  #             pass: 0,
  #             passMark: null 
  #           }
  #           done()

  #   describe "updatePlayerByName", ->
  #     it "should can be update player with specific fields", (done) ->
  #       dao.player.updatePlayerByName name, {
  #         areaId: 5
  #         name: 'new name'
  #         userId: 10
  #         money: 1000
  #       }, (err, res) ->
  #         should.strictEqual null, err
  #         res.should.be.ok

  #         dbClient.query 'select * from player where id = ?', [pid], (err, res) ->
  #           res.length.should.be.equal(1)

  #           player = res[0]
  #           player.should.eql { 
  #             id: 1,
  #             createTime: create_time,
  #             userId: 10,
  #             areaId: 5,
  #             name: 'new name',
  #             power: 0,
  #             lv: 0,
  #             exp: 0,
  #             money: 1000,
  #             gold: 0,
  #             lineUp: '',
  #             ability: 0,
  #             task: '',
  #             pass: 0,
  #             passMark: null 
  #           }
  #           done()





