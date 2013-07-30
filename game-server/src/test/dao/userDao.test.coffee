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
      dao.user.createUser data:{account: account, password: password}, (err, res) ->
        res.id.should.be.a('number')
        should.strictEqual(err, null)
        done()  

    it "should return error message when user exists", (done) ->
      dao.user.createUser data:{account: account, password: password}, (err, res) ->
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
        dao.user.getUserByAccount where: account:account, (err, res) ->
          should.strictEqual(err, null)
          res.should.be.ok
          done()

      it "should can be got user by Id", (done) ->
        dao.user.getUserById where: id:id, (err, res) ->
          should.strictEqual(err, null)
          res.should.be.ok
          done()

    describe "when user not exists", ->
      it "should can not get user by id, and with error [User not exist]", (done) ->
        dao.user.getUserById where: id:id, (err, res) -> 
          err.should.eql({ code: 404, msg: 'can not find user' })
          should.strictEqual(res, null)
          done()

      it "should can not get user by Account, and with error [User not exist]", (done) ->
        dao.user.getUserByAccount where: account:account, (err, res) ->
          err.should.eql({ code: 404, msg: 'can not find user' })
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
        dao.user.deleteUserById where: id:id, (err, res) ->
          should.strictEqual(err, null)
          res.should.be.ok
          done()


    describe "when user not exist", ->
      it "should return result 'false', deleteUserById", (done) ->
        dao.user.deleteUserById where: id:id, (err, res) ->
          should.strictEqual(err, null)
          res.should.not.be.ok
          done()