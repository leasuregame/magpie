
describe("Area Server", function () {

    describe("Task Handler", function () {

        beforeAll(function () {
            doAjax('/loaddata/csv', {}, function (data) {
                expect(data).toEqual('done');
            });
        });

        describe("area.taskHandler.mysticalPass", function () {

            describe('should can enter mysticalPass',function() {
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
                            "spiritor",
                            "hasMystical"
                        ]);
                    });
                });

            });

            describe('should can not enter mysticalPass',function() {

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
                            "mystical": { "diff": 1, "isTrigger": false, "isClear": true },
                            isReset:true
                        })
                    }, function () {
                        loginWith(arthur.account, arthur.password, arthur.areaId);
                    });

                });

                it("should can be return the true result", function () {
                    request('area.taskHandler.mysticalPass',{}, function (data) {
                        console.log(data);
                        expect(data.code).toEqual(501);
                        expect(data.msg).toEqual('不能闯此神秘关卡');
                    });
                });


            });

        });

    });

});

