dao = require('../../app/dao').init('mysql')
pomelo = require 'pomelo'
should = require 'should'

describe "User Data Access Object", ->
  account = 'testacount'
  password = 1
  from = ''
  app = pomelo.createApp()

  before ->
    app.loadConfig('mysql', app.getBase() + '/config/mysql.json')
    app.set('dbclient', require('../../app/dao/mysql/coffee/mysql').init(app))
    app.set('dao', dao)

  describe "#createUser", ->
    after ->
      app.get('dbclient').delete 'delete from user where account = ?', [account], ->

    it "should can be create user when user not exists", (done) ->
      dao.user.createUser account, password, from, (err, res) ->
        res.account.should.be.equal(account)
        res.password.should.be.equal(password)
        should.strictEqual(err, null)
        done()

    it "should return error message when user exists", (done) ->
      dao.user.createUser account, password, from, (err, res) ->
        should.strictEqual(res, null)
        err.should.be.a('object')
        err.should.have.property('code')
        err.should.have.property('msg')
        done()

  describe "#getUserBy...", ->
    id = 1
    name = 'testname'

    describe "when user exists", ->
      before (done) ->
        app.get('dbclient').insert(
          'insert user (id, account, name, password, create_time) values (?,?,?,?,?)',
          [id, account, name, password, Date.now()], -> done()
          )

      after (done) ->
        app.get('dbclient').delete(
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

      it "should can be got user by name", (done) ->
        dao.user.getUserByName name, (err, res) ->
          should.strictEqual(err, null)
          res.should.be.ok
          done()

    describe "when user not exists", ->
      it "should can not get user by id, and with error [User not exist]", (done) ->
        dao.user.getUserById id, (err, res) ->
          console.log 'get user by id', err, res   
          err.should.be.equal(' User not exist ')
          should.strictEqual(res, null)
          done()

      it "should can not get user by Account, and with error [User not exist]", (done) ->
        dao.user.getUserByAccount account, (err, res) ->
          err.should.be.equal(' User not exist ')
          should.strictEqual(res, null)
          done()

      it "should can not get user by name, and with error [User not exist]", (done) ->
        dao.user.getUserByName name, (err, res) ->
          err.should.be.equal(' User not exist ')
          should.strictEqual(res, null)
          done()

  describe "#deleteUserBy...", ->
    id = 2
    name = 'testname2'

    describe "when user exists", ->
      beforeEach (done) ->
        app.get('dbclient').insert(
          'insert user (id, account, name, password, create_time) values (?,?,?,?,?)',
          [id, account, name, password, Date.now()], -> done()
          )

      afterEach (done) ->
        app.get('dbclient').delete(
          'delete from user where id = ?', [id], -> done()
          )

      it "should can be delete by Id", (done) ->
        dao.user.deleteUserById id, (err, res) ->
          should.strictEqual(err, null)
          res.should.be.ok
          done()

      it "should can be delete by name", (done) ->
        dao.user.deleteUserByName name, (err, res) ->
          should.strictEqual(err, null)
          res.should.be.ok
          done()

      it "should can be delete by account", (done) ->
        dao.user.deleteUserByAccount account, (err, res) ->
          should.strictEqual(err, null)
          res.should.be.ok
          done()

    describe "when user not exist", ->
      it "should return result 'false', deleteUserById", (done) ->
        dao.user.deleteUserById id, (err, res) ->
          should.strictEqual(err, null)
          res.should.not.be.ok
          done()

      it "should return result 'false', deleteUserByName", (done) ->
        dao.user.deleteUserByName name, (err, res) ->
          should.strictEqual(err, null)
          res.should.not.be.ok
          done()

      it "should return result 'false', deleteUserByAccount", (done) ->
        dao.user.deleteUserByAccount account, (err, res) ->
          should.strictEqual(err, null)
          res.should.not.be.ok
          done()

  describe "#updateUser", ->
    id = 3
    name = 'testname3'

    before (done) ->
      app.get('dbclient').insert(
        'insert user (id, account, name, password, create_time) values (?,?,?,?,?)',
        [id, account, name, password, Date.now()], -> done()
        )

    after (done) ->
      app.get('dbclient').delete(
        'delete from user where id = ?', [id], -> done()
        )

    it "should can be update user with specific fields", (done) ->
      dao.user.updateUser id, {name: 'changename'}, (err, res) ->
        should.strictEqual(err, null)
        
        dao.user.getUserById id, (err, res) ->
          should.strictEqual(err, null)
          res.name.should.be.equal('changename')
          done()
