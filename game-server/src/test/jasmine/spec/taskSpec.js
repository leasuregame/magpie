describe("Logic Server # ", function() {
  var pomelo = window.pomelo;
  var userid;

  beforeAll(function() {
    doAjax('/loaddata/csv', {}, function(data) {
      expect(data).toEqual('done');
    });
  });

  describe("Task Handler", function() {
    var pid = 100;

    describe("logic.taskHandler.explore", function() {

      it("should can be return the correct explore result", function() {
        request('logic.taskHandler.explore', {
          playerId: pid,
          taskId: 6
        }, function(data) {
          console.log(data);
          expect(data.code).toEqual(200);
          expect(data.msg).hasProperties([
            'result',
            'power_consume',
            'exp_obtain',
            'money_obtain',
            'upgrade',
            'open_box_card',
            'battle_log',
            'fragment'
          ]);

          var res = data.msg;
          switch (res.result) {
            case 'fight':
              expect(res.battle_log).toBeBattleLog();
              break;
            case 'box':
              expect(typeof res.open_box_card).toEqual('object');
              expect(res.open_box_card).hasProperties([
                'id', 'lv', 'exp', 'star', 'tableId', 'skillLv', 'hpAddition', 'atkAddition',
                'passiveSkills', 'playerId'
              ])
              break;
            default:
              expect(res.result).toEqual('none');
              expect(res.battle_log).toEqual(null);
              expect(res.open_box_card).toEqual(null);
          }

          expect(res.power_consume).toEqual(5);
          expect(res.exp_obtain).toEqual(145);
          expect(res.money_obtain).toEqual(290);
          expect(typeof res.upgrade).toEqual('boolean');
          expect(typeof res.fragment).toEqual('boolean');
        });
      });

      describe('when power is not enought', function() {
        it('should can not explore', function() {
          request('logic.taskHandler.explore', {
            playerId: 102,
            taskId: 6
          }, function(data) {
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('体力不足');
          });
        });
      });

    });

    describe("logic.taskHandler.passBarrier", function() {

      it("should can be execute and return result of pass barrier", function() {
        request('logic.taskHandler.passBarrier', {
          playerId: pid
        }, function(data) {
          console.log('闯关', data);
          expect(data.code).toEqual(200);
          expect(data.msg).toBeDefined();
          expect(data.msg).hasProperties([
            'battleLog',
            'pass'
          ]);
          expect(data.msg.battleLog.winner).toEqual('own')
          expect(data.msg.battleLog.rewards).hasProperties(['exp', 'skillPoint'])
          expect(data.msg.pass).hasProperties(['layer', 'mark'])

          doAjax('/player/' + pid, {}, function(res) {
            expect(JSON.parse(res.data.pass)).toEqual({
              layer: 26,
              mark: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            });
          });

        });
      });

      it('should can not execute the pass that greater than the player has passed', function() {
        request('logic.taskHandler.passBarrier', {
          playerId: 102,
          layer: 27
        }, function(data) {
          expect(data).toEqual({
            code: 501,
            msg: '不能闯此关'
          });
        });
      });

      it('should can not execute the pass that less than 1', function() {
        request('logic.taskHandler.passBarrier', {
          playerId: 102,
          layer: 0
        }, function(data) {
          expect(data).toEqual({
            code: 501,
            msg: '不能闯此关'
          });
        });
      });

      it('should can not execute the pass that greater than 100', function() {
        request('logic.taskHandler.passBarrier', {
          playerId: 102,
          layer: 101
        }, function(data) {
          expect(data).toEqual({
            code: 501,
            msg: '不能闯此关'
          });
        });
      });

    });

    describe("logic.taskHandler.wipeOut", function() {
      var before_data;

      describe("task wipeOut", function() {
        beforeEach(function() {
          doAjax('/player/' + pid, {}, function(res) {
            console.log('before each: ', res);
            before_data = {
              exp: res.data.exp,
              money: res.data.money,
              gold: res.data.gold,
              skill_point: res.data.skillPoint
            }
          });
        });

        it("任务 should can be 扫荡", function() {
          request('logic.taskHandler.wipeOut', {
            playerId: pid,
            type: 'task'
          }, function(data) {
            console.log('任务扫荡', data);
            expect(data.code).toEqual(200);
            expect(data.msg).hasProperties([
              'pass',
              'rewards'
            ]);

            doAjax('/player/' + pid, {}, function(res) {
              expect(data.msg.rewards).toEqual({
                exp_obtain: res.data.exp - before_data.exp,
                money_obtain: res.data.money - before_data.money,
                gold_obtain: res.data.gold - before_data.gold
              });
            });
          });
        });
      });

      describe("pass wipeOut", function() {
        beforeEach(function() {
          doAjax('/player/' + 103, {}, function(res) {
            console.log('before each: ', res);
            before_data = {
              exp: res.data.exp,
              money: res.data.money,
              gold: res.data.gold,
              skill_point: res.data.skillPoint
            }
          });
        });

        it("精英关卡 should can be 扫荡", function() {
          request('logic.taskHandler.wipeOut', {
            playerId: 103,
            type: 'pass'
          }, function(data) {
            console.log('关卡扫荡', data);
            expect(data.code).toEqual(200);
            expect(_.keys(data.msg).sort()).toEqual([
              'pass',
              'rewards'
            ].sort());

            doAjax('/player/' + 103, {}, function(res) {
              expect(data.msg.rewards).toEqual({
                exp_obtain: res.data.exp - before_data.exp,
                money_obtain: res.data.money - before_data.money,
                gold_obtain: res.data.gold - before_data.gold,
                skill_point: res.data.skillPoint - before_data.skill_point
              });
            });
          });
        });

        describe("when all pass have been passed", function() {
          it("should return there is not pass to be execute", function() {
            request('logic.taskHandler.wipeOut', {
              playerId: 103,
              type: 'pass'
            }, function(data) {
              console.log('关卡扫荡', data);
              expect(data).toEqual({
                code: 501,
                msg: '没有关卡可以扫荡'
              });
            });
          });
        });

      });

    });

    describe("logic.trainHandler.luckyCard", function() {
      var LOTTERY_TYPE = {
        GOLD: 1,
        ENERGY: 0
      };

      var GRADE = {
        LOWER: 1,
        MEDIUM: 2,
        HIGHT: 3
      };

      var CARD_SCOPE = {
        "1": {
          from: 0,
          to: 6
        },
        "2": {
          from: 1,
          to: 6
        },
        "3": {
          from: 2,
          to: 6
        }
      };

      var checkCard = function(card, min_star, max_star) {
        console.log('star: ', card.star);
        expect(card.star).toBeLessThan(max_star);
        expect(card.star).toBeGreaterThan(min_star);

        expect(card.star % 5).toEqual(card.tableId % 5);

        var ps_names = ['crit', 'dodge', 'atk_improve', 'hp_improve', 'dmg_reduce'];
        if (card.star >= 3) {
          expect(card.passiveSkills.length).toEqual(card.star - 2);
          for (var i = 0; i < card.passiveSkills.length; i++) {
            var ps = card.passiveSkills[i];
            expect(ps.cardId).toEqual(card.id);
            expect(ps.value).toBeLessThan(5);
            expect(ps.value).toBeGreaterThan(0);
            expect(ps_names).toContain(ps.name);
          }
        } else {
          expect(card.passiveSkills.length).toEqual(0);
        }
      };

      var execute_suit = function(name, level) {
        describe(name, function() {
          var before_gold, before_energy, before_fragments;

          beforeEach(function() {
            doAjax('/player/' + pid, {}, function(res) {
              before_gold = res.data.gold;
              before_energy = res.data.energy;
              before_fragments = res.data.fragments;
            });
          });

          var test = function(test_name, type) {
            it(test_name, function() {
              request('logic.trainHandler.luckyCard', {
                playerId: pid,
                type: type,
                level: level
              }, function(data) {
                console.log(name, test_name, data);
                expect(data.code).toEqual(200);
                expect(data.msg).hasProperties([
                  'card',
                  'consume',
                  'hasFragment'
                ]);

                var card = data.msg.card;
                var scope = CARD_SCOPE[level];
                checkCard(card, scope.from, scope.to);

                doAjax('/card/' + card.id, {}, function(res) {
                  expect(res.data).toEqual({
                    id: card.id,
                    createTime: card.createTime,
                    playerId: card.playerId,
                    tableId: card.tableId,
                    star: card.star,
                    lv: card.lv,
                    exp: card.exp,
                    skillLv: card.skillLv,
                    hpAddition: card.hpAddition,
                    atkAddition: card.atkAddition
                  });
                });

                card.passiveSkills.forEach(function(ps) {
                  doAjax('/passiveSkill/' + ps.id, {}, function(res) {
                    expect(res.data).toEqual({
                      id: ps.id,
                      createTime: ps.createTime,
                      cardId: ps.cardId,
                      name: ps.name,
                      value: ps.value
                    });
                  });
                });

                doAjax('/player/' + pid, {}, function(res) {
                  if (type == LOTTERY_TYPE.GOLD) {
                    expect(res.data.gold).toEqual(before_gold - data.msg.consume);
                  } else {
                    expect(res.data.energy).toEqual(before_energy - data.msg.consume);
                  }

                  if (data.msg.hasFragment) {
                    expect(res.data.fragments).toEqual(before_fragments + 1);
                  } else {
                    expect(res.data.fragments).toEqual(before_fragments);
                  }

                });

              });
            });
          };

          test("元宝抽卡 >> should can be get a lucky card", LOTTERY_TYPE.GOLD);
          test("活力值抽卡 >> should can be get a lucky card", LOTTERY_TYPE.ENERGY);

        });
      };

      execute_suit('低级抽卡', GRADE.LOWER);
      execute_suit('中级抽卡', GRADE.MEDIUM);
      execute_suit('高级抽卡', GRADE.HIGHT);

      describe("when gold or energy is not enought", function() {
        it("元宝不足时，不能抽卡", function() {
          request('logic.trainHandler.luckyCard', {
            playerId: 104,
            type: LOTTERY_TYPE.GOLD,
            level: 1
          }, function(data) {
            console.log(data);
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('没有足够的资源来完成本次抽卡');
          });
        });

        it("友情值不足时，不能抽卡", function() {
          request('logic.trainHandler.luckyCard', {
            playerId: 105,
            type: LOTTERY_TYPE.ENERGY,
            level: 1
          }, function(data) {
            console.log(data);
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('没有足够的资源来完成本次抽卡');
          });
        });

      });
    });


    describe("logic.trainHandler.strengthen", function() {
      var before_player, before_card;

      beforeEach(function() {
        doAjax('/player/' + pid, {}, function(res) {
          before_player = res.data;
        });

        doAjax('/card/' + 100, {}, function(res) {
          before_card = res.data;
        });
      });

      it("should can be strenthen, and return properties", function() {
        request('logic.trainHandler.strengthen', {
          playerId: pid,
          target: 100,
          sources: [150, 151]
        }, function(data) {
          console.log(data);
          expect(data.code).toEqual(200);
          expect(data.msg).hasProperties([
            'exp_obtain',
            'money_consume',
            'cur_lv',
            'cur_exp'
          ]);

          doAjax('/player/' + pid, {}, function(res) {
            var _player = res.data;
            expect(_player.money).toEqual(before_player.money - data.msg.money_consume);
          });

          doAjax('/card/' + 100, {}, function(res) {
            var _card = res.data;
            expect(_card.lv).toEqual(data.msg.cur_lv);
            expect(_card.exp).toEqual(data.msg.cur_exp);
          });

          doAjax('/card/' + 150, {}, function(res) {
            expect(res).toEqual({
              code: 404,
              data: 'card not exists'
            });
          });

          doAjax('/card/' + 151, {}, function(res) {
            expect(res).toEqual({
              code: 404,
              data: 'card not exists'
            });
          });

        });
      });

      describe("when money is not enought", function() {
        it("should warnning a message that can not strengthen", function() {
          request('logic.trainHandler.strengthen', {
            playerId: 106,
            target: 160,
            sources: [150, 151]
          }, function(data) {
            console.log(data);
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('找不到素材卡牌');
          });
        });

        it("should warnning a message that can not strengthen", function() {
          request('logic.trainHandler.strengthen', {
            playerId: 106,
            target: 100,
            sources: [161, 162]
          }, function(data) {
            console.log(data);
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('找不到目标卡牌');
          });
        });

        it("should warnning a message that can not strengthen", function() {
          request('logic.trainHandler.strengthen', {
            playerId: 106,
            target: 160,
            sources: [161, 162]
          }, function(data) {
            console.log(data);
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('铜板不足');
          });
        });
      });

      describe("when parameter sources is empty", function() {
        it("should warning a message", function() {
          request('logic.trainHandler.strengthen', {
            playerId: pid,
            target: 100,
            sources: []
          }, function(data) {
            console.log(data);
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('素材卡牌不能为空');
          });
        });
      });

    });

    // 技能升级
    describe("logic.trainHandler.skillUpgrade", function() {
      var before_player, before_card;

      beforeEach(function() {
        doAjax('/player/' + pid, {}, function(res) {
          before_player = res.data;
        });

        doAjax('/card/' + 100, {}, function(res) {
          before_card = res.data;
        });
      });

      it("card's skill should can be upgrade", function() {
        request('logic.trainHandler.skillUpgrade', {
          playerId: pid,
          cardId: 100
        }, function(data) {
          expect(data.code).toEqual(200);
          console.log(data);

          doAjax('/player/' + pid, {}, function(res) {
            expect(res.data.skillPoint).toBeLessThan(before_player.skillPoint);
          });

          doAjax('/card/' + 100, {}, function(res) {
            expect(res.data.skillLv).toEqual(before_card.skillLv + 1);
          });
        });
      });

      describe("when target card is not exists", function() {
        it("can not upgrade card skill", function() {
          request('logic.trainHandler.skillUpgrade', {
            playerId: pid,
            cardId: 0
          }, function(data) {
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('找不到卡牌');
          })
        });
      });

      describe("when target card's star is less than 3", function() {
        it("can not upgrade card skill", function() {
          request('logic.trainHandler.skillUpgrade', {
            playerId: 1,
            cardId: 2
          }, function(data) {
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('三星级以下的卡牌没有技能，不能升级');
          })
        });
      });

      describe("when target card's star is 5(max star)", function() {
        it("can not upgrade card skill", function() {
          request('logic.trainHandler.skillUpgrade', {
            playerId: pid,
            cardId: 103
          }, function(data) {
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('该卡牌的技能等级已经升到最高级，不能再升级了');
          })
        });
      });

      describe("when player's skillPoint is not enought", function() {
        it("can not upgrade card skill", function() {
          request('logic.trainHandler.skillUpgrade', {
            playerId: 107,
            cardId: 163
          }, function(data) {
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('技能点不够，不能升级');
          })
        });
      });

    });

    describe("logic.trainHandler.passSkillAfresh", function() {
      var before_ps;

      beforeEach(function() {
        doAjax('/passiveSkill/' + 6, {}, function(res) {
          before_ps = res.data;
        });
      });

      it("card's pass skill should can be passSkillAfresh", function() {
        request('logic.trainHandler.passSkillAfresh', {
          playerId: pid,
          cardId: 101,
          psId: 6
        }, function(data) {
          expect(data.code).toEqual(200);
          expect(data.msg.value).toBeDefined();
          expect(_.isNumber(parseInt(data.msg.value))).toEqual(true);

          setTimeOut(function() {
            doAjax('/passiveSkill/' + 6, {}, function(res) {
              expect(res.data.value).toEqual(data.msg.value);
            });
          }, 2000);
          console.log(data);
        });
      });

      describe("when money is not enought", function() {
        it("should can not afrash", function() {
          request('logic.trainHandler.passSkillAfresh', {
            playerId: 106,
            cardId: 164,
            psId: 7
          }, function(data) {
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('铜板不足，不能洗炼');
            console.log(data);
          });
        });
      });

      describe("when passiveSkill is not exists", function() {
        it("should can not afrash", function() {
          request('logic.trainHandler.passSkillAfresh', {
            playerId: pid,
            cardId: 104,
            psId: 7
          }, function(data) {
            expect(data.code).toEqual(501);
            expect(data.msg).toEqual('找不到被动属性');
            console.log(data);
          });
        });
      });

    });

    describe("logic.trainHandler.smeltElixir", function() {
      var before_player;

      beforeEach(function() {
        doAjax('/player/' + pid, {}, function(res) {
          before_player = res.data;
        });
      });


      it("card should can be smelt to elixir", function() {
        request('logic.trainHandler.smeltElixir', {
          playerId: pid,
          cardIds: [150, 151, 152]
        }, function(data) {
          console.log(data);
          expect(data.code).toEqual(200);
          expect(data.msg).hasProperties([
            'elixir',
            'sum'
          ]);
          expect(data.msg.elixir.length).toEqual(3);

          doAjax('/player/' + pid, {}, function(res) {
            expect(res.data.elixir).toEqual(before.elixir + data.msg.sum);
          });

        });
      });

      it("when all card is not exists, should can not smelt", function() {
        request('logic.trainHandler.smeltElixir', {
          playerId: pid,
          cardIds: [161, 162]
        }, function(data) {
          console.log(data);
          expect(data.code).toEqual(501);
          expect(data.msg).toEqual('找不到卡牌');
        });
      });
    });

    describe("logic.trainHandler.starUpgrade", function() {
      var before_player, before_card;

      beforeEach(function() {
        doAjax('/player/' + 1, {}, function(res) {
          before_player = res.data;
        });

        doAjax('/card/' + 1, {}, function(res) {
          before_card = res.data;
        });
      });

      it("card' star should can be upgrade", function() {
        request(
          'logic.trainHandler.starUpgrade', {
            playerId: 1,
            target: 1,
            sources: [2, 3],
            gold: 1000,
            allInherit: false
          },
          function(data) {
            expect(data.code).toEqual(200);
            expect(data.msg.upgrade).toEqual(false);
            console.log(data);

            doAjax('/player/' + 1, {}, function(res) {
              expect(res.data.gold).toEqual(before_player.gold - 1000);
            });

            doAjax('/card/' + 1, {}, function(res) {
              if (data.msg.upgrade) {
                expect(res.data.star).toEqual(before_card.star + 1);
                
              } else {
                expect(res.data.star).toEqual(before_card.star);
              }
              expect()
            });


            doAjax('/card/' + 2, {}, function(res) {
              expect(res).toEqual({
                code: 404,
                data: 'card not exists'
              });
            });

            doAjax('/card/' + 3, {}, function(res) {
              expect(res).toEqual({
                code: 404,
                data: 'card not exists'
              });
            });
          }
        );
      });

      describe("when card's star is less then 3", function() {
        it('should can not upgrade star of card', function() {
          request(
            'logic.trainHandler.starUpgrade', {
              playerId: 1,
              target: 11,
              sources: [3, 4],
              gold: 0,
              allInherit: true
            },
            function(data) {
              expect(data.code).toEqual(501);
              expect(data.msg).toEqual('卡牌星级必须到达3级才能进阶');
              console.log(data);
            }
          );
        });
      });

      describe("when card's star is 5", function() {
        it('should can not upgrade star of card', function() {
          request(
            'logic.trainHandler.starUpgrade', {
              playerId: 1,
              target: 5,
              sources: [3, 4],
              gold: 0,
              allInherit: true
            },
            function(data) {
              expect(data.code).toEqual(501);
              expect(data.msg).toEqual('卡牌星级已经是最高级了');
              console.log(data);
            }
          );
        });
      });

      describe("when money is not enought", function() {
        it('should can not upgrade star of card', function() {
          request(
            'logic.trainHandler.starUpgrade', {
              playerId: 1,
              target: 1,
              sources: [3, 4],
              gold: 2000,
              allInherit: true
            },
            function(data) {
              expect(data.code).toEqual(501);
              expect(data.msg).toEqual('金币不足');
              console.log(data);
            }
          );
        });
      });

      describe("when card's count is grater then the max number", function() {
        it('should can not upgrade star of card', function() {
          request(
            'logic.trainHandler.starUpgrade', {
              playerId: 100,
              target: 100,
              sources: [101, 102],
              gold: 40000,
              allInherit: true
            },
            function(data) {
              expect(data.code).toEqual(501);
              expect(data.msg).toEqual('最多只能消耗20张卡牌来进行升级');
              console.log(data);
            }
          );
        });
      });

    });

    describe("logic.trainHandler.changeLineUp", function() {
      it("should can be change player's lineUp", function() {
        request(
          'logic.trainHandler.changeLineUp', {
            playerId: '1',
            lineUp: {
              1: 5,
              2: 4,
              3: 3,
              4: 2,
              5: 1
            }
          },
          function(data) {
            expect(data.code).toEqual(200);
            expect(data.msg.lineUp).toEqual({
              1: 5,
              2: 4,
              3: 3,
              4: 2,
              5: 1
            });
          }
        );
      });
    });

  });

});