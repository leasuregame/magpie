describe('Area Server', function() {
	describe('Spirit Handler', function() {
		describe('area.spiritHandler.spiritorUpgrade', function() {
			beforeAll(function() {
				doAjax('/loaddata/csv', {}, function() {});
			});

			describe('when spirit is not enough to upgrade', function() {
				beforeEach(function() {
					doAjax('/update/player/' + 100, {
						spiritor: JSON.stringify({
							lv: 1,
							spirit: 3
						})
					}, function(res) {
						loginWith('arthur', '1', 1);
					});
				});

				it('should can not upgrade', function() {
					request('area.spiritHandler.spiritorUpgrade', {}, function(data) {
						console.log(data);
						expect(data).toEqual({
							code: 501,
							msg: '灵气不够，不能升级'
						});
					});
				});
			});

			describe('when lv of spiritor is the max', function() {
				beforeEach(function() {
					doAjax('/update/player/' + 100, {
						spiritor: JSON.stringify({
							lv: 10,
							spirit: 3
						})
					}, function(res) {
						loginWith('arthur', '1', 1);
					});
				});

				it('should can not upgrade', function() {
					request('area.spiritHandler.spiritorUpgrade', {}, function(data) {
						console.log(data);
						expect(data).toEqual({
							code: 501,
							msg: '元神等级已经是最高级别别'
						});
					});
				});
			});

			describe('when can upgrade spiritor', function() {
				beforeEach(function() {
					doAjax('/update/player/' + 101, {
						spiritor: JSON.stringify({
							lv: 1,
							spirit: 1000
						})
					}, function(res) {
						loginWith('user4', '1', 1);
					});
				});

				it('should can not upgrade', function() {
					request('area.spiritHandler.spiritorUpgrade', {}, function(data) {
						console.log(data);
						expect(data).toEqual({
							code: 200,
							msg: {
								spiritor: {
									lv: 2,
									spirit: 100,
									ability: 600
								}								
							}
						});
					});
				});
			});

		});
	});
});