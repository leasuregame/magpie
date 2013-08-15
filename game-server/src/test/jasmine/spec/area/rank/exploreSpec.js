describe("Area Server", function() {
	beforeAll(function() {
		initPomelo();

		doAjax('/loaddata/csv', {}, function(data) {
			expect(data).toEqual('done');
		});
	});

	describe("Task Handler", function() {
		
	});

});