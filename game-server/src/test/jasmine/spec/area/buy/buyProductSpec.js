describe("Area Server", function() {
	describe("Buy Handler", function() {
		describe("area.buyHandler.buyProduct", function() {
			beforeAll(function() {
				doAjax('/loaddata/csv', {}, function() {});
			});

			describe("cardCount", function() {
				describe("当魔石不足时", function() {
					beforeEach(function() {
						loginWith('poorman', '1', 1);
					});

					it("不能购买卡库位置", function() {
						request("area.buyHandler.buyProduct", {
                            id:7,
							times: 1
						}, function(data) {
							expect(data).toEqual({
								code: 501,
								msg: '魔石不足'
							});
						});
					});
				});

				describe("当卡牌卡库容量已经达到最大值时", function() {
					beforeEach(function() {
						loginWith('arthur', '1', 1);
					});

					it("不能购买卡库位置", function() {
						request("area.buyHandler.buyProduct", {
                            id:1,
							times: 1
						}, function(data) {
							expect(data).toEqual({
								code: 501,
								msg: '卡牌容量已经达到最大值'
							});
						});
					});
				});


				describe("当可以购买卡库位置时", function() {
					beforeEach(function() {
						loginWith('arthur', '1', 1);
					});

					it("不能购买卡库位置", function() {
						request("area.buyHandler.buyProduct", {
                            id:1
						}, function(data) {
							expect(data).toEqual({
								code: 200
							});

							doAjax('/player/100', function(res) {
								var p = res.data;
								expect(p.cardsCount).toEqual(36);
							});
						});
					});
				});
			});
		});
	});
});