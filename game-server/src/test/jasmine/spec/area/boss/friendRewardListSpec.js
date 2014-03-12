describe("Area Server", function() {
  describe("Boss Handler", function() {
    describe("area.bossHandler.friendRewardList", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });

      describe('没有好友协助奖励时', function() {
        beforeEach(function() {
          loginWith('1', '1', 1);
        });

        it('返回空列表', function() {
          request('area.bossHandler.friendRewardList', {}, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: {
                rewardList: [],
                total: {
                  honor: 0,
                  money: 0
                }
              }
            });
          });
        });

      });

      describe('有好友协助奖励时', function() {
        beforeEach(function() {
          doAjax('/create/bossFriendReward', {
            playerId: 100,
            friendName: 'Mike',
            honor: 10,
            money: 1000,
            got: 0
          }, function() {
            loginWith('arthur', '1', 1);
          });
        });

        it('返回正确列表', function() {
          request('area.bossHandler.friendRewardList', {}, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: {
                rewardList: [{
                  name: 'Mike',
                  money: 1000,
                  honor: 10
                }],
                total: {
                  money: 1000,
                  honor: 10
                }
              }
            });
          });
        });
      });

      // describe('好友攻击boss, 查看奖励，领取奖励', function(){
      //   beforeEach(function(){
      //     doAjax('/create/boss', {

      //     });
      //   });
      // });

    });
  });
});