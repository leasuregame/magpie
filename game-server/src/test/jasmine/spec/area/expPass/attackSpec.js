describe("Area Server", function() {
  describe("Exp Pass Handler", function() {
    describe("area.expPassHandler.attack", function() {
      // beforeAll(function() {
      //   doAjax('/loaddata/csv', {}, function() {});
      // });

      describe("当玩家可以攻打经验副本时", function(){
        beforeEach(function() {
          loginWith('arthur', '1', 1);
        });

        it("返回正确的结果，并得到正确经验卡奖励", function(){
          request('area.expPassHandler.attack', {
            id: 3
          }, function(data) {
            console.log(data);
            expect(data).toEqual([]);
          });

        });

      });

    });
  });
});