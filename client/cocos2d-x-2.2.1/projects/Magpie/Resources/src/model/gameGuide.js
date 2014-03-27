/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-11-23
 * Time: 下午4:38
 * To change this template use File | Settings | File Templates.
 */


var FUNCTION_OPEN = {
    "1": {
        "tableName": "rank",
        "tip": "竞技场已开启，现在可参与。",
        "name": "tournamentGuide"
    },
    "2": {
        "tableName": "pass",
        "tip": "天道已开启，现在可参与。",
        "name": "instancesGuide",
        "childName": "passGuide"
    },
    "3": {
        "tableName": "lottery",
        "tip": "寻宝已开启，现在可回到首页参与该功能。",
        "name": "treasureHuntGuide"
    },

    "4": {
        "tableName": "ranking_list",
        "tip": "排行榜已开放，现在可回到首页，进行查询。",
        "name": "rankGuide"
    }

};

var CARD_LINEUP_LIMIT = [
    {
        "1": {
            "tableName": "card_3",
            "tip": "第3个卡槽已开启，现在可上阵新的卡牌。",
            "name": "card3Guide"
        },
        "2": {
            "tableName": "card_4",
            "tip": "第4个卡槽已开启，现在可上阵新的卡牌。",
            "name": "card4Guide"
        },
        "3": {
            "tableName": "card_5",
            "tip": "第5个卡槽已开启，现在可上阵新的卡牌。",
            "name": "card5Guide"
        }
    },
    {
        "1": {
            "tableName": "card_1",
            "tip": "援军卡组已开启，现在可上阵新的卡牌",
            "name": "succorCardsGuide"
        }
    }
];

var EXPLAIN = {
    "rank": {
        effect: "uiEffect71"
    },
    "pass": {
        effect: "uiEffect72"
    },
    "boss": {
        effect: "uiEffect94"
    }
};

var gameGuide = {
    _tournamentGuide: false,
    _passGuide: false,
    _instancesGuide: false,
    _treasureHuntGuide: false,
    _rankGuide: false,
    _card3Guide: false,
    _card4Guide: false,
    _card5Guide: false,
    _isFirstPassiveSkillAfresh: false,
    _lotteryGuide: false,
    _bossGuide: false,
    _succorCardsGuide: false,

    updateGuide: function () {
        var table = outputTables.function_limit.rows[1];
        var lv = gameData.player.get("lv");
        var i, guide;

        var len = Object.keys(FUNCTION_OPEN).length;
        for (i = 1; i <= len; i++) {
            guide = FUNCTION_OPEN[i];

            if (lv == table[guide.tableName]) {
                this._addGuide(guide);
                break;
            }
        }

        if (lv == table["pass_skillafresh"]) {
            this.set("isFirstPassiveSkillAfresh", true);
        }


        //卡槽开放
        len = CARD_LINEUP_LIMIT.length;
        for (i = 0; i < len; i++) {
            var limit = CARD_LINEUP_LIMIT[i];
            table = outputTables.card_lineup_limit.rows[i];
            var len1 = Object.keys(limit).length;
            for (var j = 1; j <= len1; j++) {
                guide = limit[j];
                if (lv == table[guide.tableName]) {
                    this._addGuide(guide);
                    break;
                }
            }
        }
    },

    _addGuide: function (guide) {

        var point = gameFit.gameGuide.effectPoint;
        var tipEffect = cc.BuilderReader.load(main_scene_image.uiEffect58, this);
        tipEffect.controller.ccbTipLabel.setString(guide.tip);
        tipEffect.setPosition(point);
        tipEffect.animationManager.setCompletedAnimationCallback(this, function () {
            tipEffect.removeFromParent();
        });

        this.set(guide.name, true);

        if (guide.childName) {
            this.set(guide.childName, true);
        }

        if (EXPLAIN[guide.tableName]) {
            this.set(guide.tableName + "Explain", true);
        }

        MainScene.getInstance().updateGuide();
        MainScene.getInstance().getLayer().addChild(tipEffect, 10);
    },

    updateLotteryGuide: function () {
        if (gameData.lottery._freeLowLotteryCard || gameData.lottery._freeHighLotteryCard) {
            this.set("lotteryGuide", true);
            MainScene.getInstance().updateGuide();
        }
    },

    updateBossGuide: function () {

        var uid = gameData.player.get("uid");
        var isFirstMeetBoss = lz.load("meetBoss" + uid) || 0;

        if (!isFirstMeetBoss) {
            this.set("bossGuide", true);
            this.set("bossExplain", true);

            var point = gameFit.gameGuide.effectPoint;
            var tipEffect = cc.BuilderReader.load(main_scene_image.uiEffect93, this);
            tipEffect.setPosition(point);
            tipEffect.animationManager.setCompletedAnimationCallback(this, function () {
                tipEffect.removeFromParent();
            });

            MainScene.getInstance().getLayer().addChild(tipEffect, 10);
            MainScene.getInstance().updateGuide();

            lz.save("meetBoss" + uid, 1);
        }
    },

    getExplainEffect: function (name) {
        return EXPLAIN[name].effect;
    },

    get: function (name) {
        return this["_" + name];
    },

    set: function (name, value) {
        this["_" + name] = value;
    }
};
