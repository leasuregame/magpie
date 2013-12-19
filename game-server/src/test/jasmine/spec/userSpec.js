describe("Connector Server", function() {

  describe("User Handler", function() {
    var pomelo = window.pomelo;
    var userid;

    beforeAll(function() {
      doAjax('/loaddata/csv', {}, function(data) {});
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

        it("register with a valid acount and password", function() {
          request('connector.userHandler.register', {
            account: 'test_email@qq.com',
            password: '123456'
          }, function(data) {
            console.log(data);
            expect(typeof data.msg.userId).toEqual('number');
            userid = data.msg.userId;
            expect(data.code).toEqual(200);
          });
        });

        it("register with an invalid acount", function() {
          request('connector.userHandler.register', {
            account: '123456()',
            password: '123456'
          }, function(data) {
            userid = data.uid
            expect(data.code).toEqual(501);
          });
        });

        it("register with empty email or password", function() {
          request('connector.userHandler.register', {
            account: '',
            password: ''
          }, function(data) {
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('用户名或密码不能为空');
          });
        });

        it("register with wrong password", function() {
          request('connector.userHandler.register', {
            account: 'correctAccount',
            password: 'we#122'
          }, function(data) {
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('密码只能由6-20位的数字或字母组成');
          });
        });
      });

      describe("when user exists", function() {
        beforeEach(function() {
          doAjax('/adduser', {
            account: 'test_email_1@qq.com',
            password: '123456'
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
            password: '123456'
          }, function(data) {
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('用户已经存在')
          });
        });

      });
    });


    describe("connector.userHandler.login", function() {

      describe("when user has been register", function() {

        describe("and player for user is created", function() {          

          it("should can be login, and return player info", function() {
            request('connector.userHandler.login', {
              account: 'arthur',
              password: '1',
              areaId: 1
            }, function(data) {
              console.log('after login');
              console.log(data);
              expect(typeof data.msg.user).toEqual('object');
              expect(typeof data.msg.player).toEqual('object');

              expect(data.msg.user.account).toEqual('arthur');
              expect(data.msg.player.userId).toEqual(100);
            });
          });

        });

        describe("and player for user is not created", function() {
          it("should can be login, and player is undefined", function() {
            request('connector.userHandler.login', {
              account: 'userNotHavePlayer',
              password: '123456',
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
            account: 'notexisituser',
            password: '123456',
            areaId: 1
          }, function(data) {
            console.log('result: ', data);
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('用户不存在');
          });
        });
      });

    });
  });

});