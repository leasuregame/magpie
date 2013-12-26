describe("Area Server", function() {
	describe("Achieve Handler", function() {
		describe("area.achieveHandler.getReward", function() {
			beforeAll(function() {
				doAjax('/loaddata/csv', {}, function() {});
			});

			describe('when achivement is completed', function() {
				var before_player;

				beforeEach(function() {
					doAjax('/update/player/100', {
						lv: 90,
						energy: 1000,
						gold: 1000
					}, function(res) {
						doAjax('/player/100', function(res) {
							before_player = res.data;
							loginWith('arthur', '1', 1);
						});

					});
				});

				it('should can get achivement reward', function() {
					request('area.achieveHandler.getReward', {
						id: 2
					}, function(data) {
						expect(data).toEqual({
							code: 200
						});

						doAjax('/player/100', function(res) {
							expect(res.data.energy).toEqual(before_player.energy + 1000);
							expect(res.data.gold).toEqual(before_player.gold + 100);
						});
					});
				});
			});

			describe('when achivement is not completed', function(){
				beforeEach(function(){
					loginWith('arthur', '1', 1);
				});

				it('should can get achivement reward', function() {
					request('area.achieveHandler.getReward', {
						id: 4
					}, function(data) {
						expect(data).toEqual({
							code: 501,
							msg: '还未达成该成就'
						});
					});
				});
			});

			describe('when achivement reward has got', function() {
				var before_player;

				beforeEach(function() {
					doAjax('/update/player/101', {
						passLayer: 50,
						energy: 1000,
						gold: 1000
					}, function(res) {
						doAjax('/player/101', function(res) {
							before_player = res.data;
							loginWith('user4', '1', 1);
						});

					});
				});

				it('should can not get achivement reward again', function() {
					request('area.achieveHandler.getReward', {
						id: 3
					}, function(data) {
						expect(data).toEqual({
							code: 200
						});

						doAjax('/player/101', function(res) {
							expect(res.data.energy).toEqual(before_player.energy + 100);
							expect(res.data.gold).toEqual(before_player.gold + 10);
						});
					});

					request('area.achieveHandler.getReward', {
						id: 3
					}, function(data) {
						expect(data).toEqual({
							code: 501,
							msg: '不能重复领取'
						});
					});

				});
			});

		});
	});
});