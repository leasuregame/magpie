describe("Area Server", function() {
	describe("Player Handler", function() {
		describe("area.playerHandler.getLineUpInfo", function() {

			beforeAll(function() {
				doAjax('/loaddata/csv', {}, function() {});
			});

			beforeEach(function() {
				loginWith('arthur', '1', 1);
			});

			describe('when parameter is empty', function() {
				it('should can not get player lineUp info', function() {
					request('area.playerHandler.getLineUpInfo', {}, function(data) {
						expect(data).toEqual({
							code: 501,
							msg: 'id参数不能为空'
						});
					})
				});
			});

			describe('when parameter is right', function() {
				it('should can get correct player lineUp info', function() {
					request('area.playerHandler.getLineUpInfo', {
						playerId: 101
					}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);
						expect(data.msg.name).toEqual('Defender');
						expect(data.msg.lv).toEqual(42);
						expect(data.msg.vip).toEqual(0);
						expect(data.msg.rankStats).toEqual({
							historyRanking: 20000,
							winStreakCount: 0,
							winningStreak: 0,
							challengeCount: 0,
							beChallengeCount: 0,
							winCount: 0,
							loseCount: 0,
							avgWinRate: '0.0%'
						});
						expect(Object.keys(data.msg.lineUp)).toEqual(['1', '2', '3', '4', '5', '6']);
					});
				});
			});
		});
	});
});