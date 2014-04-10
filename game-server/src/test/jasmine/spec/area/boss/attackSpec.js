describe("Area Server", function() {
  describe("Boss Handler", function() {
    describe("area.bossHandler.attack", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });

      afterEach(function() {
        doAjax('/clear/boss', function() {});
        doAjax('/clear/bossAttack', function() {});
        doAjax('/clear/damageOfRank', function() {});
        doAjax('/clear/bossFriendReward', function() {});
      });

      describe('我的boss', function() {

        describe('死亡的Boss', function() {

          describe('生命值总和为0', function() {
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
                atkCount: 5,
                finder: 'Attacker',
                hp: '{"2":{"cardId":40001,"hp":0},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":0}}',
                createTime: bossCreateTime
              }, function(res) {
                bossId = res.insertId;
                loginWith('arthur', '1', 1);
              });
            });

            it('不能攻击死亡的Boss', function() {
              request('area.bossHandler.attack', {
                bossId: bossId
              }, function(data) {
                console.log(data);
                expect(data).toEqual({
                  code: 501,
                  msg: 'Boss已结束'
                });
              });
            });
          });

          describe('状态位死亡状态', function() {
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
                atkCount: 5,
                status: 5,
                finder: 'Attacker',
                hp: '{"2":{"cardId":40001,"hp":1111110},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":0}}',
                createTime: bossCreateTime
              }, function(res) {
                bossId = res.insertId;
                loginWith('arthur', '1', 1);
              });
            });

            it('不能攻击死亡的Boss', function() {
              request('area.bossHandler.attack', {
                bossId: bossId
              }, function(data) {
                console.log(data);
                expect(data).toEqual({
                  code: 501,
                  msg: 'Boss已结束'
                });
              });
            });
          });



        });

        describe('沉睡的Boss', function() {
          var before_player;
          var bossId;
          var bossCreateTime = new Date().getTime();

          beforeEach(function() {
            doAjax('/player/100', function(res) {
              before_player = res.data;
            });

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

          it('可以攻击，并返回正确的结果', function() {
            request('area.bossHandler.attack', {
              bossId: bossId
            }, function(data) {
              console.log('attak result: ', data);
              expect(data.code).toEqual(200);
              expect(data.msg.battleLog).toBeBattleLog();

              damages = []
              data.msg.battleLog.steps.forEach(function(s) {
                s.d.forEach(function(el, idx) {
                  if (parseInt(el) > 6) {
                    damages.push(Math.abs(s.e[idx]));
                  }
                });
              });
              total_damage = damages.reduce(function(x, y) {
                return x + y;
              }, 0)

              expect(data.msg.damage).toEqual(total_damage);
              expect(Math.ceil(data.msg.damage/1000*31*1.5)).toEqual(data.msg.battleLog.rewards.money);
              expect(Math.ceil(data.msg.damage/2000*1.5)).toEqual(data.msg.battleLog.rewards.honor);

              // 检查boss信息是否正确
              expect(data.msg.boss.finder).toEqual('Attacker');
              expect(data.msg.boss.killer).toEqual(null);
              expect(data.msg.boss.countLeft).toEqual(9);
              expect(data.msg.boss.status).toEqual(2);
              expect(data.msg.boss.tableId).toEqual(2);

              doAjax('/player/100', function(res) {
                expect(res.data.gold).toEqual(data.msg.gold);
                expect(res.data.money).toEqual(data.msg.battleLog.rewards.money + before_player.money);
                expect(res.data.honor).toEqual(data.msg.battleLog.rewards.honor + before_player.honor);
              });

              // 检查攻击记录是否正确
              doAjax('/bossAttack/query', {
                playerId: 100,
                bossId: bossId
              }, function(res) {
                console.log(res);
                expect(res.data.damage).toEqual(data.msg.damage);
                expect(res.data.money).toEqual(data.msg.battleLog.rewards.money);
                expect(res.data.honor).toEqual(data.msg.battleLog.rewards.honor);
                expect(res.data.moneyAdd).toEqual(null);
                expect(res.data.honorAdd).toEqual(null);

                var blId = res.data.battleLogId;
                // 检查battleLog是否正确
                doAjax('/battleLog/' + blId, function(res) {
                  expect(res.data.battleLog).toEqual(JSON.stringify(data.msg.battleLog));
                });
              });

              // 检查boss伤害排行信息
              doAjax('/damageOfRank/query', {
                playerId: 100,
                week: thisWeek()
              }, function(res) {
                console.log(res);
                expect(res.data.damage).toEqual(data.msg.damage);
                expect(res.data.got).toEqual(0);
                expect(res.data.kneelCount).toEqual(0);
              });

              doAjax('/player/100', function(res) {
                var atkTime = JSON.parse(res.data.cd).lastAtkTime;
                var now = new Date().getTime();
                var duration = atkTime + 30 * 60 * 1000 - now;
                expect(duration).toBeGreaterThan(29 * 60 * 1000);
              });

            });
          });
        });

        describe('苏醒的Boss', function() {
          var before_player;
          var bossId;
          var bossCreateTime = new Date().getTime() - 60 * 60 * 1000;

          beforeEach(function() {
            doAjax('/player/100', function(res) {
              before_player = res.data;
            });

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
              hp: '{"2":{"cardId":40001,"hp":79960000},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":0}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;
              loginWith('arthur', '1', 1);
            });
          });

          it('可以攻击，并返回正确的结果', function() {
            request('area.bossHandler.attack', {
              bossId: bossId
            }, function(data) {
              console.log('attak result: ', data);
              expect(data.code).toEqual(200);
              expect(data.msg.battleLog).toBeBattleLog();

              hp_left = 0
              _.each(data.msg.battleLog.cards, function(v, k) {
                if (parseInt(k) > 6) {
                  hp_left += v.hp_left;
                }
              });

              damages = []
              data.msg.battleLog.steps.forEach(function(s) {
                s.d.forEach(function(el, idx) {
                  if (parseInt(el) > 6) {
                    damages.push(Math.abs(s.e[idx]));
                  }
                });
              });
              total_damage = damages.reduce(function(x, y) {
                return x + y;
              }, 0)

              expect(data.msg.damage).toEqual(total_damage);

              // 检查boss信息是否正确
              expect(data.msg.boss.finder).toEqual('Attacker');
              expect(data.msg.boss.killer).toEqual(null);
              expect(data.msg.boss.countLeft).toEqual(8);
              expect(data.msg.boss.status).toEqual(2);
              expect(data.msg.boss.tableId).toEqual(2);

              doAjax('/player/100', function(res) {
                expect(res.data.gold).toEqual(data.msg.gold);
                expect(res.data.money).toEqual(data.msg.battleLog.rewards.money + before_player.money);
                expect(res.data.honor).toEqual(data.msg.battleLog.rewards.honor + before_player.honor);
              });

              // 检查攻击记录是否正确
              doAjax('/bossAttack/query', {
                playerId: 100,
                bossId: bossId
              }, function(res) {
                console.log(res);
                expect(res.data.damage).toEqual(data.msg.damage);
                expect(res.data.money).toEqual(data.msg.battleLog.rewards.money);
                expect(res.data.honor).toEqual(data.msg.battleLog.rewards.honor);
                expect(res.data.moneyAdd).toEqual(null);
                expect(res.data.honorAdd).toEqual(null);

                var blId = res.data.battleLogId;
                // 检查battleLog是否正确
                doAjax('/battleLog/' + blId, function(res) {
                  expect(res.data.battleLog).toEqual(JSON.stringify(data.msg.battleLog));
                });
              });

              // 检查boss伤害排行信息
              doAjax('/damageOfRank/query', {
                playerId: 100,
                week: thisWeek()
              }, function(res) {
                console.log(res);
                expect(res.data.damage).toEqual(data.msg.damage);
                expect(res.data.got).toEqual(0);
                expect(res.data.kneelCount).toEqual(0);
              });

              doAjax('/player/100', function(res) {
                var atkTime = JSON.parse(res.data.cd).lastAtkTime;
                var now = new Date().getTime();
                var duration = atkTime + 30 * 60 * 1000 - now;
                expect(duration).toBeGreaterThan(29 * 60 * 1000);
              });

            });
          });
        });

        describe('苏醒的Boss, 攻击后逃跑', function() {
          var before_player;
          var bossId;
          var bossCreateTime = new Date().getTime() - 6 * 60 * 60 * 1000;

          beforeEach(function() {
            doAjax('/player/100', function(res) {
              before_player = res.data;
            });

            doAjax('/update/player/100', {
              cd: JSON.stringify({
                lastAtkTime: 0
              })
            }, function() {});

            doAjax('/create/boss', {
              playerId: 100,
              tableId: 2,
              atkCount: 9,
              status: 2,
              finder: 'Attacker',
              hp: '{"2":{"cardId":40001,"hp":79960000},"4":{"cardId":40004,"hp":80000},"6":{"cardId":40004,"hp":80000}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;
              loginWith('arthur', '1', 1);
            });
          });

          it('可以攻击，并返回正确的结果', function() {
            request('area.bossHandler.attack', {
              bossId: bossId
            }, function(data) {
              console.log('attak result: ', data);
              expect(data.code).toEqual(200);
              expect(data.msg.battleLog).toBeBattleLog();

              damages = []
              data.msg.battleLog.steps.forEach(function(s) {
                s.d.forEach(function(el, idx) {
                  if (parseInt(el) > 6) {
                    damages.push(Math.abs(s.e[idx]));
                  }
                });
              });
              total_damage = damages.reduce(function(x, y) {
                return x + y;
              }, 0)

              expect(data.msg.damage).toEqual(total_damage);

              // 检查boss信息是否正确
              expect(data.msg.boss.finder).toEqual('Attacker');
              expect(data.msg.boss.killer).toEqual('Attacker');
              expect(data.msg.boss.countLeft).toEqual(0);
              expect(data.msg.boss.status).toEqual(3);
              expect(data.msg.boss.tableId).toEqual(2);

              doAjax('/boss/' + data.msg.boss.bossId, function(res) {
                expect(res.data.killer).toEqual('Attacker');
                expect(res.data.atkCount).toEqual(10);
                expect(res.data.status).toEqual(3);
                expect(res.data.tableId).toEqual(2);
                //expect(res.data.deathTime)
              });

              doAjax('/player/100', function(res) {
                expect(res.data.gold).toEqual(data.msg.gold);
                expect(res.data.money).toEqual(data.msg.battleLog.rewards.money + before_player.money);
                expect(res.data.honor).toEqual(data.msg.battleLog.rewards.honor + before_player.honor);
              });

              // 检查攻击记录是否正确
              doAjax('/bossAttack/query', {
                playerId: 100,
                bossId: bossId
              }, function(res) {
                console.log(res);
                expect(res.data.damage).toEqual(data.msg.damage);
                expect(res.data.money).toEqual(data.msg.battleLog.rewards.money);
                expect(res.data.honor).toEqual(data.msg.battleLog.rewards.honor);
                expect(res.data.moneyAdd).toEqual(null);
                expect(res.data.honorAdd).toEqual(null);

                var blId = res.data.battleLogId;
                // 检查battleLog是否正确
                doAjax('/battleLog/' + blId, function(res) {
                  expect(res.data.battleLog).toEqual(JSON.stringify(data.msg.battleLog));
                });
              });

              // 检查boss伤害排行信息
              doAjax('/damageOfRank/query', {
                playerId: 100,
                week: thisWeek()
              }, function(res) {
                console.log(res);
                expect(res.data.damage).toEqual(data.msg.damage);
                expect(res.data.got).toEqual(0);
                expect(res.data.kneelCount).toEqual(0);
              });

              doAjax('/player/100', function(res) {
                var atkTime = JSON.parse(res.data.cd).lastAtkTime;
                var now = new Date().getTime();
                var duration = atkTime + 30 * 60 * 1000 - now;
                expect(duration).toBeGreaterThan(29 * 60 * 1000);

                // expect(JSON.parse(res.data.task).boss).toEqual({
                //   count: 0,
                //   found: false
                // });
              });
            });
          });
        });

        describe('苏醒的Boss, 攻击后死亡', function() {
          var before_player;
          var bossId;
          var bossCreateTime = new Date().getTime() - 6 * 60 * 60 * 1000;

          beforeEach(function() {
            doAjax('/player/100', function(res) {
              before_player = res.data;
            });

            doAjax('/update/player/100', {
              cd: JSON.stringify({
                lastAtkTime: 0
              })
            }, function() {});

            doAjax('/create/boss', {
              playerId: 100,
              tableId: 2,
              atkCount: 8,
              status: 2,
              finder: 'Attacker',
              hp: '{"2":{"cardId":40001,"hp":1000},"4":{"cardId":40004,"hp":1000},"6":{"cardId":40004,"hp":1000}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;
              loginWith('arthur', '1', 1);
            });
          });

          it('可以攻击，并返回正确的结果', function() {
            request('area.bossHandler.attack', {
              bossId: bossId
            }, function(data) {
              console.log('attak result: ', data);
              expect(data.code).toEqual(200);
              expect(data.msg.battleLog).toBeBattleLog();
              expect(data.msg.battleLog.winner).toEqual('own');

              damages = []
              data.msg.battleLog.steps.forEach(function(s) {
                s.d.forEach(function(el, idx) {
                  if (parseInt(el) > 6) {
                    damages.push(Math.abs(s.e[idx]));
                  }
                });
              });
              total_damage = damages.reduce(function(x, y) {
                return x + y;
              }, 0)

              expect(data.msg.damage).toEqual(total_damage);

              // 检查boss信息是否正确
              expect(data.msg.boss.finder).toEqual('Attacker');
              expect(data.msg.boss.killer).toEqual('Attacker');
              expect(data.msg.boss.countLeft).toEqual(1);
              expect(data.msg.boss.status).toEqual(5);
              expect(data.msg.boss.tableId).toEqual(2);

              doAjax('/boss/' + data.msg.boss.bossId, function(res) {
                expect(res.data.killer).toEqual('Attacker');
                expect(res.data.atkCount).toEqual(9);
                expect(res.data.status).toEqual(5);
                expect(res.data.tableId).toEqual(2);
                //expect(res.data.deathTime)
              });

              doAjax('/player/100', function(res) {
                expect(res.data.gold).toEqual(data.msg.gold);
                expect(res.data.money).toEqual(data.msg.battleLog.rewards.money + before_player.money);
                expect(res.data.honor).toEqual(data.msg.battleLog.rewards.honor + before_player.honor);
              });

              // 检查攻击记录是否正确
              doAjax('/bossAttack/query', {
                playerId: 100,
                bossId: bossId
              }, function(res) {
                console.log(res);
                expect(res.data.damage).toEqual(data.msg.damage);
                expect(res.data.money).toEqual(data.msg.battleLog.rewards.money);
                expect(res.data.honor).toEqual(data.msg.battleLog.rewards.honor);
                expect(res.data.moneyAdd).toEqual(null);
                expect(res.data.honorAdd).toEqual(null);

                var blId = res.data.battleLogId;
                // 检查battleLog是否正确
                doAjax('/battleLog/' + blId, function(res) {
                  expect(res.data.battleLog).toEqual(JSON.stringify(data.msg.battleLog));
                });
              });

              // 检查boss伤害排行信息
              doAjax('/damageOfRank/query', {
                playerId: 100,
                week: thisWeek()
              }, function(res) {
                console.log(res);
                expect(res.data.damage).toEqual(data.msg.damage);
                expect(res.data.got).toEqual(0);
                expect(res.data.kneelCount).toEqual(0);
              });

              doAjax('/player/100', function(res) {
                var atkTime = JSON.parse(res.data.cd).lastAtkTime;
                var now = new Date().getTime();
                var duration = atkTime + 30 * 60 * 1000 - now;
                expect(duration).toBeGreaterThan(29 * 60 * 1000);

                // expect(JSON.parse(res.data.task).boss).toEqual({
                //   count: 0,
                //   found: false
                // });
              });

            });
          });
        });

        describe('超时的boss', function() {
          var bossId;
          var bossCreateTime = new Date().getTime() - 12 * 60 * 60 * 1000

          beforeEach(function() {
            doAjax('/update/player/100', {
              cd: JSON.stringify({
                lastAtkTime: 0
              })
            }, function() {});

            doAjax('/create/boss', {
              playerId: 100,
              tableId: 2,
              atkCount: 9,
              status: 2,
              hp: '{"2":{"cardId":40001,"hp":79940219},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":60825}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;
              loginWith('arthur', '1', 1);
            });

          });

          it('不能攻击boss', function() {
            request('area.bossHandler.attack', {
              bossId: bossId,
              inspireCount: 3
            }, function(data) {
              console.log('attak result: ', data);
              expect(data).toEqual({
                code: 501,
                msg: 'Boss已结束'
              });
            });
          });
        });

        describe('逃走的boss', function() {
          var bossId;
          var bossCreateTime = new Date().getTime() - 6 * 60 * 60 * 1000

          beforeEach(function() {

            doAjax('/update/player/100', {
              cd: JSON.stringify({
                lastAtkTime: 0
              })
            }, function() {});

            doAjax('/create/boss', {
              playerId: 100,
              tableId: 2,
              atkCount: 10,
              status: 2,
              hp: '{"2":{"cardId":40001,"hp":79940219},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":60825}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;
              loginWith('arthur', '1', 1);
            });

          });

          it('不能攻击boss', function() {
            request('area.bossHandler.attack', {
              bossId: bossId,
              inspireCount: 3
            }, function(data) {
              console.log('attak result: ', data);
              expect(data).toEqual({
                code: 501,
                msg: 'Boss已结束'
              });
            });
          });
        });

        describe('消失的boss', function() {
          var bossId;
          var bossCreateTime = new Date().getTime() - 14 * 60 * 60 * 1000

          beforeEach(function() {
            doAjax('/update/player/100', {
              cd: JSON.stringify({
                lastAtkTime: 0
              })
            }, function() {});

            doAjax('/create/boss', {
              playerId: 100,
              tableId: 2,
              atkCount: 9,
              status: 2,
              hp: '{"2":{"cardId":40001,"hp":79940219},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":60825}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;
              loginWith('arthur', '1', 1);
            });

          });

          it('不能攻击boss', function() {
            request('area.bossHandler.attack', {
              bossId: bossId,
              inspireCount: 3
            }, function(data) {
              console.log('attak result: ', data);
              expect(data).toEqual({
                code: 501,
                msg: 'Boss已结束'
              });
            });
          });
        });

        describe('陌生人的boss', function() {
          var bossId;
          var bossCreateTime = new Date().getTime() - 5 * 60 * 60 * 1000

          beforeEach(function() {
            doAjax('/update/player/100', {
              cd: JSON.stringify({
                lastAtkTime: 0
              })
            }, function() {});

            doAjax('/create/boss', {
              playerId: 2,
              tableId: 2,
              atkCount: 9,
              status: 2,
              hp: '{"2":{"cardId":40001,"hp":79940219},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":60825}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;
              loginWith('arthur', '1', 1);
            });

          });

          it('不能攻击boss', function() {
            request('area.bossHandler.attack', {
              bossId: bossId,
              inspireCount: 3
            }, function(data) {
              console.log('attak result: ', data);
              expect(data).toEqual({
                code: 501,
                msg: '不能攻击陌生人的Boss哦'
              });
            });
          });
        });

        describe('玩家在cd冷却时间内', function() {
          var bossId;
          var bossCreateTime = new Date().getTime() - 5 * 60 * 60 * 1000

          beforeEach(function() {

            doAjax('/create/boss', {
              playerId: 100,
              tableId: 2,
              atkCount: 9,
              status: 2,
              hp: '{"2":{"cardId":40001,"hp":79940219},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":60825}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;

              doAjax('/update/player/100', {
                cd: {
                  lastAtkTime: new Date().getTime() - 10 * 60 * 1000
                }
              }, function() {
                loginWith('arthur', '1', 1);
              });

            });

          });

          it('不能攻击boss', function() {
            request('area.bossHandler.attack', {
              bossId: bossId,
              inspireCount: 3
            }, function(data) {
              console.log('attak result: ', data);
              expect(data).toEqual({
                code: 501,
                msg: '不能攻击'
              });
            });
          });
        });

        describe('魔石不足', function() {
          var bossId;
          var bossCreateTime = new Date().getTime() - 5 * 60 * 60 * 1000

          beforeEach(function() {

            doAjax('/create/boss', {
              playerId: 100,
              tableId: 2,
              atkCount: 9,
              status: 2,
              hp: '{"2":{"cardId":40001,"hp":79940219},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":60825}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;

              doAjax('/update/player/100', {
                cd: {
                  lastAtkTime: 0
                },
                gold: 10
              }, function() {
                loginWith('arthur', '1', 1);
              });

            });

          });

          it('不能攻击boss', function() {
            request('area.bossHandler.attack', {
              bossId: bossId,
              inspireCount: 5
            }, function(data) {
              console.log('attak result: ', data);
              expect(data).toEqual({
                code: 501,
                msg: '魔石不足'
              });
            });
          });
        });

      });

      describe('好友的boss', function() {

        describe('沉睡的Boss', function() {

          var bossId;
          var bossCreateTime = new Date().getTime() - 5 * 60 * 60 * 1000

          beforeEach(function() {

            doAjax('/create/boss', {
              playerId: 1,
              tableId: 2,
              atkCount: 0,
              status: 1,
              hp: '{"2":{"cardId":40001,"hp":79940219},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":60825}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;

              doAjax('/update/player/100', {
                cd: {
                  lastAtkTime: 0
                }
              }, function() {
                loginWith('arthur', '1', 1);
              });

            });

          });

          it('不能攻击boss', function() {
            request('area.bossHandler.attack', {
              bossId: bossId,
              inspireCount: 0
            }, function(data) {
              console.log('attak result: ', data);
              expect(data).toEqual({
                code: 501,
                msg: 'Boss未苏醒'
              });
            });
          });

        });


        describe('苏醒的Boss', function() {
          var before_player;
          var bossId;
          var bossCreateTime = new Date().getTime();

          beforeEach(function() {
            doAjax('/update/player/100', {
              cd: JSON.stringify({
                lastAtkTime: 0
              }),
              gold: 10000
            }, function() {});


            doAjax('/player/100', function(res) {
              before_player = res.data;
            });

            doAjax('/create/boss', {
              playerId: 1,
              tableId: 2,
              atkCount: 6,
              status: 2,
              hp: '{"2":{"cardId":40001,"hp":79940219},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":60825}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;
              loginWith('arthur', '1', 1);
            });
          });

          it('可以攻击，并返回正确的结果', function() {
            request('area.bossHandler.attack', {
              bossId: bossId,
              inspireCount: 3
            }, function(data) {
              console.log('attak result: ', data);
              expect(data.code).toEqual(200);
              expect(data.msg.battleLog).toBeBattleLog();

              damages = []
              data.msg.battleLog.steps.forEach(function(s) {
                s.d.forEach(function(el, idx) {
                  if (parseInt(el) > 6) {
                    damages.push(Math.abs(s.e[idx]));
                  }
                });
              });
              total_damage = damages.reduce(function(x, y) {
                return x + y;
              }, 0)

              expect(data.msg.damage).toEqual(total_damage);

              doAjax('/player/100', function(res) {
                expect(res.data.gold).toEqual(data.msg.gold);
                expect(data.msg.gold).toEqual(before_player.gold - 60);
                expect(res.data.money).toEqual(data.msg.battleLog.rewards.money + before_player.money);
                expect(res.data.honor).toEqual(data.msg.battleLog.rewards.honor + before_player.honor);
              });
            })
          });
        });


        describe('苏醒的Boss，攻击后逃走', function() {
          var before_player;
          var bossId;
          var bossCreateTime = new Date().getTime();

          beforeEach(function() {
            doAjax('/update/player/100', {
              cd: JSON.stringify({
                lastAtkTime: 0
              }),
              gold: 10000
            }, function() {});

            doAjax('/update/player/1', {
              task: {
                boss: {
                  count: 3,
                  found: true
                }
              }
            }, function() {});

            doAjax('/player/100', function(res) {
              before_player = res.data;
            });

            doAjax('/create/boss', {
              playerId: 1,
              tableId: 2,
              atkCount: 9,
              status: 2,
              hp: '{"2":{"cardId":40001,"hp":79940219},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":60825}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;
              loginWith('arthur', '1', 1);
            });
          });

          it('可以攻击，并返回正确的结果', function() {
            request('area.bossHandler.attack', {
              bossId: bossId,
              inspireCount: 3
            }, function(data) {
              console.log('attak result: ', data);
              expect(data.code).toEqual(200);
              expect(data.msg.battleLog).toBeBattleLog();

              damages = []
              data.msg.battleLog.steps.forEach(function(s) {
                s.d.forEach(function(el, idx) {
                  if (parseInt(el) > 6) {
                    damages.push(Math.abs(s.e[idx]));
                  }
                });
              });
              total_damage = damages.reduce(function(x, y) {
                return x + y;
              }, 0)

              expect(data.msg.damage).toEqual(total_damage);

              doAjax('/player/100', function(res) {
                expect(res.data.gold).toEqual(data.msg.gold);
                expect(data.msg.gold).toEqual(before_player.gold - 60);
                expect(res.data.money).toEqual(data.msg.battleLog.rewards.money + before_player.money);
                expect(res.data.honor).toEqual(data.msg.battleLog.rewards.honor + before_player.honor);
              });

              doAjax('/boss/' + bossId, function(res) {
                expect(res.data.status).toEqual(3);
                expect(res.data.atkCount).toEqual(10);
              });

              // doAjax('/player/1', function(res) {
              //   expect(JSON.parse(res.data.task).boss).toEqual({
              //     count: 0,
              //     found: false
              //   });
              // });

            });
          });
        });

        describe('苏醒的Boss，攻击后死亡', function() {
          var before_player;
          var bossId;
          var bossCreateTime = new Date().getTime();

          beforeEach(function() {
            doAjax('/update/player/100', {
              cd: JSON.stringify({
                lastAtkTime: 0
              }),
              gold: 10000
            }, function() {});

            doAjax('/update/player/1', {
              task: {
                boss: {
                  count: 3,
                  found: true
                }
              }
            }, function() {});

            doAjax('/player/100', function(res) {
              before_player = res.data;
            });

            doAjax('/create/boss', {
              playerId: 1,
              tableId: 2,
              atkCount: 6,
              status: 2,
              hp: '{"2":{"cardId":40001,"hp":1000},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":1000}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;
              loginWith('arthur', '1', 1);
            });
          });

          it('可以攻击，并返回正确的结果', function() {
            request('area.bossHandler.attack', {
              bossId: bossId,
              inspireCount: 3
            }, function(data) {
              console.log('attak result: ', data);
              expect(data.code).toEqual(200);
              expect(data.msg.battleLog).toBeBattleLog();

              damages = []
              data.msg.battleLog.steps.forEach(function(s) {
                s.d.forEach(function(el, idx) {
                  if (parseInt(el) > 6) {
                    damages.push(Math.abs(s.e[idx]));
                  }
                });
              });
              total_damage = damages.reduce(function(x, y) {
                return x + y;
              }, 0)

              expect(data.msg.damage).toEqual(total_damage);

              doAjax('/player/100', function(res) {
                expect(res.data.gold).toEqual(data.msg.gold);
                expect(data.msg.gold).toEqual(before_player.gold - 60);
                expect(res.data.money).toEqual(data.msg.battleLog.rewards.money + before_player.money);
                expect(res.data.honor).toEqual(data.msg.battleLog.rewards.honor + before_player.honor);
              });

              doAjax('/boss/' + bossId, function(res) {
                expect(res.data.status).toEqual(5);
                expect(res.data.atkCount).toEqual(7);
              });

              // doAjax('/player/1', function(res) {
              //   expect(JSON.parse(res.data.task).boss).toEqual({
              //     count: 0,
              //     found: false
              //   });
              // });

            });
          });
        });



        describe('超时的boss', function() {
          var bossId;
          var bossCreateTime = new Date().getTime() - 12 * 60 * 60 * 1000

          beforeEach(function() {
            doAjax('/update/player/100', {
              cd: JSON.stringify({
                lastAtkTime: 0
              })
            }, function() {});

            doAjax('/create/boss', {
              playerId: 1,
              tableId: 2,
              atkCount: 9,
              status: 2,
              hp: '{"2":{"cardId":40001,"hp":79940219},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":60825}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;
              loginWith('arthur', '1', 1);
            });

          });

          it('不能攻击boss', function() {
            request('area.bossHandler.attack', {
              bossId: bossId,
              inspireCount: 3
            }, function(data) {
              console.log('attak result: ', data);
              expect(data).toEqual({
                code: 501,
                msg: 'Boss已结束'
              });
            });
          });
        });

        describe('逃走的boss', function() {
          var bossId;
          var bossCreateTime = new Date().getTime() - 6 * 60 * 60 * 1000

          beforeEach(function() {

            doAjax('/update/player/100', {
              cd: JSON.stringify({
                lastAtkTime: 0
              })
            }, function() {});

            doAjax('/create/boss', {
              playerId: 1,
              tableId: 2,
              atkCount: 10,
              status: 2,
              hp: '{"2":{"cardId":40001,"hp":79940219},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":60825}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;
              loginWith('arthur', '1', 1);
            });

          });

          it('不能攻击boss', function() {
            request('area.bossHandler.attack', {
              bossId: bossId,
              inspireCount: 3
            }, function(data) {
              console.log('attak result: ', data);
              expect(data).toEqual({
                code: 501,
                msg: 'Boss已结束'
              });
            });
          });
        });

        describe('消失的boss', function() {
          var bossId;
          var bossCreateTime = new Date().getTime() - 14 * 60 * 60 * 1000

          beforeEach(function() {
            doAjax('/update/player/100', {
              cd: JSON.stringify({
                lastAtkTime: 0
              })
            }, function() {});

            doAjax('/create/boss', {
              playerId: 1,
              tableId: 2,
              atkCount: 9,
              status: 2,
              hp: '{"2":{"cardId":40001,"hp":79940219},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":60825}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;
              loginWith('arthur', '1', 1);
            });

          });

          it('不能攻击boss', function() {
            request('area.bossHandler.attack', {
              bossId: bossId,
              inspireCount: 3
            }, function(data) {
              console.log('attak result: ', data);
              expect(data).toEqual({
                code: 501,
                msg: 'Boss已结束'
              });
            });
          });
        });

        describe('陌生人的boss', function() {
          var bossId;
          var bossCreateTime = new Date().getTime() - 5 * 60 * 60 * 1000

          beforeEach(function() {
            doAjax('/update/player/100', {
              cd: JSON.stringify({
                lastAtkTime: 0
              })
            }, function() {});

            doAjax('/create/boss', {
              playerId: 2,
              tableId: 2,
              atkCount: 9,
              status: 2,
              hp: '{"2":{"cardId":40001,"hp":79940219},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":60825}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;
              loginWith('arthur', '1', 1);
            });

          });

          it('不能攻击boss', function() {
            request('area.bossHandler.attack', {
              bossId: bossId,
              inspireCount: 3
            }, function(data) {
              console.log('attak result: ', data);
              expect(data).toEqual({
                code: 501,
                msg: '不能攻击陌生人的Boss哦'
              });
            });
          });
        });

        describe('玩家在cd冷却时间内', function() {
          var bossId;
          var bossCreateTime = new Date().getTime() - 5 * 60 * 60 * 1000

          beforeEach(function() {

            doAjax('/create/boss', {
              playerId: 1,
              tableId: 2,
              atkCount: 9,
              status: 2,
              hp: '{"2":{"cardId":40001,"hp":79940219},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":60825}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;

              doAjax('/update/player/100', {
                cd: {
                  lastAtkTime: new Date().getTime() - 10 * 60 * 1000
                }
              }, function() {
                loginWith('arthur', '1', 1);
              });

            });

          });

          it('不能攻击boss', function() {
            request('area.bossHandler.attack', {
              bossId: bossId,
              inspireCount: 3
            }, function(data) {
              console.log('attak result: ', data);
              expect(data).toEqual({
                code: 501,
                msg: '不能攻击'
              });
            });
          });
        });

        describe('魔石不足', function() {
          var bossId;
          var bossCreateTime = new Date().getTime() - 5 * 60 * 60 * 1000

          beforeEach(function() {

            doAjax('/create/boss', {
              playerId: 1,
              tableId: 2,
              atkCount: 9,
              status: 2,
              hp: '{"2":{"cardId":40001,"hp":79940219},"4":{"cardId":40004,"hp":0},"6":{"cardId":40004,"hp":60825}}',
              createTime: bossCreateTime
            }, function(res) {
              bossId = res.insertId;

              doAjax('/update/player/100', {
                cd: {
                  lastAtkTime: 0
                },
                gold: 10
              }, function() {
                loginWith('arthur', '1', 1);
              });

            });

          });

          it('不能攻击boss', function() {
            request('area.bossHandler.attack', {
              bossId: bossId,
              inspireCount: 5
            }, function(data) {
              console.log('attak result: ', data);
              expect(data).toEqual({
                code: 501,
                msg: '魔石不足'
              });
            });
          });
        });



      });

    });
  });
});