/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-24
 * Time: 下午3:17
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-24
 * Time: 上午10:50
 * To change this template use File | Settings | File Templates.
 */
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
                        "layer": 5, "mark": [], "mystical": { "diff": 1, "isTrigger": true, "isClear": false }
                    })
                }, function () {
                    loginWith(arthur.account, arthur.password, arthur.areaId);
                });

            });

            it("should can be return the true result", function () {
                request('area.taskHandler.mysticalPass', function (data) {
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