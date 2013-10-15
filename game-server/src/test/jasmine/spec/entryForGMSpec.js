/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-27
 * Time: 下午3:40
 * To change this template use File | Settings | File Templates.
 */

describe('entry for GM', function () {

    it('should can entry with right id', function () {
        request('connector.entryHandler.entryForGM',
            {areaId: 1},
            function (data) {
                console.log("data = ", data);
                expect(data.code).toEqual(200);
                expect(data.msg).toEqual('连接服务器成功');
            });
    });

    it('should can not entry when id is null',function(){
        request('connector.entryHandler.entryForGM',
            {},
            function (data) {
                console.log("data = ", data);
                expect(data.code).toEqual(404);
                expect(data.msg).toEqual('找不到服务器');
            });
    });

    it('should can not entry when id is wrong',function(){
        request('connector.entryHandler.entryForGM',
            {areaId: -1},
            function (data) {
                console.log("data = ", data);
                expect(data.code).toEqual(404);
                expect(data.msg).toEqual('找不到服务器');
            });
    });

});
