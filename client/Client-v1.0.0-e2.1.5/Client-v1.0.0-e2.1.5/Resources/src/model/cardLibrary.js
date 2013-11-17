/**
 * Created with JetBrains WebStorm.
 * User: lcc
 * Date: 13-7-10
 * Time: 下午3:04
 * To change this template use File | Settings | File Templates.
 */


/*
 * card library
 * */


var CARD_NO_EXIST = 0;
var CARD_EXIST = 1;
var CARD_RECEIVE = 2;

var MAX_CARD_TABLE_ID = 250;

var CardLibrary = Entity.extend({
    _cardLibrary: [],
    _type: {},

    init: function (data) {
        cc.log("CardLibrary init");

        this._cardLibrary = [];
        this._type = {};

        this._load();
        this.sync();

        return true;
    },

    update: function (data) {
        cc.log("CardLibrary sync");

        var mark = data.mark;
        var flag = data.flag;

        for (var i = 1; i <= MAX_CARD_TABLE_ID; ++i) {
            var offset = (i - 1) % EACH_NUM_BIT;
            index = Math.floor((i - 1) / EACH_NUM_BIT);

            this._changeTypeById(i, CARD_NO_EXIST);

            if (mark[index]) {
                if ((mark[index] >> offset & 1) == 1) {
                    this._changeTypeById(i, CARD_RECEIVE);

                    if (flag[index]) {
                        if ((flag[index] >> offset & 1) == 1) {
                            this._changeTypeById(i, CARD_EXIST);
                        }
                    }
                }
            }
        }
    },

    _load: function () {
        cc.log("CardLibrary _load");

        for (var i = 1; i <= MAX_CARD_TABLE_ID; ++i) {
            this._cardLibrary.push({
                id: i,
                card: Card.create({
                    tableId: i,
                    lv: 1,
                    skillLv: 1
                })
            })
        }

        this._cardLibrary.sort(this._sort);
    },

    sync: function () {
        cc.log("CardLibrary sync");

        var that = this;
        lz.server.request(
            "area.trainHandler.getCardBook",
            {},
            function (data) {
                cc.log("pomelo websocket callback data:");
                cc.log(data);

                if (data.code == 200) {
                    cc.log("sync success");

                    var msg = data.msg;

                    that.update(msg.cardBook);

                    lz.server.on("onLightUpCard", function (data) {
                        cc.log("***** on message:");
                        cc.log(data);

                        that._changeTypeById(data.msg.tableId, CARD_RECEIVE);
                    });
                } else {
                    cc.log("sync fail");

                    that.sync();
                }
            },
            true
        );
    },

    _sort: function (a, b) {
        var starA = a.card.get("star");
        var starB = b.card.get("star");

        var tableIdA = a.card.get("tableId");
        var tableIdB = b.card.get("tableId");

        if (starA != starB) {
            return (starB - starA);
        } else {
            return tableIdA - tableIdB;
        }
    },

    _changeTypeById: function (id, type) {
        this._type[id] = type;
    },

    getTypeById: function (id) {
        return this._type[id];
    },

    receive: function (cb, id) {
        cc.log("CardLibraryLayer receive");

        var that = this;
        lz.server.request("area.trainHandler.getCardBookEnergy", {
            tableId: id
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("receive success");

                var msg = data.msg;

                gameData.player.add("energy", msg.energy);

                that._changeTypeById(id, CARD_EXIST);

                cb(msg.energy);

                lz.dc.event("event_card_book");
            } else {
                cc.log("receive fail");
            }
        });
    }
});


CardLibrary.create = function () {
    var ret = new CardLibrary();

    if (ret) {
        return ret;
    }

    return null;
};