describe("Area Server", function() {
	describe("Buy Handler", function() {
		describe("area.buyHandler.buyExpCard", function() {
			beforeAll(function() {
				doAjax('/loaddata/csv', {}, function() {});
			});

			describe("购买经验卡", function() {
				describe("当仙币不足时", function() {
					beforeEach(function() {
						loginWith('poorman', '1', 1);
					});

					it("不能购买经验卡牌", function() {
						request("area.buyHandler.buyProduct", {
                            id:1,
							times: 1
						}, function(data) {
							expect(data).toEqual({
								code: 501,
								msg: '仙币不足'
							});
						});
					});
				});

				describe("当铜板充足时", function() {
					beforeEach(function() {
						loginWith('1', '1', 1);
					});

					it("可以购买指定数量的经验卡牌", function() {
						request("area.buyHandler.buyProduct", {
                            id:1,
							times: 1
						}, function(data) {
							console.log(data);
							expect(data.code).toEqual(200);
							expect(data.msg.cards.length).toEqual(1);
							expect(data.msg.card.tableId).toEqual(30000);
                            expect(data.msg.consume).toEqual({
                                "key": "money",
                                "value": 2500
                            });
						});
					});
				});
			});
		});
	});
});