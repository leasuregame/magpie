/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-21
 * Time: 下午4:37
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle layer
 * */


var BatterLayer = cc.Layer.extend({
    _battleLog: null,
    _battleNode: null,
    _locate: {
        1: cc.p(130, 450),
        2: cc.p(355, 450),
        3: cc.p(590, 450),
        4: cc.p(130, 250),
        5: cc.p(355, 250),
        6: cc.p(590, 250),
        7: cc.p(130, 750),
        8: cc.p(355, 750),
        9: cc.p(590, 750),
        10: cc.p(130, 950),
        11: cc.p(355, 950),
        12: cc.p(590, 950)
    },
    _rotation: {},

    init: function (battleLog) {
        cc.log("BatterLayer init");

        if (!this._super()) return false;

        this._battleLog = battleLog;

        var bgSprite = null;

        if (this._battleLog.get("type") == PVP_BATTLE_LOG) {
            bgSprite = cc.Sprite.create(main_scene_image.pvp_bg1);
        } else {
            bgSprite = cc.Sprite.create(main_scene_image.pve_bg1);
        }

        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(cc.p(40, 0));
        this.addChild(bgSprite);

        this._tipLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 30);
        this._tipLabel.setAnchorPoint(cc.p(0, 0));
        this._tipLabel.setPosition(150, 20);
        this.addChild(this._tipLabel);

        for (var i = 1; i <= 12; ++i) {
            label = cc.LabelTTF.create(i, "STHeitiTC-Medium", 60);
            label.setColor(cc.c3b(255, 255, 0));
            this.addChild(label, 1);
            label.setPosition(cc.p(this._locate[i].x - 70, this._locate[i].y + 50));
        }

        this._backItem = cc.MenuItemFont.create("结束战斗", this.end, this);
        this._backItem.setPosition(cc.p(250, -460));
        var menu = cc.Menu.create(this._backItem);
        this.addChild(menu);

        this._backItem.setVisible(false);

        var battleNode = battleLog.getBattleNode();

        cc.log(battleNode);

        this._battleNode = {};
        for (var key in battleNode) {
            if (battleNode[key] != undefined) {
                cc.log(battleNode[key]);

                if (typeof(battleNode[key]) == "number") {
                    this._battleNode[key] = BattleSpiritNode.create(battleNode[key]);
                } else {
                    this._battleNode[key] = BattleCardNode.create(battleNode[key]);
                }

                this._battleNode[key].setPosition(this._locate[key]);
                this.addChild(this._battleNode[key]);
            }
        }

        this._tipLabel.setString("");

        return true;
    },

    play: function () {
        cc.log("BatterLayer play");

        this._backItem.setVisible(true);

        this._battleLog.recover();
        this._playAStep();
    },

    end: function () {
        cc.log("BatterLayer end");

        this._backItem.setVisible(false);

        this.unscheduleAllCallbacks();

        BattlePlayer.getInstance().next();
    },

    _playAStep: function () {
        this.unschedule(this._playAStep);

        if (!this._battleLog.hasNextBattleStep()) {
            this.end();
            return;
        }

        cc.log("\n\n\nBattlePlayer _playAStep " + this._battleLog.getBattleStepIndex());

        var battleStep = this._battleLog.getBattleStep();

        if (battleStep.isSpiritAtk()) {
            battleStep.set("attacker", this._battleLog.getSpirit(battleStep.get("attacker")));
        }

        var str = battleStep.get("attacker") + (battleStep.get("isSkill") ? " 用技能 揍了 " : " 用普攻 揍了 ");
        str += battleStep.get("target");
        str += " 伤害为 " + battleStep.get("effect");
        cc.log(str);
        this._tipLabel.setString(str);

        var delay = this._normalAttack(battleStep);

        cc.log("set next round schedule");
        this.schedule(this._playAStep, delay, 1, 0);
    },

    _normalAttack: function (battleStep) {
        cc.log(battleStep);

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        this._battleNode[attacker].atk();

        battleStep.recover();
        while (battleStep.hasNextTarget()) {
            var target = battleStep.getTarget();
            var targetLocate = this._locate[target];

            this._battleNode[target].defend(battleStep.getEffect(), battleStep.isCrit());

            var cb = function (target, position) {
                return function () {
                    playEffect({
                        effectId: 10,
                        target: target,
                        loops: 1,
                        delay: 0.07,
                        zOrder: 10,
                        position: position
                    })
                };
            }(this, targetLocate);

            var ret = playEffect({
                effectId: 6,
                target: this,
                loops: 1,
                delay: 0.07,
                zOrder: 10,
                rotation: lz.getAngle(attackerLocate, targetLocate),
                anchorPoint:  cc.p(0.5, 0.8),
                position: attackerLocate,
                clear: true,
                cb: cb
            });

            var effectSprite = ret.sprite;
            var time = ret.time;

            var moveAction = cc.EaseSineIn.create(cc.MoveTo.create(time, targetLocate));

            effectSprite.runAction(moveAction);
        }

        return 2.0;
    }
});


BatterLayer.create = function (battleLog) {
    var ret = new BatterLayer();

    if (ret && ret.init(battleLog)) {
        return ret;
    }

    return null;
};