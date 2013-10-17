describe("Area Server", function() {
    describe('Message Handler', function() {
        var arthur = {
            id: 100,
            playerId: 100,
            areaId: 1,
            account: 'arthur',
            password: '1'
        };

        describe('area.messageHandler.addFriend', function() {


            beforeAll(function() {
                doAjax('/loaddata/csv', {}, function() {});
            });

            describe('when asking to add an exist player as a friend', function() {
                beforeEach(function() {
                    loginWith(arthur.account, arthur.password, arthur.areaId);
                });

                it('should can send the message', function() {
                    request('area.messageHandler.addFriend', {
                        friendName: 'Mike'
                    }, function(data) {
                        expect(data).toEqual({
                            code: 200
                        }); // 对方不在线
                    });
                });
            });

            describe('when receive a friendship asking', function() {
                beforeEach(function() {
                    loginWith('2', '1', 1);
                });

                it('should can accept', function() {
                    request('area.messageHandler.accept', {
                        msgId: 1
                    }, function(data) {
                        expect(data).toEqual({
                            code: 200,
                            msg: {
                                id: 100,
                                name: 'Attacker',
                                lv: 40,
                                ability: 120525
                            }
                        });
                    });
                });

                it('should can reject', function() {
                    request('area.messageHandler.reject', {
                        msgId: 1
                    }, function(data) {
                        expect(data).toEqual({
                            code: 200,
                            msg: '已处理'
                        });
                    });
                });
            });
        });


        describe('area.messageHandler.messageList', function() {
            describe('when get message list', function() {
                beforeEach(function() {
                    doAjax('/message/add', {
                        receiver: arthur.playerId,
                        type: 1
                    }, function() {});
                    doAjax('/message/add', {
                        receiver: arthur.playerId,
                        type: 1
                    }, function() {});
                    doAjax('/message/add', {
                        receiver: arthur.playerId,
                        type: 1
                    }, function() {});
                    doAjax('/message/add', {
                        receiver: arthur.playerId,
                        type: 2
                    }, function() {});
                    doAjax('/message/add', {
                        receiver: arthur.playerId,
                        type: 2
                    }, function() {});
                    doAjax('/message/add', {
                        receiver: arthur.playerId,
                        type: 2
                    }, function() {});
                    doAjax('/message/add', {
                        receiver: arthur.playerId,
                        type: 3
                    }, function() {});
                    doAjax('/message/add', {
                        receiver: arthur.playerId,
                        type: 3
                    }, function() {});
                    doAjax('/message/add', {
                        receiver: arthur.playerId,
                        type: 4
                    }, function() {});


                    loginWith(arthur.account, arthur.password, arthur.areaId);
                });

                it('should can return message list for current login user', function() {
                    request('area.messageHandler.messageList', {}, function(data) {
                        console.log(data);
                        expect(data.msg.friend.length).toEqual(6);
                        expect(data.msg.battle.length).toEqual(2);
                        expect(data.msg.system.length).toEqual(1);
                    });
                });
            });

        });


    });
});


describe('when add a friend', function() {

    var player = {
        id: 4,
        playerId: 4,
        areaId: 1,
        account: '4',
        password: '1'
    };

    beforeAll(function() {

        var id = 1000;
        var maxId = 1020;
        async.whilst(
            function() {
                return id < maxId;
            },
            function(callback) {
                doAjax('/addPlayerbyId', {
                    id: id,
                    areaId: 1,
                    name: 'test' + id,
                    userId: id
                }, function(data) {
                    doAjax('/addFriend', {
                        playerId: 110,
                        friendId: id
                    }, function(data) {
                        id++;
                        callback();
                    });
                });


            },
            function(err) {
                console.log(id);
            }
        );


    });

    describe('when opposite‘s friends is full', function() {

        beforeEach(function() {
            loginWith(player.account, player.password, player.areaId);
        });

        it('should not add a friend', function() {
            request('area.messageHandler.addFriend', {
                friendName: 'Passer'
            }, function(data) {
                console.log(data);
                expect(data.code).toEqual(501);
                expect(data.msg).toEqual('对方好友已达上限');
            });
        });
    });


    describe('when friends is full', function() {

        beforeEach(function() {
            loginWith('Passer', '1', 1);
        });


        it('should not add a friend', function() {
            request('area.messageHandler.addFriend', {
                friendName: 'Mike'
            }, function(data) {
                console.log(data);
                expect(data.code).toEqual(501);
                expect(data.msg).toEqual('您的好友已达上限');
            });
        });

    });

});