describe("Area Server", function() {
  describe("Boss Handler", function() {
    describe("area.bossHandler.attack", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });

      describe('我的boss', function(){
        var bossId;
        var bossCreateTime = new Date().getTime();

        describe('沉睡的Boss', function(){
          beforeEach(function(){
            doAjax('/create/boss', {
              playerId: 100,
              tableId: 2,
              atkCount: 0,
              hp: '{"2":{"cardId":40001,"hp":80000000},"4":{"cardId":40004,"hp":100000},"6":{"cardId":40004,"hp":100000}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;
              loginWith('arthur', '1', 1);
            });
          });

          it('可以攻击，并返回正确的结果', function(){
            request('area.bossHandler.attack', {
              bossId: bossId
            }, function(data) {
              console.log('attak result: ', data);
              expect(data).toEqual({});
            })
          });
        });

      });

      describe('好友的boss', function(){
        var bossId;
        var bossCreateTime = new Date().getTime();

        describe('苏醒的Boss', function(){
          beforeEach(function(){
            doAjax('/create/boss', {
              playerId: 1,
              tableId: 2,
              atkCount: 1,
              status: 2,
              hp: '{"2":{"cardId":40001,"hp":79940219},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":60825}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;
              loginWith('arthur', '1', 1);
            });
          });

          it('可以攻击，并返回正确的结果', function(){
            request('area.bossHandler.attack', {
              bossId: bossId,
              inspireCount: 3
            }, function(data) {
              console.log('attak result: ', data);
              expect(data).toEqual({});
            })
          });
        });

      });

    });
  });
});