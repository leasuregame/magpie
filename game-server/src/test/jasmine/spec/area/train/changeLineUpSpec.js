describe("Area Server", function() {

  describe("Train Handler", function() {
    var user1 = {
      id: 1,
      playerId: 1,
      areaId: 1,
      account: '1',
      password: '1'
    };
    beforeAll(function() {
      doAjax('/loaddata/csv', {}, function(data) {
        expect(data).toEqual('done');
      });
    });

    describe("area.trainHandler.changeLineUp", function() {
      beforeEach(function() {
        loginWith(user1.account, user1.password, user1.areaId);
      });

      describe('when do change line up', function() {
        it("should can be change player's lineUp", function() {
          request(
            'area.trainHandler.changeLineUp', {
              lineUp: {
                1: 5,
                2: 4,
                3: 3,
                6: -1
              },
              index: 0
            },
            function(data) {
              console.log(data);
              expect(data.code).toEqual(200);
              expect(data.msg.lineUp).toEqual([{
                1: 5,
                2: 4,
                3: 3,
                6: -1
              }]);
            }
          );

          request(
            'area.trainHandler.changeLineUp', {
              lineUp: {
                1: 5,
                2: 4,
                3: 3,
                4: 2,
                5: 1,
                6: -1
              },
              index: 0
            },
            function(data) {
              console.log(data);
              expect(data.code).toEqual(200);
              expect(data.msg.lineUp).toEqual([{
                1: 5,
                2: 4,
                3: 3,
                4: 2,
                5: 1,
                6: -1
              }]);
            }
          );

          request(
            'area.trainHandler.changeLineUp', {
              lineUp: {
                1: 5,
                2: 4,
                3: 3,
                4: 2,
                5: 1,
                6: -1
              },
              index: 1
            },
            function(data) {
              console.log(data);
              expect(data.code).toEqual(501);
              expect(data.msg).toEqual('上阵卡牌的不能重复');
            }
          );

          request(
            'area.trainHandler.changeLineUp', {
              lineUp: [{
                1: 5,
                2: 4,
                3: 3,
                6: -1
              },{
                4: 2,
                5: 1,
                6: -1
              }]
            },
            function(data) {
              console.log(data);
              expect(data.code).toEqual(200);
              expect(data.msg.lineUp).toEqual([{
                1: 5,
                2: 4,
                3: 3,
                6: -1
              },{
                4: 2,
                5: 1,
                6: -1
              }]);
            }
          );

          request(
            'area.trainHandler.changeLineUp', {
              lineUp: [{
                1: 5,
                2: 4,
                3: 3,
                6: -1
              },{
                4: 3,
                5: 1,
                6: -1
              }]
            },
            function(data) {
              console.log(data);
              expect(data.code).toEqual(501);
              expect(data.msg).toEqual('上阵卡牌的不能重复');
            }
          );

          request(
            'area.trainHandler.changeLineUp', {
              lineUp: [{
                1: 5,
                2: 4,
                3: 3,
                6: -1
              },{
                4: 2,
                5: 1
              }]
            },
            function(data) {
              console.log(data);
              expect(data.code).toEqual(501);
              expect(data.msg).toEqual('阵型中缺少元神信息');
            }
          );

          request(
            'area.trainHandler.changeLineUp', {
              lineUp: {
                1: 5,
                2: 4,
                3: 3,
                4: 2,
                5: 1,
                6: -1
              }
            },
            function(data) {
              console.log(data);
              expect(data.code).toEqual(501);
              expect(data.msg).toEqual('参数错误');
            }
          );

          request(
            'area.trainHandler.changeLineUp', {
              lineUp: [{
                1: 5,
                2: 4,
                3: 3,
                4: 2,
                5: 1,
                6: -1
              }],
              index: 1
            },
            function(data) {
              console.log(data);
              expect(data.code).toEqual(501);
              expect(data.msg).toEqual('参数错误');
            }
          );

          request(
            'area.trainHandler.changeLineUp', {
              lineUp: {
                1: 5,
                2: 4,
                3: 3,
                4: 2,
                5: 1,
                6: -1
              },
              index: 2
            },
            function(data) {
              console.log(data);
              expect(data.code).toEqual(501);
              expect(data.msg).toEqual('参数错误');
            }
          );

        });

      });

      describe('when numbers of card are the same', function(){
        
        
        it('should can not change line up', function(){
          request(
            'area.trainHandler.changeLineUp', {
              lineUp: {
                1: 18,
                2: 4,
                3: 3,
                6: -1
              }, 
              index: 0
            },
            function(data) {
              console.log(data);
              expect(data.code).toEqual(501);
              expect(data.msg).toEqual("上阵卡牌不能是相同系列的卡牌");
            }
          );

        });
      });


    });
  });
});