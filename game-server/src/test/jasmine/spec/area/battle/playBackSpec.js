 describe('Area Server', function() {
	describe('Battle Handler', function() {
		beforeAll(function() {
			doAjax('/loaddata/csv', {}, function() {});
		});

		describe('area.battleHandler.playBack', function() {
			var blId;

			beforeEach(function() {
				doAjax('/create/battleLog', {
					createTime: Date.now(),
					own: 1,
					enemy: 2,
					battleLog: '{"text": "test battle log"}'
				}, function(res) {
					blId = res.insertId;

					loginWith('arthur', '1', 1);
				});				
			});

			describe('when do playBack', function() {
				it('should can return the right result', function() {
					request('area.battleHandler.playBack', {battleLogId: blId}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);
						expect(data.msg.battleLog).toEqual({text: "test battle log", id: blId});
					});
				});
			});
		});
	});
});