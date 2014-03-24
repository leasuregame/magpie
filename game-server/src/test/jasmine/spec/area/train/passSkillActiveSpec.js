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

            for (var i = 0; i < data.msg.passiveSkills.length; i++) {
              var ps = data.msg.passiveSkills[i];
              if (ps.id == gid) {
                expect(ps.active).toEqual(true);
              } else {
                expect(ps.active).toEqual(false);
              }
            }

            doAjax('/card/100', function(res) {
              expect(JSON.parse(res.data.passiveSkills)).toEqual(data.msg.passiveSkills);
            });
          });

          

        });

        it('修改成功1', function(){
          var gid = 3;
          request('area.trainHandler.passSkillActive', {
            cardId: 100,
            groupId: gid
          }, function(data) {
            console.log(data);

            for (var i = 0; i < data.msg.passiveSkills.length; i++) {
              var ps = data.msg.passiveSkills[i];
              if (ps.id == gid) {
                expect(ps.active).toEqual(true);
              } else {
                expect(ps.active).toEqual(false);
              }
            }

            doAjax('/card/100', function(res) {
              expect(JSON.parse(res.data.passiveSkills)).toEqual(data.msg.passiveSkills);
            });
          });
        })

      });
    });
  });
});