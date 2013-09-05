describe("Area Server", function(){
	describe("Vip Handler", function(){
		describe("area.vipHandler.buyVip", function(){
			beforeAll(function(){
				doAjax('/loaddata/csv', {}, function(){});
			});

			describe("购买VIP", function(){
				beforeEach(function(){
					loginWith('arthur', '1', 1);
				})
				
				var buyVip = function(lv) {
					it("VIP " + lv, function(){
						request('area.vipHandler.buyVip', {id: lv}, function(data) {
							expect(data.code).toEqual(200);
							expect(data.msg.player.vip).toEqual(lv);
							expect(data.msg.player).hasProperties('vip', 'dailyGift', 'spiritPool');
						});
					});
				};

				for (var i = 1; i <= 7; i++) {
					buyVip(i);
				}
			});

			

			

		});
	});
});