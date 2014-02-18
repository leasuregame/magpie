describe("Area Server", function() {
  describe("Greeting Handler", function() {
    describe("area.greetingHandler.send", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });

      describe('当参数content为空时', function(){
        beforeEach(function(){
          loginWith('arthur', '1', 1);  
        });

        it('不能喊话', function(){
          request('area.greetingHandler.send', {
            content: ''
          }, function(data){
            expect(data).toEqual({
              code: 501, 
              msg: '内容不能为空'
            });
          });
        });
      });

      describe('当参数content长度过长时', function(){
        beforeEach(function(){
          loginWith('arthur', '1', 1);  
        });

        it('不能喊话', function(){
          request('area.greetingHandler.send', {
            content: 'abcdefghijklmnopqrstuvwxyz'
          }, function(data){
            expect(data).toEqual({
              code: 501, 
              msg: '内容过长，请重新输入'
            });
          });
        });
      });

      describe('当魔石不足时', function(){
        beforeEach(function(){
          doAjax('/update/player/1', {
            gold: 10
          }, function(res) {
            loginWith('1', '1', 1);
          });
        });

        it('不能喊话', function(){
          request('area.greetingHandler.send', {
            content: 'hello, everyBody.'
          }, function(data){
            expect(data).toEqual({
              code: 501, 
              msg: '魔石不足'
            });
          });
        });
      });

      describe('当喊话成功时', function(){
        beforeEach(function(){
          doAjax('/update/player/2', {
            gold: 20
          }, function(res) {
            loginWith('2', '1', 1);
          });
        });

        it('返回值正确，而且记录了喊话数据', function(){
          request('area.greetingHandler.send', {
            content: 'hello, everyBody.'
          }, function(data){
            expect(data).toEqual({
              code: 200
            });

            doAjax('/greeting/1', function(res){
              expect(res.data.content).toEqual('hello, everyBody.');
              expect(res.data.playerId).toEqual(2);
              expect(res.data.playerName).toEqual('Mike');
            });
          });
        });
      });

    });
  });
});