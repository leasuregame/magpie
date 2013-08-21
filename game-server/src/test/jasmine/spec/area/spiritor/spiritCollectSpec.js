describe('Area Server', function() {
	describe('Spirit Handler', function() {
		var arthur = {
			id: 100,
			playerId: 100,
			areaId: 1,
			account: 'arthur',
			password: '1'
		};

		beforeAll(function() {
			doAjax('/loaddata/csv', {}, function() {});
		});

		describe('area.spiritHandler.collect', function() {

			describe('when do collect spirit', function() {
				beforeEach(function() {
					loginWith(arthur.account, arthur.password, arthur.areaId);
				});

				it('should can collect spirit', function() {
					request('area.spiritHandler.collect', {
						isGold: false
					}, function(data) {
						console.log(data.msg.rewardSpirit);
						rs = data.msg.rewardSpirit
						delete data.msg.rewardSpirit

						if (rs > 0) {
							expect(rs).toBeLessThan(51);
							expect(rs).toBeGreaterThan(9)
						} else {
							expect(rs).toEqual(0);
						}

						expect(data).toEqual({
							code: 200,
							msg: {
								spiritor: {
									lv: 1,
									spirit: 10 + rs
								},
								spiritPool: {
									lv: 1,
									exp: 5,
									collectCount: 1
								}
							}
						});

						doAjax('/player/' + arthur.playerId, {}, function(res) {
							expect(JSON.parse(res.data.spiritor)).toEqual(data.msg.spiritor);
							expect(JSON.parse(res.data.spiritPool)).toEqual(data.msg.spiritPool);
						});
					});
				});

				it('should can collect dubble spirit with gold', function() {
					var before_player;
					doAjax('/player/' + arthur.playerId, {}, function(res) {
						before_player = res.data;
					});

					request('area.spiritHandler.collect', {
						isGold: true
					}, function(data) {
						console.log(data.msg.rewardSpirit);
						rs = data.msg.rewardSpirit
						delete data.msg.rewardSpirit

						if (rs > 0) {
							expect(rs).toBeLessThan(51);
							expect(rs).toBeGreaterThan(9)
						} else {
							expect(rs).toEqual(0);
						}

						expect(data.code).toEqual(200);

						doAjax('/player/' + arthur.playerId, {}, function(res) {
							expect(JSON.parse(res.data.spiritor)).toEqual(data.msg.spiritor);
							expect(JSON.parse(res.data.spiritPool)).toEqual(data.msg.spiritPool);
							expect(res.data.gold).toEqual(before_player.gold - 20);
						});
					});
				});

			});

			describe('when collect count is the max', function() {
				beforeEach(function() {
					loginWith('user5', '1', 1);
				});

				it('should can not collect spirit again in current day', function() {
					request('area.spiritHandler.collect', {
						isGold: false
					}, function(data) {
						expect(data).toEqual({
							code: 501,
							msg: '不能采集，已经达到每天最大采集次数'
						});
					});
				});
			});

		});
	});
});