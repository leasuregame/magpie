describe("Area Server", function() {
	describe("Player Handler", function() {
		describe("area.playerHandler.givePower", function() {
			beforeAll(function() {
				doAjax('/loaddata/csv', {}, function() {});
			});

			describe('当不在体力领取时间段时', function() {
				beforeEach(function() {
					loginWith('arthur', '1', 1);
				});

				it('不能领取', function() {
					request('area.playerHandler.givePower', {
						hour: 9
					}, function(data) {
						console.log(data);
						expect(data).toEqual({
							code: 501,
							msg: '不在领取体力的时间段'
						});
					});
				});
			});

			describe('当已经领取了该时间段的体力时', function() {
				beforeEach(function() {
					var now = new Date();
					doAjax('/update/player/101', {
						dailyGift: JSON.stringify({
							lotteryCount: 500, // 每日抽奖次数
							lotteryFreeCount: 0, // 每日免费抽奖次数
							powerGiven: [11], // 体力赠送情况
							powerBuyCount: 6, // 购买体力次数
							challengeCount: 10, // 每日有奖竞技次数
							challengeBuyCount: 10, //每日有奖竞技购买次数
							receivedBless: { // 接收的祝福
								count: 5,
								givers: []
							},
							gaveBless: { // 送出的祝福
								count: 5,
								receivers: []
							}
						}),
						power: JSON.stringify({
							time: now.getTime(),
							value: 50
						}),
						resetDate: '' + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
					}, function() {
						loginWith('user4', '1', 1);
					})
				});

				it('不能重复领取', function() {
					request('area.playerHandler.givePower', {
						hour: 11
					}, function(data) {
						console.log(data);
						expect(data).toEqual({
							code: 501,
							msg: '不能重复领取'
						});
					});
				});
			});

			describe('当体力已满时', function() {
				beforeEach(function() {
					loginWith('1', '1', 1);
				});

				it('不能领取', function() {
					request('area.playerHandler.givePower', {
						hour: 12
					}, function(data) {
						console.log(data);
						expect(data).toEqual({
							code: 200,
							msg: { powerValue : 50 }
						});
					});
				});
			});

			describe('当在领取时间段内，而且还没领时', function() {
				beforeEach(function() {
					doAjax('/update/player/2', {
						power: JSON.stringify({
							time: Date.now(),
							value: 50
						})
					}, function(){
						loginWith('2', '1', 1);
					});					
				});

				it('应该可以领取赠送的体力', function() {
					request('area.playerHandler.givePower', {
						hour: 18
					}, function(data) {
						console.log(data);
						expect(data).toEqual({
							code: 200,
							msg: {
								powerValue: 50
							}
						});

						doAjax('/player/2', {}, function(res) {
							expect(JSON.parse(res.data.power).value).toEqual(100);
							expect(JSON.parse(res.data.dailyGift).powerGiven).toEqual([17]);
						})
					});
				});
			});
		});
	});
});