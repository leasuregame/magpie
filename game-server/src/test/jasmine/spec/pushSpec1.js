describe("Message # ", function() {
  var pomelo = window.pomelo;
  var userid;

  describe("Set Up", function() {
    it("connect to server", function() {
      intiPomelo();
    });
  });

  describe("Message Handler", function() {
    beforeEach(function() {
      var ok = false;
      runs(function() {
        $.get('/adduser', {
          account: 'test_email_2@qq.com',
          password: '1'
        }, function(data) {
          userid = data.uid;
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

    describe("when user login", function() {
      beforeEach(function() {
        request('connector.userHandler.login', {
          account: 'test_email_2@qq.com',
          password: '1'
        }, function(data) {
          if (data.code == 200) {
            console.log('login success.');
          } else {
            console.log('login faild.');
          }
        });

        pomelo.on('onChart', function(data) {
          console.log('message: on chart: ', data);
        })
      });

      it("should can be receive message from server", function() {
        request('message.messageHandler.send', {
          content: 'send message content'
        }, function(data) {
          expect(data).toEqual({
            code: 200,
            msg: 'send message content'
          })
        });
      });

    });

  });

});