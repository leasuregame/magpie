/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-29
 * Time: 上午12:10
 * To change this template use File | Settings | File Templates.
 */

describe("Area Server", function() {
    describe('Message Handler', function() {
        beforeAll(function() {
            doAjax('/loaddata/csv', {}, function(data) {});
        });

        describe('send system message', function() {
            beforeAll(function() {
                request('connector.entryHandler.entryForGM', {
                        areaId: 1
                    },
                    function(data) {
                        console.log("data = ", data);
                    });
            });

            it('should send system message success', function() {
                request('area.messageHandler.sysMsg', {
                    msgId: 1,
                    options: {
                        "gold": 100,
                        "money": 100,
                        "power": 100,
                        "spirit": 100,
                        "skillPoint": 100,
                        "elixir": 100
                    },
                    content: '奖励'
                }, function(data) {
                    console.log(data);
                    expect(data.code).toEqual(200);
                    expect(data.msg).toEqual('邮件发送成功');

                });
            });
        });

        describe('get system message', function() {

            var arthur = {
                id: 100,
                playerId: 100,
                areaId: 1,
                account: 'arthur',
                password: '1'
            };
            var msgId, before_player;

            //var time = Data.now();

            beforeEach(function() {
                async.parallel([
                    function(cb) {
                        doAjax('/update/player/100', {
                            "gold": 0,
                            "money": 0,
                            "power": JSON.stringify({
                                time: 0,
                                value: 0
                            }),
                            "skillPoint": 0,
                            "elixir": 0
                        }, function(res) { cb(null, res);});
                    },
                    function(cb) {
                        doAjax('/message/add', {
                            sender: -1,
                            receiver: -1,
                            options: JSON.stringify({
                                gold: 100,
                                money: 100,
                                powerValue: 120
                            }),
                            type: 4, // message
                            status: 5 // unhandled
                        }, function(res) { cb(null, res);});
                    },
                    function(cb) {
                        doAjax('/player/' + arthur.playerId, {}, function(res) { cb(null, res)});
                    }
                ], function(err, results) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('result: ', err, results);
                    msgId = results[1].insertId;
                    before_player = results[2].data;
                    loginWith(arthur.account, arthur.password, arthur.areaId);
                });
            });

            it('should can get the system message', function() {
                request('area.messageHandler.handleSysMsg', {
                    msgId: msgId
                }, function(data) {
                    console.log(data);
                    expect(data.code).toEqual(200);
                    expect(data.msg).toEqual({
                        gold: 100,
                        money: 100,
                        powerValue: 120
                    });

                    doAjax('/message/' + msgId, {}, function(res) {
                        expect(res.data.status).toEqual(5);
                    });

                    doAjax('/player/' + arthur.playerId, {}, function(res) {
                        expect(res.data.gold).toEqual(before_player.gold + 100);
                        expect(res.data.money).toEqual(before_player.money + 100);
                        expect(JSON.parse(res.data.power).value)
                        .toEqual(270);
                    });
                });
            });

        });
    });
});