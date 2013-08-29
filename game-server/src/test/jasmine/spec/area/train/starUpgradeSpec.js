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
		describe("area.trainHandler.starUpgrade", function() {
			describe("when start upgrade card's star", function() {
				var before_player, before_card;

				beforeEach(function() {
					loginWith(user1.account, user1.password, user1.areaId);

					doAjax('/player/' + user1.playerId, {}, function(res) {
						before_player = res.data;
					});

					doAjax('/card/' + 1, {}, function(res) {
						before_card = res.data;
					});
				});
				
				describe("when card's star is 3", function() {

					it("star of card should can be upgrade", function() {
						request('area.trainHandler.starUpgrade', {
							target: 1,
							sources: [2, 3]
						}, function(data) {
							console.log(data);
							expect(data.code).toEqual(200);
							expect(typeof data.msg.upgrade).toEqual('boolean');

							doAjax('/player/' + user1.playerId, {}, function(res) {
								expect(res.data.gold).toEqual(before_player.gold);
							});

							doAjax('/card/' + 1, {}, function(res) {
								if (data.msg.upgrade) {
									expect(res.data.star).toEqual(before_card.star + 1);
									expect(data.msg.card.passiveSkills.length).toEqual(2);
								} else {
									expect(res.data.star).toEqual(before_card.star);
									expect(data.msg.card.passiveSkills.length).toEqual(1);
								}								
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
						});
					});
				});

				describe("when card's star is 1", function() {
					it('should can upgrade star of card', function() {
						request('area.trainHandler.starUpgrade', {
							target: 11,
							sources: [4]
						}, function(data) {
							console.log(data);
							expect(data.code).toEqual(200);
							expect(typeof data.msg.upgrade).toEqual('boolean');

							doAjax('/card/' + 11, {}, function(res) {
								expect(res.data.star).toEqual(data.msg.card.star);
							});

							doAjax('/card/' + 4, {}, function(res) {
								expect(res).toEqual({
									code: 404,
									data: 'card not exists'
								});
							});
						});
					});
				});

				describe("when card's star is 5", function() {
					it('should can not upgrade star of card', function() {
						request(
							'area.trainHandler.starUpgrade', {
								target: 5,
								sources: [3, 4]
							},
							function(data) {
								expect(data.code).toEqual(501);
								expect(data.msg).toEqual('卡牌星级已经是最高级了');
								console.log(data);
							}
						);
					});
				});
			});


			describe("when money is not enought", function() {
				var poorman = {
					account: 'poorman',
					password: '1',
					areaId: 1,
					id: 106,
					playerId: 106
				};

				beforeEach(function() {
					loginWith(poorman.account, poorman.password, poorman.areaId);
				});

				it('should can not upgrade star of card', function() {
					request(
						'area.trainHandler.starUpgrade', {
							target: 165,
							sources: [160, 161],
							allInherit: true
						},
						function(data) {
							expect(data.code).toEqual(501);
							expect(data.msg).toEqual('铜板不足');
							console.log(data);
						}
					);
				});
			});

			describe("when sources cards is not exist", function() {
				var poorman = {
					account: 'poorman',
					password: '1',
					areaId: 1,
					id: 106,
					playerId: 106
				}

				beforeEach(function() {
					loginWith(poorman.account, poorman.password, poorman.areaId);
				});

				it('should can not upgrade star of card', function() {
					request(
						'area.trainHandler.starUpgrade', {
							target: 165,
							sources: [2, 1]
						},
						function(data) {
							expect(data.code).toEqual(501);
							expect(data.msg).toEqual('找不到素材卡牌');
							console.log(data);
						}
					);
				});
			});

			describe("when card's count is grater then the max number", function() {
				var arthur = {
					id: 100,
					playerId: 100,
					areaId: 1,
					account: 'arthur',
					password: '1'
				};

				beforeEach(function() {
					loginWith(arthur.account, arthur.password, arthur.areaId);
				});

				it('should can not upgrade star of card', function() {
					request('area.trainHandler.starUpgrade', {
							target: 200,
							sources: [
								201,
								202,
								203,
								204,
								205,
								206,
								207,
								208,
								209,
								210,
								211,
								212,
								213,
								214,
								215,
								216,
								217,
								218,
								219,
								220,
								221
							],
							allInherit: true
						},
						function(data) {
							expect(data.code).toEqual(501);
							expect(data.msg).toEqual('最多只能消耗20张卡牌来进行升级');
							console.log(data);
						});
				});
			});

		});
	});
});