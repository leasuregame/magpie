describe("User Actions # ", function() {
  var pomelo = window.pomelo;
  var userid;

  describe("Set Up", function() {
    it("connect to server", function() {
      intiPomelo();
    });
  });

  describe("Entry Handler", function() {
    it("entry method should works fine.", function() {
      request('connector.entryHandler.entry', {
        uid: 1
      }, function(data) {
        expect(data).toEqual({
          code: 200,
          msg: "game server is ok"
        });
      });
    });
  });

  describe('User Handler', function() {

    describe("when user not exists", function() {
      afterEach(function() {
        console.log('delete user:', userid);
        $.get('/removeuser', {
          uid: userid
        }, function(data) {

        });
      });

      it("register with a valid email and password", function() {
        request('connector.userHandler.register', {
          account: 'test_email@qq.com',
          password: '1'
        }, function(data) {
          expect(typeof data.msg.userId).toEqual('number');
          userid = data.msg.userId;
          expect(data.code).toEqual(200);
        });
      });

      // it("register with an invalid email", function() {
      //   request('connector.userHandler.register', {
      //     account: '123456',
      //     password: '1'
      //   }, function(data) {
      //     userid = data.uid
      //     expect(data.code).toEqual(501);
      //   });
      // });

      it("register with empty email or password", function() {
        request('connector.userHandler.register', {
          account: '',
          password: ''
        }, function(data) {
          expect(data.code).toEqual(501);
          expect(data.msg).toEqual('参数不正确！');
        });
      });
    });

    describe("when user exists", function() {
      beforeEach(function() {
        var ok = false;
        runs(function() {
          $.get('/adduser', {
            account: 'test_email_1@qq.com',
            password: '1'
          }, function(data) {
            userid = data.uid;
            console.log('added user:', userid);
            ok = true;
          });
        });

        waitsFor(function() {
          return ok;
        });
      });

      afterEach(function() {
        console.log('delete user:', userid);
        var ok = false;
        runs(function() {
          $.get('/removeuser', {
            uid: userid
          }, function(data) {
            ok = true;
          });
        });

        waitsFor(function() {
          return ok;
        });
      });

      it("should not can be register with exist email", function() {
        request('connector.userHandler.register', {
          account: 'test_email_1@qq.com',
          password: 1
        }, function(data) {
          expect(data.code).toEqual(501);
          //expect(data.msg).toEqual('')
        });
      });

      it("should can be login, and player is undefined", function() {
        request('connector.userHandler.login', {
          account: 'test_email_1@qq.com',
          password: '1'
        }, function(data) {
          console.log(data);
          expect(data.code).toEqual(200);
          expect(typeof data.player).toEqual('undefined');
        });
      });

      describe("when player for user is created", function() {
        var playerId;
        var createTime;

        beforeEach(function() {
          var ok = false;
          runs(function() {
            $.get('/addPlayer', {
              userId: userid,
              areaId: 1,
              name: 'user1'
            }, function(data) {
              playerId = data.playerId;
              createTime = data.ct;
              console.log('paleyr for', userid, 'insertd:', playerId);
              ok = true;
            });
          });
          waitsFor(function() {
            return ok;
          });
        });

        afterEach(function() {
          var ok = false;
          runs(function() {
            $.get('/removePlayer', {
              playerId: playerId
            }, function(data) {
              ok = true;
            });
          });
          waitsFor(function() {
            return ok;
          });
        });

        it("should can be login, and return player info", function() {
          request('connector.userHandler.login', {
            account: 'test_email_1@qq.com',
            password: '1'
          }, function(data) {
            console.log('after login');
            expect(data).toEqual({
              code: 200,
              msg: {
                user: {
                  id: userid
                },
                player: {
                  id: playerId,
                  createTime: createTime,
                  userId: userid,
                  areaId: 1,
                  name: 'user1',
                  power: 0,
                  lv: 0,
                  exp: 0,
                  money: 0,
                  gold: 0,
                  lineUp: {},
                  ability: 0,
                  task: '',
                  pass: 0,
                  passMark: null,
                  dailyGift: '',
                  skillPoint: 0,
                  elixir: 0,
                  energy: 0,
                  cards: [],
                  rank: null
                }
              }
            });
          });
        });

      });

    });

  });

});