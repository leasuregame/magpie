describe("Area Server", function() {
	describe("Player Handler", function() {
		describe("area.playerHandler.getActivityInfo", function() {
			beforeAll(function() {
				doAjax('/loaddata/csv', {}, function() {});
			});

			describe('when get activity info', function(){
				beforeEach(function(){
					loginWith('arthur', '1', 1);
				});

				it('should can get the correct info', function(){
					request('area.playerHandler.getActivityInfo', {}, function(data){
						console.log(data);
						expect(data.code).toEqual(200);
						expect(data.msg).toEqual({
							canGetPower: true,
							levelReward: []
						});
					});
				});
			});
		});
	});
});