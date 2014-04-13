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

            describe('when asking to add self', function() {
                beforeEach(function() {
                    loginWith(arthur.account, arthur.password, arthur.areaId);
                });

                it('should can send the message', function() {
                    request('area.messageHandler.addFriend', {
                        friendName: 'Attacker'
                    }, function(data) {
                        expect(data).toEqual({
                            code: 501,
                            msg: '不能添加自己为好友'
                        });
                    });
                });
            });

            describe('when add a friend twice', function(){
                beforeEach(function(){
                    loginWith('1', '1', 1);
                });

                it('should can not send the second request', function(){
                    request('area.messageHandler.addFriend', {
                        friendName: 'Mike'
                    }, function(data) {
                        expect(data).toEqual({
                            code: 200
                        });
                    });

                    request('area.messageHandler.addFriend', {
                        friendName: 'Mike'
                    }, function(data) {
                        expect(data).toEqual({
                            code: 501,
                            msg: '不能重复发送请求'
                        });
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
                        expect(data.code).toEqual(200);
                        expect(data.msg.id).toEqual(100);
                        expect(data.msg.name).toEqual('Attacker');
                        expect(data.msg.lv).toEqual(40);
                        // expect(data.msg.ability).toEqual(1000);
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
                        sender: 101,
                        receiver: arthur.playerId,
                        type: 1, 
                        status: 1
                    }, function() {});
                    doAjax('/message/add', {
                        sender: 101,
                        receiver: arthur.playerId,
                        type: 1,
                        status: 1
                    }, function() {});
                    doAjax('/message/add', {
                        sender: 101,
                        receiver: arthur.playerId,
                        type: 1,
                        status: 1
                    }, function() {});
                    doAjax('/message/add', {
                        sender: 101,
                        receiver: arthur.playerId,
                        type: 1, 
                        status: 1
                    }, function() {});
                    doAjax('/message/add', {
                        sender: 101,
                        receiver: arthur.playerId,
                        type: 2, 
                        status: 5
                    }, function() {});
                    doAjax('/message/add', {
                        sender: 101,
                        receiver: arthur.playerId,
                        type: 2, 
                        status: 4
                    }, function() {});
                    doAjax('/message/add', {
                        sender: 101,
                        receiver: arthur.playerId,
                        type: 2,
                        status: 4
                    }, function() {});
                    doAjax('/message/add', {
                        sender: 101,
                        receiver: arthur.playerId,
                        type: 3,
                        status: 6
                    }, function() {});
                    doAjax('/message/add', {
                        sender: 101,
                        receiver: arthur.playerId,
                        type: 3,
                        status: 6
                    }, function() {});
                    doAjax('/message/add', {
                        receiver: arthur.playerId,
                        type: 4,
                        sender: -1,
                        receiver: -1,
                        status: 4
                    }, function() {});                    
                    doAjax('/message/add', {
                        receiver: arthur.playerId,
                        type: 4,
                        sender: -1,
                        status: 5
                    }, function() {});
                    doAjax('/message/add', {
                        receiver: arthur.playerId,
                        type: 4,
                        sender: -1,
                        status: 4
                    }, function() {});
                    doAjax('/message/add', {
                        type: 4,
                        sender: -1,
                        receiver: -1,
                        status: 4
                    }, function() {});
                    doAjax('/message/add', {
                        type: 4,
                        sender: -1,
                        receiver: -1,
                        status: 4
                    }, function() {});

                    loginWith(arthur.account, arthur.password, arthur.areaId);
                });

                afterEach(function() {
                    doAjax('')
                });

                it('should can return message list for current login user', function() {
                    request('area.messageHandler.messageList', {}, function(data) {
                        console.log(data);
                        expect(data.msg.friend.length).toEqual(7);
                        expect(data.msg.battle.length).toEqual(2);
                        expect(data.msg.system.length).toEqual(5);
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

    describe('when player‘s friends is full', function() {

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