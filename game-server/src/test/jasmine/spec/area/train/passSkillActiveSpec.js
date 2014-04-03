describe("Area Server", function() {

  describe("Train Handler", function() {

    describe('area.trainHandler.passSkillActive', function() {

      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function(data) {
          expect(data).toEqual('done');
        });
      });

      describe('修改激活的分组', function() {
        beforeEach(function() {
          loginWith('arthur', '1', 1);
        });

        it('成功修改', function() {
          var gid = 2;
          request('area.trainHandler.passSkillActive', {
            cardId: 100,
            groupId: gid
          }, function(data) {
            console.log(data);

            doAjax('/card/100', function(res) {
              var pass = JSON.parse(res.data.passiveSkills);

              for (var i = 0; i < pass.length; i++) {
                var ps = pass[i];
                if (ps.id == gid) {
                  expect(ps.active).toEqual(true);
                } else {
                  expect(ps.active).toEqual(false);
                }
              }
            });
          });



        });

        it('修改成功1', function() {
          var gid = 3;
          request('area.trainHandler.passSkillActive', {
            cardId: 100,
            groupId: gid
          }, function(data) {
            console.log(data);

            doAjax('/card/100', function(res) {
              var pass = JSON.parse(res.data.passiveSkills);

              for (var i = 0; i < pass.length; i++) {
                var ps = pass[i];
                if (ps.id == gid) {
                  expect(ps.active).toEqual(true);
                } else {
                  expect(ps.active).toEqual(false);
                }
              }
            });
          });
        })

      });
    });
  });
});