describe("Area Server", function() {
	describe("Buy Handler", function() {
		describe("area.buyHandler.buyProduct", function() {
			beforeAll(function() {
				doAjax('/loaddata/csv', {}, function() {});
			});

			describe("cardCount", function() {
				describe("当魔石不足时", function() {
					beforeEach(function() {
						doAjax('/update/player/106', {
							gold: 4
						}, function(err, res) {
							loginWith('poorman', '1', 1);
						});
					});

					it("不能购买卡库位置", function() {
						request("area.buyHandler.buyProduct", {
							id: 7
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
						doAjax('/update/player/101', {
							cardsCount: 100
						}, function(err, res) {
							loginWith('user4', '1', 1);
						});
					});

					it("不能购买卡库位置", function() {
						request("area.buyHandler.buyProduct", {
							id: 7
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

					it("卡库容量会相应增加", function() {
						// 第一次购买 1个
						request("area.buyHandler.buyProduct", {
							id: 7
						}, function(data) {
							expect(data).toEqual({
								code: 200,
								msg: {
									consume: {
										key: 'gold',
										value: 39990
									},
									cardsCount: 36
								}
							});

							doAjax('/player/100', function(res) {
								var p = res.data;
								expect(p.cardsCount).toEqual(data.msg.cardsCount);
							});
						});

						// 第二次购买 1个
						request("area.buyHandler.buyProduct", {
							id: 7
						}, function(data) {
							expect(data).toEqual({
								code: 200,
								msg: {
									consume: {
										key: 'gold',
										value: 39970
									},
									cardsCount: 37
								}
							});

							doAjax('/player/100', function(res) {
								var p = res.data;
								expect(p.cardsCount).toEqual(data.msg.cardsCount);
							});
						});

						// 第三次购买 5个
						request("area.buyHandler.buyProduct", {
							id: 7,
							times: 5
						}, function(data) {
							expect(data).toEqual({
								code: 200,
								msg: {
									consume: {
										key: 'gold',
										value: 39730
									},
									cardsCount: 42
								}
							});

							doAjax('/player/100', function(res) {
								var p = res.data;
								expect(p.cardsCount).toEqual(data.msg.cardsCount);
							});
						});
						
						// 第四次购买 10个
						request("area.buyHandler.buyProduct", {
							id: 7,
							times: 10
						}, function(data) {
							expect(data).toEqual({
								code: 200,
								msg: {
									consume: {
										key: 'gold',
										value: 39130
									},
									cardsCount: 52
								}
							});

							doAjax('/player/100', function(res) {
								var p = res.data;
								expect(p.cardsCount).toEqual(data.msg.cardsCount);
							});
						});

					});
				});
			});
		});
	});
});