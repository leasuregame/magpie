describe("Area Server", function() {
  describe("Boss Handler", function() {
    describe("area.bossHandler.bossList", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });

      afterEach(function() {
        doAjax('/clear/boss', {}, function() {});
      });

      describe('我的Boss', function() {

        describe('没有好友，没有boss时', function(){
          beforeEach(function(){
            loginWith('2', '1', 1);
          });

          it('返回空列表', function(){
            request('area.bossHandler.bossList', {}, function(data) {
              expect(data).toEqual({
                code: 200,
                msg: []
              });
            });
          });

        });

        describe('没有Boss时', function() {
          beforeEach(function() {
            loginWith('arthur', '1', 1);
          });

          it('返回列表为空', function() {
            request('area.bossHandler.bossList', {}, function(data) {
              expect(data).toEqual({
                code: 200,
                msg: []
              });
            });
          });
        });

        describe('沉睡的boss', function() {
          var bossCreateTime = new Date().getTime();

          beforeEach(function() {
            doAjax('/create/boss', {
              playerId: 100,
              tableId: 1,
              createTime: bossCreateTime
            }, function(res) {
              loginWith('arthur', '1', 1);
            });
          });

          it('返回正确的列表', function() {
            request('area.bossHandler.bossList', {}, function(data) {
              expect(data.code).toEqual(200);

              var boss = data.msg[0];
              console.log(boss);
              //expect(boss.bossId).toEqual(1);
              expect(boss.playerId).toEqual(100);
              expect(boss.tableId).toEqual(1);
              expect(boss.countLeft).toEqual(10);
              expect(boss.status).toEqual(1);

              expect(Math.round(boss.timeLeft / 1000 / 60 / 60)).toEqual(12);

            });
          });
        });

        describe('苏醒的boss', function() {
          var bossCreateTime = new Date().getTime() - 60 * 60 * 1000;

          beforeEach(function() {
            doAjax('/create/boss', {
              playerId: 100,
              tableId: 1,
              atkCount: 1,
              status: 2,
              createTime: bossCreateTime
            }, function(res) {
              loginWith('arthur', '1', 1);
            });
          });

          it('返回正确的列表', function() {
            request('area.bossHandler.bossList', {}, function(data) {
              console.log(data);
              expect(data.code).toEqual(200);

              var boss = data.msg[0];
              //expect(boss.bossId).toEqual(2);
              expect(boss.playerId).toEqual(100);
              expect(boss.tableId).toEqual(1);
              expect(boss.countLeft).toEqual(9);
              expect(boss.status).toEqual(2);

              expect(Math.round(boss.timeLeft / 1000 / 60 / 60)).toEqual(11);

            });
          });
        });

        describe('苏醒的boss, 超时状态', function() {
          var bossCreateTime = new Date().getTime() - 12 * 60 * 60 * 1000;

          beforeEach(function() {
            doAjax('/create/boss', {
              playerId: 100,
              tableId: 1,
              atkCount: 1,
              status: 2,
              createTime: bossCreateTime
            }, function(res) {
              loginWith('arthur', '1', 1);
            });
          });

          it('返回正确的列表', function() {
            request('area.bossHandler.bossList', {}, function(data) {
              console.log(data);
              expect(data.code).toEqual(200);

              var boss = data.msg[0];
              //expect(boss.bossId).toEqual(3);
              expect(boss.playerId).toEqual(100);
              expect(boss.tableId).toEqual(1);
              expect(boss.countLeft).toEqual(9);
              expect(boss.status).toEqual(4);
              expect(boss.timeLeft).toEqual(0);

              doAjax('/boss/' + boss.bossId, {}, function(res) {
                expect(res.data.status).toEqual(4);
              });
            });
          });
        });

        describe('苏醒的boss, 消失状态', function() {
          var bossCreateTime = new Date().getTime() - 14 * 60 * 60 * 1000;

          beforeEach(function() {
            doAjax('/create/boss', {
              playerId: 100,
              tableId: 1,
              atkCount: 1,
              status: 2,
              createTime: bossCreateTime
            }, function(res) {
              loginWith('arthur', '1', 1);
            });
          });

          it('返回正确的列表', function() {
            request('area.bossHandler.bossList', {}, function(data) {
              console.log(data);
              expect(data.code).toEqual(200);

              expect(data.msg).toEqual([]);
            });
          });
        });

        describe('逃走的boss, boss被攻击次数用完, 未消失', function() {
          var bossCreateTime = new Date().getTime() - 6 * 60 * 60 * 1000;
          var deathTime = new Date().getTime() - 60 * 60 * 1000;

          beforeEach(function() {
            doAjax('/create/boss', {
              playerId: 100,
              tableId: 1,
              atkCount: 10,
              status: 3,
              createTime: bossCreateTime,
              deathTime: deathTime
            }, function(res) {
              loginWith('arthur', '1', 1);
            });
          });

          it('返回正确的列表', function() {
            request('area.bossHandler.bossList', {}, function(data) {
              console.log(data);
              expect(data.code).toEqual(200);

              var boss = data.msg[0];
              //expect(boss.bossId).toEqual(3);
              expect(boss.playerId).toEqual(100);
              expect(boss.tableId).toEqual(1);
              expect(boss.countLeft).toEqual(0);
              expect(boss.status).toEqual(3);
              expect(Math.round(boss.timeLeft / 1000 / 60 / 60)).toEqual(6);

              doAjax('/boss/' + boss.bossId, {}, function(res) {
                expect(res.data.status).toEqual(3);
              });
            });
          });
        });

        describe('逃走的boss, boss被攻击次数用完, 已消失', function() {
          var bossCreateTime = new Date().getTime() - 6 * 60 * 60 * 1000;
          var deathTime = new Date().getTime() - 2 * 60 * 60 * 1000;

          beforeEach(function() {
            doAjax('/create/boss', {
              playerId: 100,
              tableId: 1,
              atkCount: 10,
              status: 3,
              createTime: bossCreateTime,
              deathTime: deathTime
            }, function(res) {
              loginWith('arthur', '1', 1);
            });
          });

          it('返回正确的列表', function() {
            request('area.bossHandler.bossList', {}, function(data) {
              console.log(data);
              expect(data.code).toEqual(200);

              expect(data.msg).toEqual([]);
            });
          });
        });

        describe('死亡的boss, 未消失', function() {
          var bossCreateTime = new Date().getTime() - 6 * 60 * 60 * 1000;
          var deathTime = new Date().getTime() - 60 * 60 * 1000;

          beforeEach(function() {
            doAjax('/create/boss', {
              playerId: 100,
              tableId: 1,
              atkCount: 9,
              status: 5,
              createTime: bossCreateTime,
              deathTime: deathTime
            }, function(res) {
              loginWith('arthur', '1', 1);
            });
          });

          it('返回正确的列表', function() {
            request('area.bossHandler.bossList', {}, function(data) {
              console.log(data);
              expect(data.code).toEqual(200);

              var boss = data.msg[0];
              //expect(boss.bossId).toEqual(3);
              expect(boss.playerId).toEqual(100);
              expect(boss.tableId).toEqual(1);
              expect(boss.countLeft).toEqual(1);
              expect(boss.status).toEqual(5);
              expect(Math.round(boss.timeLeft / 1000 / 60 / 60)).toEqual(6);

              doAjax('/boss/' + boss.bossId, {}, function(res) {
                expect(res.data.status).toEqual(5);
              });
            });
          });
        });

        describe('死亡的boss, 已消失', function() {
          var bossCreateTime = new Date().getTime() - 6 * 60 * 60 * 1000;
          var deathTime = new Date().getTime() - 3 * 60 * 60 * 1000;

          beforeEach(function() {
            doAjax('/create/boss', {
              playerId: 100,
              tableId: 1,
              atkCount: 10,
              status: 5,
              createTime: bossCreateTime,
              deathTime: deathTime
            }, function(res) {
              loginWith('arthur', '1', 1);
            });
          });

          it('返回正确的列表', function() {
            request('area.bossHandler.bossList', {}, function(data) {
              console.log(data);
              expect(data.code).toEqual(200);
              expect(data.msg).toEqual([]);
            });
          });
        });

      });

      describe('好友的Boss', function() {

        describe('没有Boss时', function() {
          beforeEach(function() {
            loginWith('arthur', '1', 1);
          });

          it('返回列表为空', function() {
            request('area.bossHandler.bossList', {}, function(data) {
              expect(data).toEqual({
                code: 200,
                msg: []
              });
            });
          });
        });

        describe('沉睡的boss', function() {
          var bossCreateTime = new Date().getTime();

          beforeEach(function() {
            doAjax('/create/boss', {
              playerId: 1,
              tableId: 1,
              createTime: bossCreateTime
            }, function(res) {
              loginWith('arthur', '1', 1);
            });
          });

          it('返回正确的列表', function() {
            request('area.bossHandler.bossList', {}, function(data) {
              expect(data.code).toEqual(200);
              expect(data.msg).toEqual([]);              

            });
          });
        });

        describe('苏醒的boss', function() {
          var bossCreateTime = new Date().getTime() - 60 * 60 * 1000;

          beforeEach(function() {
            doAjax('/create/boss', {
              playerId: 1,
              tableId: 1,
              atkCount: 1,
              status: 2,
              createTime: bossCreateTime
            }, function(res) {
              loginWith('arthur', '1', 1);
            });
          });

          it('返回正确的列表', function() {
            request('area.bossHandler.bossList', {}, function(data) {
              console.log(data);
              expect(data.code).toEqual(200);

              var boss = data.msg[0];
              //expect(boss.bossId).toEqual(2);
              expect(boss.playerId).toEqual(1);
              expect(boss.tableId).toEqual(1);
              expect(boss.countLeft).toEqual(9);
              expect(boss.status).toEqual(2);

              expect(Math.round(boss.timeLeft / 1000 / 60 / 60)).toEqual(11);

            });
          });
        });

        describe('苏醒的boss, 超时状态', function() {
          var bossCreateTime = new Date().getTime() - 12 * 60 * 60 * 1000;

          beforeEach(function() {
            doAjax('/create/boss', {
              playerId: 1,
              tableId: 1,
              atkCount: 1,
              status: 2,
              createTime: bossCreateTime
            }, function(res) {
              loginWith('arthur', '1', 1);
            });
          });

          it('返回正确的列表', function() {
            request('area.bossHandler.bossList', {}, function(data) {
              console.log(data);
              expect(data.code).toEqual(200);

              var boss = data.msg[0];
              //expect(boss.bossId).toEqual(3);
              expect(boss.playerId).toEqual(1);
              expect(boss.tableId).toEqual(1);
              expect(boss.countLeft).toEqual(9);
              expect(boss.status).toEqual(4);
              expect(boss.timeLeft).toEqual(0);

              doAjax('/boss/' + boss.bossId, {}, function(res) {
                expect(res.data.status).toEqual(4);
              });
            });
          });
        });

        describe('苏醒的boss, 消失状态', function() {
          var bossCreateTime = new Date().getTime() - 14 * 60 * 60 * 1000;

          beforeEach(function() {
            doAjax('/create/boss', {
              playerId: 1,
              tableId: 1,
              atkCount: 1,
              status: 2,
              createTime: bossCreateTime
            }, function(res) {
              loginWith('arthur', '1', 1);
            });
          });

          it('返回正确的列表', function() {
            request('area.bossHandler.bossList', {}, function(data) {
              console.log(data);
              expect(data.code).toEqual(200);

              expect(data.msg).toEqual([]);
            });
          });
        });

        describe('逃走的boss, boss被攻击次数用完, 未消失', function() {
          var bossCreateTime = new Date().getTime() - 6 * 60 * 60 * 1000;
          var deathTime = new Date().getTime() - 60 * 60 * 1000;

          beforeEach(function() {
            doAjax('/create/boss', {
              playerId: 1,
              tableId: 1,
              atkCount: 10,
              status: 3,
              createTime: bossCreateTime,
              deathTime: deathTime
            }, function(res) {
              loginWith('arthur', '1', 1);
            });
          });

          it('返回正确的列表', function() {
            request('area.bossHandler.bossList', {}, function(data) {
              console.log(data);
              expect(data.code).toEqual(200);

              var boss = data.msg[0];
              //expect(boss.bossId).toEqual(3);
              expect(boss.playerId).toEqual(1);
              expect(boss.tableId).toEqual(1);
              expect(boss.countLeft).toEqual(0);
              expect(boss.status).toEqual(3);
              expect(Math.round(boss.timeLeft / 1000 / 60 / 60)).toEqual(6);

              doAjax('/boss/' + boss.bossId, {}, function(res) {
                expect(res.data.status).toEqual(3);
              });
            });
          });
        });

        describe('逃走的boss, boss被攻击次数用完, 已消失', function() {
          var bossCreateTime = new Date().getTime() - 6 * 60 * 60 * 1000;
          var deathTime = new Date().getTime() - 2 * 60 * 60 * 1000;

          beforeEach(function() {
            doAjax('/create/boss', {
              playerId: 1,
              tableId: 1,
              atkCount: 10,
              status: 3,
              createTime: bossCreateTime,
              deathTime: deathTime
            }, function(res) {
              loginWith('arthur', '1', 1);
            });
          });

          it('返回正确的列表', function() {
            request('area.bossHandler.bossList', {}, function(data) {
              console.log(data);
              expect(data.code).toEqual(200);

              expect(data.msg).toEqual([]);
            });
          });
        });

        describe('死亡的boss, 未消失', function() {
          var bossCreateTime = new Date().getTime() - 6 * 60 * 60 * 1000;
          var deathTime = new Date().getTime() - 60 * 60 * 1000;

          beforeEach(function() {
            doAjax('/create/boss', {
              playerId: 1,
              tableId: 1,
              atkCount: 9,
              status: 5,
              createTime: bossCreateTime,
              deathTime: deathTime
            }, function(res) {
              loginWith('arthur', '1', 1);
            });
          });

          it('返回正确的列表', function() {
            request('area.bossHandler.bossList', {}, function(data) {
              console.log(data);
              expect(data.code).toEqual(200);

              var boss = data.msg[0];
              //expect(boss.bossId).toEqual(3);
              expect(boss.playerId).toEqual(1);
              expect(boss.tableId).toEqual(1);
              expect(boss.countLeft).toEqual(1);
              expect(boss.status).toEqual(5);
              expect(Math.round(boss.timeLeft / 1000 / 60 / 60)).toEqual(6);

              doAjax('/boss/' + boss.bossId, {}, function(res) {
                expect(res.data.status).toEqual(5);
              });
            });
          });
        });

        describe('死亡的boss, 已消失', function() {
          var bossCreateTime = new Date().getTime() - 6 * 60 * 60 * 1000;
          var deathTime = new Date().getTime() - 3 * 60 * 60 * 1000;

          beforeEach(function() {
            doAjax('/create/boss', {
              playerId: 1,
              tableId: 1,
              atkCount: 10,
              status: 5,
              createTime: bossCreateTime,
              deathTime: deathTime
            }, function(res) {
              loginWith('arthur', '1', 1);
            });
          });

          it('返回正确的列表', function() {
            request('area.bossHandler.bossList', {}, function(data) {
              console.log(data);
              expect(data.code).toEqual(200);
              expect(data.msg).toEqual([]);
            });
          });
        });

      });
    });
  });
});