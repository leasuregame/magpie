describe('Area Server', function() {
	describe('Spirit Handler', function() {
		var arthur = {
			id: 100,
			playerId: 100,
			areaId: 1,
			account: 'arthur',
			password: '1'
		};

		describe('area.spiritHandler.collect', function() {
			beforeAll(function() {
				doAjax('/loaddata/csv', {}, function() {});
			});

			function doTest(lv) {
				var spiritMap = {
					1: 10,
					2: 12,
					3: 14,
					4: 16,
					5: 18,
					6: 20,
					7: 22,
					8: 24,
					9: 26,
					10: 28
				};

				describe("when spiritPool's level is " + lv, function() {
					var totalSpirit = 0;

					beforeAll(function() {
						doAjax('/update/player/' + arthur.playerId, {
							spiritPool: JSON.stringify({
								lv: lv,
								exp: 0,
								collectCount: 15
							}),
							spiritor: JSON.stringify({
								lv: 0,
								spirit: 0
							})
						}, function() {});
					});

					describe('and do collect spirit', function() {
						beforeEach(function() {
							doAjax('/player/' + arthur.playerId, {}, function(res) {
								before_player = res.data;
							});
							loginWith(arthur.account, arthur.password, arthur.areaId);
						});

						it('should can collect spirit', function() {
							request('area.spiritHandler.collect', {
								isGold: false
							}, function(data) {
								console.log(data);
								expect(data.code).toEqual(200);
								expect(data.msg.spiritPool).toEqual({
									lv: lv,
									exp: 5,
									collectCount: 14
								});
								if (data.msg.isDouble) {
									expect(data.msg.spirit_obtain).toEqual(spiritMap[lv] * 2);
								} else {
									expect(data.msg.spirit_obtain).toEqual(spiritMap[lv]);
								}

								doAjax('/player/' + arthur.playerId, {}, function(res) {
									expect(JSON.parse(res.data.spiritor).spirit).toEqual(JSON.parse(before_player.spiritor).spirit + data.msg.spirit_obtain);
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
								console.log(data);

								expect(data).toEqual({
									code: 200,
									msg: {
										spirit_obtain: spiritMap[lv] * 2,
										isDouble: false,
										spiritPool: {
											lv: lv,
											exp: 10,
											collectCount: 13
										}
									}
								});

								doAjax('/player/' + arthur.playerId, {}, function(res) {
									expect(JSON.parse(res.data.spiritor).spirit).toEqual(data.msg.spirit_obtain + JSON.parse(before_player.spiritor).spirit);
									expect(JSON.parse(res.data.spiritPool)).toEqual(data.msg.spiritPool);
									expect(res.data.gold).toEqual(before_player.gold - 20);
								});
							});
						});
					});

				});
			}

			for (var i = 1; i <= 10; i++) {
				(function(lv) {
					doTest(lv);
				})(i);
			}

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