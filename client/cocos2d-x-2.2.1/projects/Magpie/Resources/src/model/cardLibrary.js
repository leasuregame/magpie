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
        var len = this._cardLibrary.length;

        for (var i = 0; i < len; ++i) {
            var id = this._cardLibrary[i].id;
            var offset = (id - 1) % EACH_NUM_BIT;
            var index = Math.floor((id - 1) / EACH_NUM_BIT);

            if (mark[index]) {
                if ((mark[index] >> offset & 1) == 1) {
                    this._changeTypeById(id, CARD_RECEIVE);

                    if (flag[index]) {
                        if ((flag[index] >> offset & 1) == 1) {
                            this._changeTypeById(id, CARD_EXIST);
                        }
                    }

                    continue;
                }
            }

            this._changeTypeById(id, CARD_NO_EXIST);
        }
    },

    _load: function () {
        cc.log("CardLibrary _load");

        var table = outputTables.cards.rows;

        for (var i = 1; i <= MAX_CARD_TABLE_ID; ++i) {
            if (table[i]) {
                cc.log(i);

                this._cardLibrary.push({
                    id: i,
                    card: Card.create({
                        tableId: i,
                        lv: 1,
                        skillLv: 1
                    })
                })
            }
        }
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
                    that.setListener();

                    gameMark.updateCardLibraryMark(false);

                    lz.um.event("event_get_card_book");
                } else {
                    cc.log("sync fail");

                    that.sync();
                }
            },
            true
        );
    },

    setListener: function () {
        cc.log("CardLibrary setListener");

        var that = this;

        lz.server.on("onLightUpCard", function (data) {
            cc.log("***** on message:");
            cc.log(data);

            that._changeTypeById(data.msg.tableId, CARD_RECEIVE);
            gameMark.updateCardLibraryMark(true);
        });
    },

    _sort1: function (a, b) {
        return (a.card.get("tableId") - b.card.get("tableId"));
    },

    _sort2: function (a, b) {
        var cardLibrary = gameData.cardLibrary;

        var stateA = cardLibrary.getTypeById(a.id);
        var stateB = cardLibrary.getTypeById(b.id);

        var tableIdA = a.card.get("tableId");
        var tableIdB = b.card.get("tableId");

        if (stateA == CARD_RECEIVE && stateB != CARD_RECEIVE) {
            return -1;
        }

        if (stateA != CARD_RECEIVE && stateB == CARD_RECEIVE) {
            return 1;
        }

        return (tableIdA - tableIdB);
    },

    isSortByState: function (res) {
        var sort = res ? this._sort2 : this._sort1;
        this._cardLibrary.sort(sort);
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

                cb(msg);

                lz.um.event("event_receive_card_book_reward", id);
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