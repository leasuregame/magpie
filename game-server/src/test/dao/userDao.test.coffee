require './setup'
app = require('pomelo').app
dao = app.get('dao')
should = require 'should'

describe "User Data Access Object", ->
  account = 'testacount'
  password = 1
  from = ''

  describe "#createUser", ->
    after ->
      app.get('dbClient').delete 'delete from user where account = ?', [account], ->

    it "should can be create user when user not exists", (done) ->
      dao.user.createUser {account: account, password: password}, (err, res) ->
        res.account.should.be.equal(account)
        should.strictEqual(err, null)
        done()  

    it "should return error message when user exists", (done) ->
      dao.user.createUser {account: account, password: password}, (err, res) ->
        should.strictEqual(res, null)
        err.should.eql({ 
          code: 'ER_DUP_ENTRY',
          msg: 'ER_DUP_ENTRY: Duplicate entry \'testacount\' for key \'INDEX_ACCOUNT\'' 
          })
        done()

  describe "#getUserBy...", ->
    id = 1
    name = 'testname'

    describe "when user exists", ->
      before (done) ->
        app.get('dbClient').insert(
          'insert user (id, account, name, password, createTime) values (?,?,?,?,?)',
          [id, account, name, password, Date.now()], -> done()
          )

      after (done) ->
        app.get('dbClient').delete(
          'delete from user where id = ?', [id], -> done()
          )

      it "should can be got user by account", (done) ->
        dao.user.getUserByAccount account, (err, res) ->
          should.strictEqual(err, null)
          res.should.be.ok
          done()

      it "should can be got user by Id", (done) ->
        dao.user.getUserById id, (err, res) ->
          should.strictEqual(err, null)
          res.should.be.ok
          done()

    describe "when user not exists", ->
      it "should can not get user by id, and with error [User not exist]", (done) ->
        dao.user.getUserById id, (err, res) -> 
          err.should.eql({ code: null, msg: 'User not exists' })
          should.strictEqual(res, null)
          done()

      it "should can not get user by Account, and with error [User not exist]", (done) ->
        dao.user.getUserByAccount account, (err, res) ->
          err.should.eql({ code: null, msg: 'User not exists' })
          should.strictEqual(res, null)
          done()

  describe "#deleteUserBy...", ->
    id = 2
    name = 'testname2'

    describe "when user exists", ->
      beforeEach (done) ->
        app.get('dbClient').insert(
          'insert user (id, account, name, password, createTime) values (?,?,?,?,?)',
          [id, account, name, password, Date.now()], -> done()
          )

      afterEach (done) ->
        app.get('dbClient').delete(
          'delete from user where id = ?', [id], -> done()
          )

      it "should can be delete by Id", (done) ->
        dao.user.deleteUserById id, (err, res) ->
          should.strictEqual(err, null)
          res.should.be.ok
          done()


    describe "when user not exist", ->
      it "should return result 'false', deleteUserById", (done) ->
        dao.user.deleteUserById id, (err, res) ->
          should.strictEqual(err, null)
          res.should.not.be.ok
          done()

  describe "#updateUser", ->
    id = 3
    name = 'testname3'

    before (done) ->
      app.get('dbClient').insert(
        'insert user (id, account, name, password, createTime) values (?,?,?,?,?)',
        [id, account, name, password, Date.now()], -> done()
        )

    after (done) ->
      app.get('dbClient').delete(
        'delete from user where id = ?', [id], -> done()
        )

    it "should can be update user with specific fields", (done) ->
      dao.user.updateUserById id, {name: 'changename'}, (err, res) ->
        should.strictEqual(err, null) 
        
        dao.user.getUserById id, (err, res) ->
          should.strictEqual(err, null)
          res.name.should.be.equal('changename')
          done()
