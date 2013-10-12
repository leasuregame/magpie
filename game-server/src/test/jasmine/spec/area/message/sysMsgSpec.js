/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-29
 * Time: 上午12:10
 * To change this template use File | Settings | File Templates.
 */

describe("Area Server", function() {
    describe('Message Handler', function() {
        describe('send system message',function(){
            beforeAll(function(){
                request('connector.entryHandler.entryForGM',
                    {areaId: 1},
                    function (data) {
                        console.log("data = ", data);
                       // expect(data.code).toEqual(200);
                       // expect(data.msg).toEqual('连接服务器成功');
                    });
            });

            it('should send system message success',function(){
                request('area.messageHandler.sysMsg',{
                    msgId:1,
                    options:{
                        "gold":100,
                        "money":100,
                        "power":100,
                        "spirit":100,
                        "skillPoint":100,
                        "elixir":100
                    },
                    content:'奖励'
                },function(data){
                    console.log(data);
                    expect(data.code).toEqual(200);
                    expect(data.msg).toEqual('邮件发送成功');

                });
            });
        });

        describe('get system message',function(){

            var arthur = {
                id: 100,
                playerId: 100,
                areaId: 1,
                account: 'arthur',
                password: '1'
            };

            //var time = Data.now();

            beforeAll(function(){
                doAjax('/update/player/100',{
                    "gold":0,
                    "money":0,
                    "power":{
                        time: 0,
                        value: 0
                    },
                    "spirit":0,
                    "skillPoint":0,
                    "elixir":0
                },function(){
                    loginWith(arthur.account, arthur.password, arthur.areaId);
                })
            });

            it('should can get the system message',function(){
                request('area.messageHandler.handleSysMsg',{
                    msgId:1
                },function(data){
                    console.log(data);
                    expect(data.code).toEqual(200);
                    expect(data.msg).toEqual('成功领取奖励');


                });
            });

        });
    });
});

