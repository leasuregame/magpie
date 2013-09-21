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

						expect(orders(data.msg.level, 'lv')).toEqual([ 60, 42, 40, 40, 40, 25, 20, 11, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ] );
						expect(orders(data.msg.ability, 'ability')).toEqual([ 94475, 29978, 29831, 29816, 29778, 29734, 29662, 29625, 29569, 29561, 29546, 29512, 29494, 29493, 29487, 29432, 29421, 29415, 29414, 29413, 29410, 29390, 29377, 29315, 29281, 29278, 29241, 29228, 29199, 29199, 29197, 29193, 29182, 29181, 29161, 29126, 29124, 29104, 29083, 29077, 29073, 29062, 29054, 29021, 28998, 28996, 28962, 28959, 28953, 28948 ] );
						expect(orders(data.msg.ranking, 'ranking')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]);
						expect(orders(data.msg.pass, 'pass')).toEqual([]);
					});
				});
			});
		});
	});
});