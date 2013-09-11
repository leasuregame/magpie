describe("Area Server", function() {
	describe("Top Handler", function() {
		describe("area.topHandler.orderList", function() {
			beforeAll(function() {
				doAjax('/loaddata/all', {}, function() {});
			});


			describe('when get order list from server', function(){
				beforeEach(function(){
					loginWith('arthur', '1', 1);
				});

				var orders = function(items, name) {
					return items.map(function(i) {
						return i[name];
					});
				};

				it('should return the correct result', function(){
					request('area.topHandler.orderList', {}, function(data){
						expect(data.code).toEqual(200);
						expect(data.msg.level.length).toEqual(50);
						expect(data.msg.ability.length).toEqual(50);
						expect(data.msg.ranking.length).toEqual(50);
						expect(data.msg.pass.length).toEqual(0);

						expect(orders(data.msg.level, 'lv')).toEqual([]);
						expect(orders(data.msg.ability, 'ability')).toEqual([]);
						expect(orders(data.msg.ranking, 'ranking')).toEqual([]);
						expect(orders(data.msg.pass, 'pass')).toEqual([]);

						expect(data).toEqual({});
					});
				});
			});
		});
	});
});