describe("Area Server", function() {
	describe("Player Handler", function() {
		describe("area.playerHandler.getLevelReward", function() {
			beforeAll(function() {
				doAjax('/loaddata/csv', {}, function() {});
			});

			describe('当参数为空时', function() {
				beforeEach(function() {
					loginWith('arthur', '1', 1);
				});

				it('不能领取', function() {
					request('area.playerHandler.getLevelReward', {}, function(data) {
						console.log(data);
						expect(data).toEqual({
							code: 501,
							msg: '找不到该奖励'
						});
					});
				});
			});

			describe('当等级奖励已经领取时', function() {
				beforeEach(function() {
					doAjax('/update/player/2', {
						levelReward: [1]
					}, function() {
						loginWith('2', '1', 1);
					});
				});

				it('不能重复领取', function() {
					request('area.playerHandler.getLevelReward', {
						id: 1
					}, function(data) {
						console.log(data);
						expect(data).toEqual({
							code: 501,
							msg: '不能重复领取'
						});
					});
				});
			});

			describe('当等级没达到时', function() {
				beforeEach(function() {
					loginWith('user4', '1', 1);
				});

				it('不能领取', function() {
					request('area.playerHandler.getLevelReward', {
						id: 10
					}, function(data) {
						console.log(data);
						expect(data).toEqual({
							code: 501,
							msg: '等级未达到100级, 不能领取'
						});
					});
				});
			});

			describe('当没有该等级奖励时', function() {
				beforeEach(function() {
					loginWith('user4', '1', 1);
				});

				it('不能领取', function() {
					request('area.playerHandler.getLevelReward', {
						id: 11
					}, function(data) {
						console.log(data);
						expect(data).toEqual({
							code: 501,
							msg: '找不到该奖励'
						});
					});
				});
			});

			describe('当可以领取等级奖励时', function() {
				var before_player;
				
				beforeEach(function() {
					doAjax('/player/1', {}, function(res) {
						before_player = res.data;
						loginWith('1', '1', 1);
					});					
				});

				it('应该可以正确领取奖励', function() {
					request('area.playerHandler.getLevelReward', {
						id: 1
					}, function(data) {
						console.log(data);
						expect(data).toEqual({
							code: 200,
							msg: {
								gold: 10
							}
						});

						doAjax('/player/1', {}, function(res){
							expect(res.data.gold).toEqual(before_player.gold + 10);
						})
					});
				});
			});
		});
	});
});