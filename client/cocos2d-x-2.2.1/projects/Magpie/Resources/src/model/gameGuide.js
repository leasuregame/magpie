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
        "name": "passGuide"
    },
    "3": {
        "tableName": "card3_position",
        "tip": "第3个卡槽已开启，现在可上阵新的卡牌。",
        "name": "card3Guide"
    },
    "4": {
        "tableName": "lottery",
        "tip": "寻宝已开启，现在可回到首页参与该功能。",
        "name": "treasureHuntGuide"
    },
    "5": {
        "tableName": "card4_position",
        "tip": "第4个卡槽已开启，现在可上阵新的卡牌。",
        "name": "card4Guide"
    },
    "6": {
        "tableName": "ranking_list",
        "tip": "排行榜已开放，现在可回到首页，进行查询。",
        "name": "rankGuide"
    },
    "7": {
        "tableName": "card5_position",
        "tip": "第5个卡槽已开启，现在可上阵新的卡牌。",
        "name": "card5Guide"
    }
};

var EXPLAIN = {
    "rank": {
        effect: "uiEffect71"
    },
    "pass": {
        effect: "uiEffect72"
    }
};

var gameGuide = {
    _tournamentGuide: false,
    _passGuide: false,
    _treasureHuntGuide: false,
    _rankGuide: false,
    _card3Guide: false,
    _card4Guide: false,
    _card5Guide: false,
    _isFirstPassiveSkillAfresh: false,
    _lotteryGuide: false,
    _bossGuide: false,

    updateGuide: function () {
        var table = outputTables.function_limit.rows[1];
        var lv = gameData.player.get("lv");

        for (var i = 1; i <= 7; i++) {
            var guide = FUNCTION_OPEN[i];

            if (lv == table[guide.tableName]) {
                var point = gameFit.gameGuide.effectPoint;
                var tipEffect = cc.BuilderReader.load(main_scene_image.uiEffect58, this);
                tipEffect.controller.ccbTipLabel.setString(guide.tip);
                tipEffect.setPosition(point);
                tipEffect.animationManager.setCompletedAnimationCallback(this, function () {
                    tipEffect.removeFromParent();
                });

                this.set(guide.name, true);

                if (EXPLAIN[guide.tableName]) {
                    this.set(guide.tableName + "Explain", true);
                }

                MainScene.getInstance().updateGuide();
                MainScene.getInstance().getLayer().addChild(tipEffect, 10);

                break;
            }
        }

        if (lv == table["pass_skillafresh"]) {
            this.set("isFirstPassiveSkillAfresh", true);
        }
    },

    updateLotteryGuide: function () {
        if (gameData.lottery._freeLowLotteryCard || gameData.lottery._freeHighLotteryCard) {
            this.set("lotteryGuide", true);
            MainScene.getInstance().updateGuide();
        }
    },

    updateBossGuide: function () {
        this.set("bossGuide", true);
        MainScene.getInstance().updateGuide();
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
