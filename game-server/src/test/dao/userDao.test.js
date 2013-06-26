// Generated by CoffeeScript 1.6.3
(function() {
  var dao, pomelo, should;

  dao = require('../../app/dao').init('mysql');

  pomelo = require('pomelo');

  should = require('should');

  describe("User Data Access Object", function() {
    var account, app, from, password;
    account = 'testacount';
    password = 1;
    from = '';
    app = pomelo.createApp();
    before(function() {
      app.loadConfig('mysql', app.getBase() + '/config/mysql.json');
      app.set('dbclient', require('../../app/dao/mysql/coffee/mysql').init(app));
      return app.set('dao', dao);
    });
    describe("#createUser", function() {
      after(function() {
        return app.get('dbclient')["delete"]('delete from user where account = ?', [account], function() {});
      });
      it("should can be create user when user not exists", function(done) {
        return dao.user.createUser(account, password, from, function(err, res) {
          res.account.should.be.equal(account);
          res.password.should.be.equal(password);
          should.strictEqual(err, null);
          return done();
        });
      });
      return it("should return error message when user exists", function(done) {
        return dao.user.createUser(account, password, from, function(err, res) {
          should.strictEqual(res, null);
          err.should.be.a('object');
          err.should.have.property('code');
          err.should.have.property('msg');
          return done();
        });
      });
    });
    describe("#getUserBy...", function() {
      var id, name;
      id = 1;
      name = 'testname';
      describe("when user exists", function() {
        before(function(done) {
          return app.get('dbclient').insert('insert user (id, account, name, password, create_time) values (?,?,?,?,?)', [id, account, name, password, Date.now()], function() {
            return done();
          });
        });
        after(function(done) {
          return app.get('dbclient')["delete"]('delete from user where id = ?', [id], function() {
            return done();
          });
        });
        it("should can be got user by account", function(done) {
          return dao.user.getUserByAccount(account, function(err, res) {
            should.strictEqual(err, null);
            res.should.be.ok;
            return done();
          });
        });
        it("should can be got user by Id", function(done) {
          return dao.user.getUserById(id, function(err, res) {
            should.strictEqual(err, null);
            res.should.be.ok;
            return done();
          });
        });
        return it("should can be got user by name", function(done) {
          return dao.user.getUserByName(name, function(err, res) {
            should.strictEqual(err, null);
            res.should.be.ok;
            return done();
          });
        });
      });
      return describe("when user not exists", function() {
        it("should can not get user by id, and with error [User not exist]", function(done) {
          return dao.user.getUserById(id, function(err, res) {
            console.log('get user by id', err, res);
            err.should.be.equal(' User not exist ');
            should.strictEqual(res, null);
            return done();
          });
        });
        it("should can not get user by Account, and with error [User not exist]", function(done) {
          return dao.user.getUserByAccount(account, function(err, res) {
            err.should.be.equal(' User not exist ');
            should.strictEqual(res, null);
            return done();
          });
        });
        return it("should can not get user by name, and with error [User not exist]", function(done) {
          return dao.user.getUserByName(name, function(err, res) {
            err.should.be.equal(' User not exist ');
            should.strictEqual(res, null);
            return done();
          });
        });
      });
    });
    describe("#deleteUserBy...", function() {
      var id, name;
      id = 2;
      name = 'testname2';
      describe("when user exists", function() {
        beforeEach(function(done) {
          return app.get('dbclient').insert('insert user (id, account, name, password, create_time) values (?,?,?,?,?)', [id, account, name, password, Date.now()], function() {
            return done();
          });
        });
        afterEach(function(done) {
          return app.get('dbclient')["delete"]('delete from user where id = ?', [id], function() {
            return done();
          });
        });
        it("should can be delete by Id", function(done) {
          return dao.user.deleteUserById(id, function(err, res) {
            should.strictEqual(err, null);
            res.should.be.ok;
            return done();
          });
        });
        it("should can be delete by name", function(done) {
          return dao.user.deleteUserByName(name, function(err, res) {
            should.strictEqual(err, null);
            res.should.be.ok;
            return done();
          });
        });
        return it("should can be delete by account", function(done) {
          return dao.user.deleteUserByAccount(account, function(err, res) {
            should.strictEqual(err, null);
            res.should.be.ok;
            return done();
          });
        });
      });
      return describe("when user not exist", function() {
        it("should return result 'false', deleteUserById", function(done) {
          return dao.user.deleteUserById(id, function(err, res) {
            should.strictEqual(err, null);
            res.should.not.be.ok;
            return done();
          });
        });
        it("should return result 'false', deleteUserByName", function(done) {
          return dao.user.deleteUserByName(name, function(err, res) {
            should.strictEqual(err, null);
            res.should.not.be.ok;
            return done();
          });
        });
        return it("should return result 'false', deleteUserByAccount", function(done) {
          return dao.user.deleteUserByAccount(account, function(err, res) {
            should.strictEqual(err, null);
            res.should.not.be.ok;
            return done();
          });
        });
      });
    });
    return describe("#updateUser", function() {
      var id, name;
      id = 3;
      name = 'testname3';
      before(function(done) {
        return app.get('dbclient').insert('insert user (id, account, name, password, create_time) values (?,?,?,?,?)', [id, account, name, password, Date.now()], function() {
          return done();
        });
      });
      after(function(done) {
        return app.get('dbclient')["delete"]('delete from user where id = ?', [id], function() {
          return done();
        });
      });
      return it("should can be update user with specific fields", function(done) {
        return dao.user.updateUser(id, {
          name: 'changename'
        }, function(err, res) {
          should.strictEqual(err, null);
          return dao.user.getUserById(id, function(err, res) {
            should.strictEqual(err, null);
            res.name.should.be.equal('changename');
            return done();
          });
        });
      });
    });
  });

}).call(this);
