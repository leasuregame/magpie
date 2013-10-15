describe("Area Server", function() {
	describe("Achieve Handler", function() {
		describe("area.achieveHandler.achievements", function() {

			describe('when get achievements from server', function() {

				describe('when player level is less than 50', function() {
					beforeAll(function() {
						doAjax('/loaddata/csv', {}, function() {});
					});
					beforeEach(function() {
						loginWith('arthur', '1', 1);
					});

					it('default value of achievements is empty', function() {
						console.log('message');
						request('area.achieveHandler.achievements', {}, function(data) {
							expect(data.code).toEqual(200);
							expect(data.msg).toEqual({
								1: {
									isAchieve: false,
									isTake: false,
									got: 40
								},
								2: {
									isAchieve: false,
									isTake: false,
									got: 40
								},
								3: {
									isAchieve: false,
									isTake: false,
									got: 24
								},
								4: {
									isAchieve: false,
									isTake: false,
									got: 24
								}
							});
						});
					});
				});


				describe('when player level is 50', function() {
					beforeAll(function() {
						doAjax('/loaddata/csv', {}, function() {});
					});
					beforeEach(function() {
						doAjax('/update/player/100', {
							lv: 50
						}, function(res) {
							loginWith('arthur', '1', 1);
						});
					});

					it('获得成就：升级达人', function() {
						console.log('message');
						request('area.achieveHandler.achievements', {}, function(data) {
							expect(data.code).toEqual(200);
							expect(data.msg).toEqual({
								1: {
									isAchieve: true,
									isTake: false,
									got: 50
								},
								2: {
									isAchieve: false,
									isTake: false,
									got: 50
								},
								3: {
									isAchieve: false,
									isTake: false,
									got: 24
								},
								4: {
									isAchieve: false,
									isTake: false,
									got: 24
								}
							});
						});
					});
				});

				describe('when player level is 70', function() {
					beforeAll(function() {
						doAjax('/loaddata/csv', {}, function() {});
					});
					beforeEach(function() {
						doAjax('/update/player/100', {
							lv: 70
						}, function(res) {
							loginWith('arthur', '1', 1);
						});
					});

					it('获得成就：升级达人，但未获得：疯狂升级', function() {
						console.log('message');
						request('area.achieveHandler.achievements', {}, function(data) {
							expect(data.code).toEqual(200);
							expect(data.msg).toEqual({
								1: {
									isAchieve: true,
									isTake: false,
									got: 50
								},
								2: {
									isAchieve: false,
									isTake: false,
									got: 70
								},
								3: {
									isAchieve: false,
									isTake: false,
									got: 24
								},
								4: {
									isAchieve: false,
									isTake: false,
									got: 24
								}
							});
						});
					});
				});

				describe('when player level is 90', function() {
					beforeAll(function() {
						doAjax('/loaddata/csv', {}, function() {});
					});
					beforeEach(function() {
						doAjax('/update/player/100', {
							lv: 90
						}, function(res) {
							loginWith('arthur', '1', 1);
						});
					});

					it('获得成就：升级达人，疯狂升级', function() {
						console.log('message');
						request('area.achieveHandler.achievements', {}, function(data) {
							expect(data.code).toEqual(200);
							expect(data.msg).toEqual({
								1: {
									isAchieve: true,
									isTake: false,
									got: 50
								},
								2: {
									isAchieve: true,
									isTake: false,
									got: 90
								},
								3: {
									isAchieve: false,
									isTake: false,
									got: 24
								},
								4: {
									isAchieve: false,
									isTake: false,
									got: 24
								}
							});
						});
					});
				});

				describe('when player pass layer is 50', function() {
					beforeAll(function() {
						doAjax('/loaddata/csv', {}, function() {});
					});
					beforeEach(function() {
						doAjax('/update/player/100', {
							passLayer: 50
						}, function(res) {
							loginWith('arthur', '1', 1);
						});
					});

					it('获得成就：一半！', function() {
						console.log('message');
						request('area.achieveHandler.achievements', {}, function(data) {
							expect(data.code).toEqual(200);
							expect(data.msg[3]).toEqual({
								isAchieve: true,
								isTake: false,
								got: 50
							});
						});
					});
				});

				describe('when player pass layer is 100', function() {
					beforeAll(function() {
						doAjax('/loaddata/csv', {}, function() {});
					});
					beforeEach(function() {
						doAjax('/update/player/100', {
							passLayer: 100
						}, function(res) {
							loginWith('arthur', '1', 1);
						});
					});

					it('获得成就：通关！', function() {
						console.log('message');
						request('area.achieveHandler.achievements', {}, function(data) {
							expect(data.code).toEqual(200);
							expect(data.msg[3]).toEqual({
								isAchieve: true,
								isTake: false,
								got: 50
							});
							expect(data.msg[4]).toEqual({
								isAchieve: true,
								isTake: false,
								got: 100
							});
						});

						request('area.achieveHandler.getReward', {
							id: 4
						}, function(data) {
							expect(data).toEqual({
								code: 200
							});
						});

						request('area.achieveHandler.achievements', {}, function(data) {
							expect(data.code).toEqual(200);
							expect(data.msg[3]).toEqual({
								isAchieve: true,
								isTake: false,
								got: 50
							});
							expect(data.msg[4]).toEqual({
								isAchieve: true,
								isTake: true,
								got: 100
							});
						});


					});
				});

			});
		});
	});
});