/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-9
 * Time: 下午4:36
 * To change this template use File | Settings | File Templates.
 */


/*
 * achievement
 * */


var Achievement = Entity.extend({
    _achievement: [],

    init: function () {
        cc.log("Achievement init");

        this.sync();
    },

    update: function (data) {
        cc.log("Achievement update");
        cc.log(data);

        this._achievement = [];

        var table = outputTables.achievement.rows;

        for (var key in table) {
            var achievement = {
                id: table[key].id,
                need: table[key].need,
                count: 0,
                name: table[key].name,
                description: table[key].desc,
                gold: table[key].gold,
                energy: table[key].energy
            };

            if (data[key]) {
                achievement.count = data[key].got || 0;
                achievement.isReceiver = data[key].isTake || false;
                achievement.isAchieve = data[key].isAchieve || false;
            }

            this._achievement.push(achievement);
        }
    },

    sync: function () {
        cc.log("Achievement sync");

        var that = this;
        lz.server.request(
            "area.achieveHandler.achievements",
            {},
            function (data) {
                cc.log("pomelo websocket callback data:");
                cc.log(data);

                if (data.code == 200) {
                    cc.log("sync success");

                    var msg = data.msg;

                    that.update(msg);
                    that.setListener();

                    gameMark.updateAchievementMark(false);

                    lz.um.event("event_achievement");
                } else {
                    cc.log("sync fail");

                    TipLayer.tip(data.msg);

                    that.sync();
                }
            },
            true
        );
    },

    setListener: function () {
        cc.log("Achievement setListener");

        var that = this;

        lz.server.on("onAchieve", function (data) {
            cc.log("***** on achieve:");
            cc.log(data);

            that.setAchieve(data.msg.achieveId);
            gameMark.updateAchievementMark(true);
        });
    },

    getAchievementList: function () {
        cc.log("Achievement getAchievementList");

        this._achievement.sort(this._cmp);

        return this._achievement;
    },

    _cmp: function (a, b) {
        cc.log("Achievement _cmp");

        var canReceiveA = a.isAchieve && !a.isReceiver;
        var canReceiveB = b.isAchieve && !b.isReceiver;

        if (canReceiveA && !canReceiveB) {
            return -1;
        } else if (!canReceiveA && canReceiveB) {
            return 1;
        } else {
            return (a.id - b.id);
        }
    },

    getAchievement: function (id) {
        cc.log("Achievement getAchievement");

        var len = this._achievement.length;

        for (var i = 0; i < len; ++i) {
            if (this._achievement[i].id == id) {
                return this._achievement[i];
            }
        }

        return null;
    },

    receiver: function (cb, id) {
        cc.log("Achievement receiver");

        var achievement = this.getAchievement(id);

        if (!achievement) {
            TipLayer.tip("领取的成就不存在");
            return;
        }

        var that = this;
        lz.server.request("area.achieveHandler.getReward", {
            id: id
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("receiver success");

                achievement.isReceiver = true;

                var reward = {
                    gold: achievement.gold,
                    energy: achievement.energy
                };

                gameData.player.adds(reward);

                cb(reward);

                lz.um.event("event_achievement_reward", id);
            } else {
                cc.log("receiver fail");

                TipLayer.tip(data.msg);
            }
        });
    },

    setAchieve: function (id) {
        cc.log("Achievement setAchieve");

        var achievement = this.getAchievement(id);
        achievement.isAchieve = true;
        achievement.count = achievement.need;

        var point = cc.p(320, 568);
        if (gameDevice != "Iphone5") {
            point = cc.p(360, 480);
        }

        var ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect57, this);
        ccbNode.setPosition(point);
        ccbNode.controller.ccbLabel.setString(achievement.name);
        MainScene.getInstance().addChild(ccbNode, 20);
    }
});


Achievement.create = function () {
    var ret = new Achievement();

    if (ret) {
        return ret;
    }

    return null;
}