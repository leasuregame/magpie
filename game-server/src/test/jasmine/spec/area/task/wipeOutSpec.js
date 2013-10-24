describe("Area Server", function() {

	describe("Task Handler", function() {
		var arthur = {
			id: 100,
			playerId: 100,
			areaId: 1,
			account: 'arthur',
			password: '1'
		};

		var papa = {
			id: 103,
			playerId: 103,
			areaId: 1,
			account: 'papa',
			password: '1'
		};

		beforeAll(function() {
			doAjax('/loaddata/csv', {}, function(data) {
				expect(data).toEqual('done');
			});
		});

		describe("area.taskHandler.wipeOut", function() {
			var before_data;

			describe("任务扫荡", function() {
				beforeEach(function() {
					loginWith(arthur.account, arthur.password, arthur.areaId);

					doAjax('/player/' + arthur.playerId, {}, function(res) {
						console.log('before each: ', res);
						before_data = {
							exp: res.data.exp,
							money: res.data.money,
							gold: res.data.gold,
							skill_point: res.data.skillPoint
						}
					});
				});
				
				it('扫荡其中一个已通的任务大关', function(){
					request('area.taskHandler.wipeOut', {
						type: 'task',
						chapterId: 1
					}, function(data) {
						console.log('扫荡其中一个已通的任务大关', data);
                        expect(data.msg).hasProperties([
                            'rewards',
                            'power',
                            'exp',
                            'lv',
                            'mark'
                        ]);

                        expect(data.msg.rewards).toEqual({
                            money_obtain: 750
                        });
                        expect(data.msg.mark).toEqual([1]);
                        expect(data.msg.lv).toEqual(40);


					});
				});


				it("扫荡全部已通的任务大关", function() {
					request('area.taskHandler.wipeOut', {
						type: 'task'
					}, function(data) {
						console.log('任务扫荡', data);
						expect(data.code).toEqual(200);
						expect(data.msg).hasProperties([
							'rewards',
							'power',
							'exp',
							'lv',
							'mark'
						]);

						expect(data.msg.rewards).toEqual({
							money_obtain: 25530
						});
						expect(data.msg.mark).toEqual([16777215]);

						// 获得扫荡经验后，角色升级了，所以剩余的经验改变，等级变高
						expect(data.msg.lv).toEqual(40);

						doAjax('/player/' + arthur.playerId, {}, function(res) {
							expect(data.msg.rewards.money_obtain).toEqual(res.data.money - before_data.money);
						});
					});
				});
				
			});

			describe("关卡扫荡", function() {
				beforeAll(function() {
					doAjax('/loaddata/csv', {}, function(data) {
						expect(data).toEqual('done');
					});
				});
				beforeEach(function() {
					loginWith(papa.account, papa.password, papa.areaId);

					doAjax('/player/' + papa.playerId, {}, function(res) {
						console.log('before each: ', res);
						before_data = {
							exp: res.data.exp,
							money: res.data.money,
							skill_point: res.data.skillPoint
						}
					});
				});

				it("精英关卡 should can be 扫荡", function() {
					request('area.taskHandler.wipeOut', {
						type: 'pass'
					}, function(data) {
						console.log('关卡扫荡', data);
						expect(data.code).toEqual(200);
						expect(_.keys(data.msg).sort()).toEqual([
							'mark',
							'rewards',
							'power',
							'exp',
							'lv'
						].sort());

						expect(data.msg.rewards).toEqual({
							exp_obtain: 550,
							money_obtain: 3500,
							skill_point: 2150
						});

						expect(data.msg.mark).toEqual([33554431]);
						expect(data.msg.exp).toEqual(293);
						expect(data.msg.lv).toEqual(41);

						doAjax('/player/' + papa.playerId, {}, function(res) {
							expect(res.data.money).toEqual(data.msg.rewards.money_obtain + before_data.money);
							expect(res.data.skillPoint).toEqual(data.msg.rewards.skill_point + before_data.skill_point);
						});
					});
				});

				describe("when all pass have been passed", function() {
					it("should return there is not pass to be execute", function() {
						request('area.taskHandler.wipeOut', {
							type: 'pass'
						}, function(data) {
							console.log('关卡扫荡', data);
							expect(data).toEqual({
								code: 501,
								msg: '没有关卡可以扫荡'
							});
						});
					});
				});

			});
		});
	});

});