require './setup'
app = require('pomelo').app
dao = require('../../app/dao').init('mysql')
dbClient = app.get('dbClient')
should = require 'should'

describe "Passive Skill Data Access Object", ->
  id = 1
  cardId = 1
  tableId = 1
  value = '0'#'{"hp_improve": 10}'

  describe "#createPassiveSkill", ->

    describe "when not exists", ->
      after (done) ->
        dbClient.delete 'delete from passiveSkill where id =?', [id], -> done()

      it "should can be create with right param", (done) ->
        dao.passiveSkill.createPassiveSkill {
          id: id
          cardId: cardId
          tableId: tableId
          value: value
        }, (err, res) ->
          should.strictEqual null, err
          res.id.should.be.equal id
          done()

      it "should can be create with the wrong param", (done) ->
        dao.passiveSkill.createPassiveSkill {}, (err, res) ->
          should.strictEqual null, res
          err.code.should.be.equal 400
          done()

    describe "when exists", ->
      before (done) ->
        dbClient.insert 'insert into passiveSkill (id, cardId, tableId, value, createTime) value (?, ?, ?, ?, ?)', 
          [id, cardId, tableId, value, Date.now()], -> done()

      after (done) ->
        dbClient.delete 'delete from passiveSkill where id =?', [id], -> done()

      it "should can be create with duplicate id", (done) ->
        dao.passiveSkill.createPassiveSkill {
          id: id
          cardId: cardId
          tableId: tableId
          value: value
        }, (err, res) ->
          should.strictEqual null, res
          err.should.eql {"code":"ER_DUP_ENTRY","msg":"ER_DUP_ENTRY: Duplicate entry '1' for key 'PRIMARY'"}
          done()

  describe "#deletePassiveSkill", ->
    before (done) ->
      dbClient.insert 'insert into passiveSkill (id, cardId, tableId, value, createTime) value (?, ?, ?, ?, ?)', 
        [id, cardId, tableId, value, Date.now()], -> done()

    it "should can be delete a passive skill", (done) ->
      dao.passiveSkill.deletePassiveSkillById id, (err, res) ->
        should.strictEqual null, err
        res.should.be.ok
        done()

    it "should can not delete a not exist passive skill", (done) ->
      dao.passiveSkill.deletePassiveSkillById id + 1000, (err, res) ->
        should.strictEqual null, err
        res.should.not.be.ok
        done()

  describe "#getPassiveSkill", ->

    before (done) ->
      dbClient.insert 'insert into passiveSkill (id, cardId, tableId, value, createTime) value (?, ?, ?, ?, ?)', 
        [id, cardId, tableId, value, Date.now()], -> done()

    after (done) ->
      dbClient.delete 'delete from passiveSkill where id =?', [id], -> done()

    it "should can be get a passive skill with card id", (done) ->
      dao.passiveSkill.getPassiveSkillByCardId cardId, (err, res) ->
        should.strictEqual null, err
        res.length.should.be.equal 1

        ps = res[0]
        ps.id.should.be.equal id
        ps.cardId.should.be.equal cardId
        ps.tableId.should.be.equal tableId
        done()

    it "should can be get with id", (done) ->
      dao.passiveSkill.getPassiveSkillById id, (err, res) ->
        should.strictEqual null, err

        ps = res
        ps.id.should.be.equal id
        ps.cardId.should.be.equal cardId
        ps.tableId.should.be.equal tableId
        done()

    it "should return error when not exists", (done) ->
      dao.passiveSkill.getPassiveSkillById id+1000, (err, res) ->
        should.strictEqual null, res
        err.should.eql {code: null, msg: 'PassiveSkill not exists'}
        done()

  describe "#updatePassiveSkill", ->
    before (done) ->
      dbClient.insert 'insert into passiveSkill (id, cardId, tableId, value, createTime) value (?, ?, ?, ?, ?)', 
        [id, cardId, tableId, value, Date.now()], -> done()

    after (done) ->
      dbClient.delete 'delete from passiveSkill where id =?', [id], -> done()

    it "should can be updated a passive skill attibutes", (done) ->
      dao.passiveSkill.updatePassiveSkillById id, {
        cardId: 2
        tableId: 2
        value: '2'
      }, (err, res) ->
        should.strictEqual null, err
        res.should.be.ok
        done()

    it "should return false when passive skill not exists", (done) ->
      dao.passiveSkill.updatePassiveSkillById id+1000, {
        cardId: 2
        tableId: 2
        value: 'value'
      }, (err, res) ->
        should.strictEqual null, err
        res.should.not.be.ok
        done()
