describe("Area server API", function() {
	beforeAll(function() {
		doAjax('/loaddata/csv', {}, function() {});
	});

	describe("when a player login the game", function() {
		beforeEach(function() {
			request("connector.userHandler.login", {
				account: '1',
				password: '1'
			}, function(data) {
				console.log(data);
				expect(data.code).toEqual(200);
			});
		});

		it("should can entry", function() {
			request("area.entryHandler.entry", {}, function(data) {
				expect(data).toEqual("");
			});
		});
	});

});