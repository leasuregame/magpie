describe("Area Server", function() {

	describe("Task Handler", function() {
		var passer = {
			id: 110,
			playerId: 110,
			areaId: 1,
			account: 'passer',
			password: '1'
		};

		var mike = {
			id: 102,
			playerId: 102,
			areaId: 1,
			account: 'mike',
			password: '1'
		};

		beforeAll(function() {
			doAjax('/loaddata/csv', {}, function(data) {
				expect(data).toEqual('done');
			});
		});

		describe("area.taskHandler.passBarrier", function() {
			describe("一般爬塔测试", function() {

				// describe("when start a passBarrier", function() {
				// 	beforeEach(function() {
				// 		loginWith(passer.account, passer.password, passer.areaId);
				// 	});

				// 	it("should can be execute and return result of pass barrier", function() {
				// 		request('area.taskHandler.passBarrier', {}, function(data) {
				// 			console.log('闯关', data);
				// 			expect(data.code).toEqual(200);
				// 			expect(data.msg).toBeDefined();
				// 			expect(data.msg).hasProperties([
				// 				'battleLog',
				// 				'pass'
				// 			]);
				// 			expect(data.msg.battleLog.winner).toEqual('own')
				// 			expect(data.msg.battleLog.rewards).hasProperties(['exp', 'skillPoint', 'spirit'])
				// 			expect(data.msg.pass).hasProperties(['layer', 'mark'])
				// 			expect(data.msg.battleLog).toBeBattleLog();

				// 			expect(data.msg.battleLog.rewards).hasProperties([
				// 				'spirit', 'skillPoint', 'exp'
				// 			]);

				// 			doAjax('/player/' + arthur.playerId, {}, function(res) {
				// 				expect(JSON.parse(res.data.pass)).toEqual(data.msg.pass);
				// 			});
				// 		});
				// 	});
				// });

				describe('Cases than can not pass', function() {
					beforeEach(function() {
						loginWith(mike.account, mike.password, mike.areaId);
					});


					describe('when start a pass than greater than the player has passed', function() {
						it('should can not execute the pass that greater than the player has passed', function() {
							request('area.taskHandler.passBarrier', {
								layer: 27
							}, function(data) {
								expect(data).toEqual({
									code: 501,
									msg: '不能闯此关'
								});
							});
						});
					});

					describe('when pass is less than 1', function() {
						it('should can not execute the pass', function() {
							request('area.taskHandler.passBarrier', {
								layer: 0
							}, function(data) {
								expect(data).toEqual({
									code: 501,
									msg: '不能闯此关'
								});
							});
						});
					});


					describe('when pass is greater than 100', function() {

						it('should can not execute the pass', function() {
							request('area.taskHandler.passBarrier', {
								layer: 101
							}, function(data) {
								expect(data).toEqual({
									code: 501,
									msg: '不能闯此关'
								});
							});
						});
					});

				});
			});

			describe("连续爬塔50层测试", function() {
				beforeEach(function() {
					loginWith(passer.account, passer.password, passer.areaId);
				});

				function doPassBarrier(layer) {
					it('爬塔第 ' + layer + ' 层', function() {
						request('area.taskHandler.passBarrier', {
							layer: layer
						}, function(data) {
							console.log('第' + layer + '层：', data);
							expect(data.code).toEqual(200);
							expect(data.msg).toBeDefined();
							expect(data.msg).hasProperties([
								'battleLog',
								'pass',
								'power',
								'exp',
								'lv',
								'spiritor'
							]);
							expect(data.msg.battleLog.winner).toEqual('own');
							//expect(data.msg.battleLog.rewards).hasProperties(['exp', 'skillPoint', 'spirit'])
                            console.log(data.msg.pass)
							expect(data.msg.pass).hasProperties(['layer', 'mark', 'hasMystical','canReset']);
							expect(data.msg.battleLog).toBeBattleLog();

							expect(data.msg.battleLog.rewards).hasProperties([
								'spirit', 'skillPoint', 'exp'
							]);

							doAjax('/player/' + passer.playerId, {}, function(res) {
								expect(JSON.parse(res.data.pass)).toEqual(data.msg.pass);
							});
						});
					});
				}

				for (var i = 1; i <= 60; i++) {
					(function(layer) {
						doPassBarrier(layer);
					})(i);
				}

			});


		});
	});
});


describe("Area Server", function() {

    describe("Task Handler", function() {

        describe('area.taskHandler.resetPassMark',function() {

            var mike = {
                id: 102,
                playerId: 102,
                areaId: 1,
                account: 'mike',
                password: '1'
            };

            beforeEach(function() {
                doAjax('/update/player/102', {
                    pass: JSON.stringify({
                        layer:30,
                        mark:[1073741823],
                        mystical: {
                            diff: 1,
                            isTrigger: false,
                            isClear: false
                        },
                        isReset:false
                    })
                }, function() {
                    loginWith(mike.account, mike.password, mike.areaId);
                });
            });

            it('should can reset pass mark',function(){
                request('area.taskHandler.resetPassMark', {}, function(data) {
                    console.log(data);
                    expect(data.code).toEqual(200);
                    expect(data.msg).toBeDefined();
                    expect(data.msg).hasProperties([
                        'gold'
                    ]);

                    doAjax('/player/' + mike.playerId, {}, function(res) {
                        //expect(JSON.parse(res.data.pass.mark)).toEqual(data.msg.passMark);
                        expect(res.data.gold).toEqual(data.msg.gold);
                    });

                });
            });
        });

        describe('can not reset pass mark',function(){

            var mike = {
                id: 102,
                playerId: 102,
                areaId: 1,
                account: 'mike',
                password: '1'
            };

            beforeEach(function() {
                doAjax('/update/player/102', {
                    gold:10000,
                    pass: JSON.stringify({
                        layer:30,
                        mark:[1073741823],
                        mystical: {
                            diff: 1,
                            isTrigger: false,
                            isClear: false
                        },
                        isReset:false
                    })
                }, function() {
                    loginWith(mike.account, mike.password, mike.areaId);
                });
            });


            it('when gold is already enough',function(){
                doAjax('/update/player/102', {

                    pass: JSON.stringify({
                        layer:30,
                        mark:[1073741823],
                        mystical: {
                            diff: 1,
                            isTrigger: false,
                            isClear: false
                        },
                        isReset:true
                    })
                },function(){
                    loginWith(mike.account, mike.password, mike.areaId);
                    request('area.taskHandler.resetPassMark', {}, function(data) {
                        console.log(data);
                        expect(data.code).toEqual(501);
                        expect(data.msg).toEqual('不能再重置关卡');
                    });
                });
            });

            it('when gold is not enough',function(){
                doAjax('/update/player/102', {
                    gold:180
                },function(){
                    loginWith(mike.account, mike.password, mike.areaId);
                    request('area.taskHandler.resetPassMark', {}, function(data) {
                        console.log(data);
                        expect(data.code).toEqual(501);
                        expect(data.msg).toEqual('元宝不足');
                    });
                });
            });


        });
    });

});


describe("Area Server", function () {

    describe("Task Handler", function () {

        beforeAll(function () {
            doAjax('/loaddata/csv', {}, function (data) {
                expect(data).toEqual('done');
            });
        });

        describe("area.taskHandler.mysticalPass", function () {
            var arthur = {
                id: 100,
                playerId: 100,
                areaId: 1,
                account: 'arthur',
                password: '1'
            };
            beforeEach(function () {
                doAjax('/update/player/100', {
                    pass: JSON.stringify({
                        "layer": 5,
                        "mark": [],
                        "mystical": { "diff": 1, "isTrigger": true, "isClear": false },
                        isReset:true
                    })
                }, function () {
                    loginWith(arthur.account, arthur.password, arthur.areaId);
                });

            });

            it("should can be return the true result", function () {
                request('area.taskHandler.mysticalPass',{}, function (data) {
                    console.log(data);
                    expect(data.code).toEqual(200);
                    expect(data.msg).toBeDefined();
                    expect(data.msg).hasProperties([
                        "battleLog",
                        "spiritor"
                    ]);
                });
            })

        });

    });

});