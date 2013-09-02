describe("Connector Server", function() {

  describe("User Handler", function() {
    var pomelo = window.pomelo;
    var userid;

    beforeAll(function() {
      doAjax('/createDb', {}, function(data) {});
    });

    describe('connector.userHandler.register', function() {

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
            console.log(data);
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
          doAjax('/adduser', {
            account: 'test_email_1@qq.com',
            password: '1'
          }, function(data) {
            userid = data.uid;
          });
        });

        afterEach(function() {
          doAjax('removeuser', {
            uid: userid
          }, function() {});
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

      });
    });


    describe("connector.userHandler.login", function() {


      describe("when user has been register", function() {

        var addedUserId;
        beforeEach(function() {
          doAjax('/adduser', {
            account: 'testaccount',
            password: '1'
          }, function(data) {
            addedUserId = data.uid;
          });
        });

        afterEach(function() {
          doAjax('removeuser', {
            uid: addedUserId
          }, function() {});
        });

        describe("and player for user is created", function() {
          var playerId;
          var createTime;

          beforeEach(function() {
            doAjax('/addPlayer', {
              userId: addedUserId,
              areaId: 1,
              name: 'player1'
            }, function(data) {
              playerId = data.playerId;
              createTime = data.ct;
            });
          });


          afterEach(function() {
            doAjax('/removePlayer', {
              playerId: playerId
            }, function(data) {});
          });

          it("should can be login, and return player info", function() {
            request('connector.userHandler.login', {
              account: 'testaccount',
              password: '1',
              areaId: 1
            }, function(data) {
              console.log('after login');
              expect(data.msg.user.id).toEqual(addedUserId);
              expect(data.msg.user.account).toEqual('testaccount');
              expect(data.msg.player).toEqual({
                id: playerId,
                createTime: createTime,
                userId: addedUserId,
                areaId: 1,
                name: 'player1',
                power: '',
                lv: 0,
                exp: 0,
                money: 0,
                gold: 0,
                lineUp: {},
                ability: 0,
                task: '',
                pass: {
                  layer: 0,
                  mark: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                },
                dailyGift: '',
                skillPoint: 0,
                elixir: 0,
                energy: 0,
                spiritor: '',
                spiritPool: '',
                cards: [],
                rank: {},
                friends: []
              });
            });
          });

        });

        describe("and player for user is not created", function() {
          it("should can be login, and player is undefined", function() {
            request('connector.userHandler.login', {
              account: 'testaccount',
              password: '1',
              areaId: 1
            }, function(data) {
              console.log('result: ', data);
              expect(data.code).toEqual(200);
              expect(typeof data.player).toEqual('undefined');
            });
          });

        });

      });

      describe("when user not register", function() {
        it("should can be login, and player is undefined", function() {
          request('connector.userHandler.login', {
            account: 'not exisit user',
            password: '1',
            areaId: 1
          }, function(data) {
            console.log('result: ', data);
            expect(data.code).toEqual(404);
            expect(data.msg).toEqual('can not find user');
          });
        });
      });

    });
  });

});