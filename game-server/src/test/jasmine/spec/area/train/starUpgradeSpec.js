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

				describe("when card's lv is not max", function() {

					it('should can not upgrade of card', function() {
						request('area.trainHandler.starUpgrade', {
							target: 11,
							sources: [4]
						}, function(data) {
							console.log(data);
							expect(data.code).toEqual(501);
							expect(data.msg).toEqual('未达到进阶等级');
						});
					});
				});

				describe("when card's star is 1", function() {
					it('should can upgrade star of card', function() {
						request('area.trainHandler.starUpgrade', {
							target: 4,
							sources: [11]
						}, function(data) {
							console.log(data);
							expect(data.code).toEqual(200);
							expect(typeof data.msg.upgrade).toEqual('boolean');

							doAjax('/card/' + 4, {}, function(res) {
								expect(res.data.tableId).toEqual(data.msg.card.tableId);
								expect(res.data.star % 5).toEqual(data.msg.card.tableId % 5);
							});

							doAjax('/card/' + 11, {}, function(res) {
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

			describe("when card's tableId is 10000", function() {
				beforeEach(function() {
					doAjax('/update/card/' + 6, {
						tableId: 10000
					}, function() {
						loginWith('2', '1', 1);
					});
				});

				it('should can not upgrade star of card', function() {
					request('area.trainHandler.starUpgrade', {
						target: 6,
						sources: [7]
					}, function(data) {
						console.log(data);
						expect(data.code).toEqual(501);
						expect(data.msg).toEqual('该卡牌不可以进阶');
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
							sources: [160, 161]
						},
						function(data) {
							expect(data.code).toEqual(501);
							expect(data.msg).toEqual('仙币不足');
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
							]
						},
						function(data) {
							expect(data.code).toEqual(501);
							expect(data.msg).toEqual('最多消耗20张卡牌');
							console.log(data);
						});
				});
			});

			describe("when 100 percent upgrade star of card", function() {
				beforeEach(function() {
					loginWith('arthur', '1', 1);
				});

				it('should can upgrade star of card', function() {
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
								220
							]
						},
						function(data) {
							expect(data.code).toEqual(200);
							expect(data.msg.upgrade).toEqual(true);
							expect(_.pick(data.msg.card,
								'id', 'tableId',
								'lv', 'exp', 'skillLv',
								'skillPoint')).toEqual({
								id: 200,
								tableId: 194,
								lv: 50,
								exp: 100,
								skillLv: 1,
								skillPoint: 30000
							});
						});
				});
			});

			describe('升阶操作后，星级对应初始概率的变化', function() {
				beforeEach(function() {
					loginWith('arthur', '1', 1);
				});

				it('升阶成功或者失败，初始概率的变化都应该正确', function() {

					// 第一次升阶 1张素材卡牌
					request('area.trainHandler.starUpgrade', {
						target: 260,
						sources: [261]
					}, function(data) {
						console.log(data);

						expect(data.code).toEqual(200);
						expect(_.pick(data.msg.card,
							'id', 'tableId',
							'lv', 'exp', 'skillLv',
							'skillPoint')).toEqual({
							id: 260,
							tableId: 94,
							lv: 55,
							exp: 100,
							skillLv: 3,
							skillPoint: 30000
						});

						doAjax('/player/100', {}, function(res) {

							expInitRate = {
								star1: 0,
								star2: 0,
								star3: 0,
								star4: 2
							};
							expect(JSON.parse(res.data.initRate)).toEqual(expInitRate);
						});
					});

					// 第二次升阶 9张素材卡牌
					request('area.trainHandler.starUpgrade', {
						target: 260,
						sources: [262, 263, 264, 265, 267, 268, 269, 270, 271]
					}, function(data) {
						console.log(data);

						expect(data.code).toEqual(200);
						expect(_.pick(data.msg.card,
							'id', 'tableId',
							'lv', 'exp', 'skillLv',
							'skillPoint')).toEqual({
							id: 260,
							tableId: 94,
							lv: 55,
							exp: 100,
							skillLv: 3,
							skillPoint: 30000
						});

						doAjax('/player/100', {}, function(res) {
							expInitRate = {
								star1: 0,
								star2: 0,
								star3: 0,
								star4: 20
							};
							expect(JSON.parse(res.data.initRate)).toEqual(expInitRate);
						});
					});

					// 第三次升阶 9张素材卡牌，概率位56%
					request('area.trainHandler.starUpgrade', {
						target: 260,
						sources: [272, 273, 274, 275, 277, 278, 279, 280, 281]
					}, function(data) {
						console.log(data);

						expect(data.code).toEqual(200);
						
						var cardData = {
							id: 260,
							tableId: 94,
							lv: 55,
							exp: 100,
							skillLv: 3,
							skillPoint: 30000
						};
						if (data.msg.upgrade) {
							cardData.tableId = 95;
							cardData.skillLv = 1;
						}
						expect(_.pick(data.msg.card,
							'id', 'tableId',
							'lv', 'exp', 'skillLv',
							'skillPoint')).toEqual(cardData);

						doAjax('/player/100', {}, function(res) {
							var expInitRate = {
								star1: 0,
								star2: 0,
								star3: 0,
								star4: 38
							};
							if (data.msg.upgrade) {
								expInitRate.star4 = 0;
							}
							expect(JSON.parse(res.data.initRate)).toEqual(expInitRate);
						});
					});

				});

			});
		});
	});
});