describe("Area Server", function() {

	describe("Task Handler", function() {

		beforeAll(function() {
			doAjax('/loaddata/csv', {}, function(data) {
				expect(data).toEqual('done');
			});
		});

		describe("area.rankHandler.fight", function() {
			beforeEach(function(){
				loginWith('arthur', '1', 1);
			});

			describe('when fight to a friend', function(){
				it('should can return a correct battle log', function(){
					request('area.rankHandler.fight', {targetId: 101}, function(data){
						console.log(data);
						expect(data.code).toEqual(200);
						expect(data.msg.battleLog).toBeBattleLog();
					});
				});
			});

		});
	});
});