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
							id: 1,
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
						doAjax('/update/player/1', {
							cardsCount: 100
						}, function(err, res) {
							loginWith('1', '1', 1);	
						});						
					});

					it("可以购买指定数量的经验卡牌", function() {
						request("area.buyHandler.buyProduct", {
							id: 1,
							times: 1
						}, function(data) {
							console.log(data);
							expect(data.code).toEqual(200);
							expect(data.msg.cardIds.length).toEqual(1);
							expect(data.msg.card.tableId).toEqual(30000);
							expect(data.msg.consume).toEqual({
								"key": "money",
								"value": 997500
							});
						});
					});

					it('可以购买30张', function(){
						request("area.buyHandler.buyProduct", {
							id: 1,
							times: 29
						}, function(data) {
							console.log(data);
							expect(data.code).toEqual(200);
							expect(data.msg.cardIds.length).toEqual(29);
							expect(data.msg.card.tableId).toEqual(30000);
							expect(data.msg.consume).toEqual({
								"key": "money",
								"value": 925000
							});
						});
					});	

					it('购买次数已用完时', function(){
						request("area.buyHandler.buyProduct", {
							id: 1,
							times: 29
						}, function(data) {
							console.log(data);
							expect(data).toEqual({
								code: 501,
								msg: '购买次数已经用完'
							})
						});
					});
				});

				describe('当购买次数不足时，不能购买', function(){
					beforeEach(function() {
						doAjax('/update/player/1', {
							cardsCount: 100,
							money: 1000000
						}, function(err, res) {
							loginWith('2', '1', 1);	
						});	
					});

					it('不能购买', function(){
						request("area.buyHandler.buyProduct", {
							id: 1,
							times: 31
						}, function(data) {
							console.log(data);
							expect(data).toEqual({
								code: 501,
								msg: '超过购买次数上限'
							})
						});
					});

				});

				describe('vip身份可以购买更多的经验卡', function(){
					beforeEach(function(){
						doAjax('/update/player/100', {
							cash: 6,
							money: 1000000,
							cardsCount: 100
						}, function(err, res) {
							loginWith('arthur', '1', 1);
						});
					});

					it('可以购买数量大于默认的30张', function(){
						request("area.buyHandler.buyProduct", {
							id: 1,
							times: 35
						}, function(data) {
							console.log(data);
							expect(data.code).toEqual(200);
							expect(data.msg.cardIds.length).toEqual(35);
							expect(data.msg.card.tableId).toEqual(30000);
							expect(data.msg.consume).toEqual({
								"key": "money",
								"value": 912500
							});
						});
					});

					it('不能超过可购买次数', function(){
						request("area.buyHandler.buyProduct", {
							id: 1,
							times: 10
						}, function(data) {
							console.log(data);
							expect(data).toEqual({
								code: 501,
								msg: '超过购买次数上限'
							})
						});
					});

				});

			});
		});
	});
});