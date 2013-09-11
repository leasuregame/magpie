describe("Area Server", function() {
	describe('Message Handler', function() {
		describe('area.messageHandler.addFriend', function() {
			var arthur = {
				id: 100,
				playerId: 100,
				areaId: 1,
				account: 'arthur',
				password: '1'
			};

			beforeAll(function() {
				doAjax('/loaddata/csv', {}, function() {});
			});

			describe('when asking to add an exist player as a friend', function() {
				beforeEach(function() {
					loginWith(arthur.account, arthur.password, arthur.areaId);
				});

				it('should can send the message', function() {
					request('area.messageHandler.addFriend', {
						friendName: 'Mike'
					}, function(data) {
						expect(data).toEqual({
							code: 3004
						}); // 对方不在线
					});
				});
			});

			describe('when receive a friendship asking', function() {
				beforeEach(function() {
					loginWith('2', '1', 1);
				});

				it('should can accept', function() {
					request('area.messageHandler.accept', {
						msgId: 1
					}, function(data) {
						expect(data).toEqual({
							code: 200,
							msg: {
								id: 100,
								name: 'Attacker',
								lv: 40,
								ability: 109800
							}
						});
					});
				});

				it('should can reject', function() {
					request('area.messageHandler.reject', {
						msgId: 1
					}, function(data) {
						expect(data).toEqual({
							code: 200,
							msg: '已处理'
						});
					});
				});
			});

			describe('when get message list', function() {
				beforeEach(function() {
					doAjax('/message/add', {
						receiver: arthur.playerId,
						type: 1
					}, function() {});
					doAjax('/message/add', {
						receiver: arthur.playerId,
						type: 1
					}, function() {});
					doAjax('/message/add', {
						receiver: arthur.playerId,
						type: 1
					}, function() {});
					doAjax('/message/add', {
						receiver: arthur.playerId,
						type: 2
					}, function() {});
					doAjax('/message/add', {
						receiver: arthur.playerId,
						type: 2
					}, function() {});
					doAjax('/message/add', {
						receiver: arthur.playerId,
						type: 2
					}, function() {});
					doAjax('/message/add', {
						receiver: arthur.playerId,
						type: 3
					}, function() {});
					doAjax('/message/add', {
						receiver: arthur.playerId,
						type: 3
					}, function() {});
					doAjax('/message/add', {
						receiver: arthur.playerId,
						type: 4
					}, function() {});


					loginWith(arthur.account, arthur.password, arthur.areaId);
				});

				it('should can return message list for current login user', function() {
					request('area.messageHandler.messageList', {}, function(data) {
						expect(data).toEqual({
							code: 200,
							msg: {
								friend: [{
										id: 4,
										msgId: null,
										sender: null,
										receiver: 100,
										type: 1,
										status: 0,
										options: '',
										content: '',
										createTime: 1378887742490
									}, {
										id: 3,
										msgId: null,
										sender: null,
										receiver: 100,
										type: 1,
										status: 0,
										options: '',
										content: '',
										createTime: 1378887742478
									}, {
										id: 2,
										msgId: null,
										sender: null,
										receiver: 100,
										type: 1,
										status: 0,
										options: '',
										content: '',
										createTime: 1378887742466
									},
									[{
										id: 5,
										sender: null,
										receiver: 100,
										type: 2,
										status: 0,
										text: '',
										content: 'undefined 给你发了一条留言',
										createTime: 1378887742502
									}, {
										id: 6,
										sender: null,
										receiver: 100,
										type: 2,
										status: 0,
										text: '',
										content: 'undefined 给你发了一条留言',
										createTime: 1378887742513
									}, {
										id: 7,
										sender: null,
										receiver: 100,
										type: 2,
										status: 0,
										text: '',
										content: 'undefined 给你发了一条留言',
										createTime: 1378887742525
									}]
								],
								battle: [{
									id: 9,
									msgId: null,
									sender: null,
									receiver: 100,
									type: 3,
									status: 0,
									options: '',
									content: '',
									createTime: 1378887742548
								}, {
									id: 8,
									msgId: null,
									sender: null,
									receiver: 100,
									type: 3,
									status: 0,
									options: '',
									content: '',
									createTime: 1378887742536
								}],
								system: [{
									id: 10,
									msgId: null,
									sender: null,
									receiver: 100,
									type: 4,
									status: 0,
									options: '',
									content: '',
									createTime: 1378887742561
								}]
							}
						});
					});
				});
			});
		});
	});
});