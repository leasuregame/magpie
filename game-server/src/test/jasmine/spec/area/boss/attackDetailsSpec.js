describe("Area Server", function() {
  describe("Boss Handler", function() {
    describe("area.bossHandler.attackDetails", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });

      describe('沉睡的Boss', function() {

        var bossId;
        var bossCreateTime = new Date().getTime();

        beforeEach(function() {
          doAjax('/update/player/100', {
            cd: JSON.stringify({
              lastAtkTime: 0
            })
          }, function() {});

          doAjax('/create/boss', {
            playerId: 100,
            tableId: 2,
            atkCount: 0,
            finder: 'Attacker',
            hp: '{"2":{"cardId":40001,"hp":80000000},"4":{"cardId":40004,"hp":100000},"6":{"cardId":40004,"hp":100000}}',
            createTime: bossCreateTime
          }, function(res) {
            bossId = res.insertId;
            loginWith('arthur', '1', 1);
          });
        });

        it('参数为空时', function() {
          request('area.bossHandler.attackDetails', {}, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '参数错误'
            });
          });
        });

        it('返回空列表', function() {
          request('area.bossHandler.attackDetails', {
            bossId: bossId
          }, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: []
            });
          });
        });

      });

      describe('苏醒的Boss', function() {

        var bossId;
        var bossCreateTime = new Date().getTime();

        beforeEach(function() {
          doAjax('/update/player/100', {
            cd: JSON.stringify({
              lastAtkTime: 0
            })
          }, function() {});

          doAjax('/create/boss', {
            playerId: 100,
            tableId: 2,
            atkCount: 1,
            status: 2,
            finder: 'Attacker',
            hp: '{"2":{"cardId":40001,"hp":80000000},"4":{"cardId":40004,"hp":100000},"6":{"cardId":40004,"hp":100000}}',
            createTime: bossCreateTime
          }, function(res) {
            bossId = res.insertId;
            loginWith('arthur', '1', 1);
          });
        });

        it('返回正确的列表', function() {
          request('area.bossHandler.attack', {
            bossId: bossId
          }, function(adata) {

            request('area.bossHandler.attackDetails', {
              bossId: bossId
            }, function(data) {
              expect(data.code).toEqual(200);
              expect(data.msg[0].playerId).toEqual(100);
              expect(data.msg[0].attacker).toEqual('Attacker');
              expect(data.msg[0].damage).toEqual(adata.msg.damage);
              expect(data.msg[0].money).toEqual(adata.msg.battleLog.rewards.money);
              expect(data.msg[0].honor).toEqual(adata.msg.battleLog.rewards.honor);
              expect(data.msg[0].moneyAdd).toEqual(null);
              expect(data.msg[0].honorAdd).toEqual(null);

              doAjax('/battleLog/' + data.msg[0].battleLogId, function(res) {
                expect(res.data.id).toEqual(data.msg[0].battleLogId);
              });
            });

          });


        });

      });

      describe('好友的, 苏醒的Boss', function() {

        var bossId;
        var bossCreateTime = new Date().getTime();

        beforeEach(function() {
          doAjax('/update/player/100', {
            cd: JSON.stringify({
              lastAtkTime: 0
            })
          }, function() {});

          doAjax('/create/boss', {
            playerId: 1,
            tableId: 2,
            atkCount: 1,
            status: 2,
            finder: 'Attacker',
            hp: '{"2":{"cardId":40001,"hp":80000000},"4":{"cardId":40004,"hp":100000},"6":{"cardId":40004,"hp":100000}}',
            createTime: bossCreateTime
          }, function(res) {
            bossId = res.insertId;
            loginWith('arthur', '1', 1);
          });
        });

        it('返回正确的列表', function() {
          request('area.bossHandler.attack', {
            bossId: bossId
          }, function(adata) {
            console.log(adata);

            request('area.bossHandler.attackDetails', {
              bossId: bossId
            }, function(data) {
              console.log(data);
              expect(data.code).toEqual(200);
              expect(data.msg[0].playerId).toEqual(100);
              expect(data.msg[0].attacker).toEqual('Attacker');
              expect(data.msg[0].damage).toEqual(adata.msg.damage);
              expect(data.msg[0].money).toEqual(adata.msg.battleLog.rewards.money);
              expect(data.msg[0].honor).toEqual(adata.msg.battleLog.rewards.honor);
              expect(data.msg[0].moneyAdd).toEqual(adata.msg.battleLog.rewards.friend.money);
              expect(data.msg[0].honorAdd).toEqual(adata.msg.battleLog.rewards.friend.honor);

              doAjax('/battleLog/' + data.msg[0].battleLogId, function(res) {
                expect(res.data.id).toEqual(data.msg[0].battleLogId);
              });
            });

          });


        });

      });

    });
  });
});