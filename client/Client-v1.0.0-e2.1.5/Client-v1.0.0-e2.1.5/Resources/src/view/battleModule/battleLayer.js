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
    _spiritNode: [],
    _locate: {
        1: cc.p(150, 450),
        2: cc.p(355, 450),
        3: cc.p(570, 450),
        4: cc.p(150, 250),
        5: cc.p(355, 250),
        6: cc.p(570, 250),
        7: cc.p(150, 750),
        8: cc.p(355, 750),
        9: cc.p(570, 750),
        10: cc.p(150, 950),
        11: cc.p(355, 950),
        12: cc.p(570, 950)
    },
    _rotation: {},

    init: function (battleLog) {
        cc.log("BatterLayer init");

        if (!this._super()) return false;

        this._battleLog = battleLog;
        this._spiritNode = [];

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

        var battleNode = battleLog.get("card");

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
            this.scheduleOnce(this._collectSpirit, 1.5)
            return;
        }

        cc.log("\n\n\nBattlePlayer _playAStep " + this._battleLog.getBattleStepIndex());

        var battleStep = this._battleLog.getBattleStep();
        var skillType = this._battleNode[battleStep.get("attacker")].getSkillType();
        var delay;

        if (battleStep.isSpiritAtk()) {
            battleStep.set("attacker", this._battleLog.getSpirit(battleStep.get("attacker")));
        }

        if (battleStep.isSkill()) {
            if (skillType === 2) {
                delay = this._aoe(battleStep);
            } else if (skillType === 3 || skillType === 4) {
                delay = this._heal(battleStep);
            } else {
                delay = this._aoe(battleStep);
            }
        } else {
            delay = this._normalAttack(battleStep);
        }

        var str = battleStep.get("attacker") + (battleStep.get("isSkill") ? " 用技能 揍了 " : " 用普攻 揍了 ");
        str += battleStep.get("target");
        str += " 伤害为 " + battleStep.get("effect");
        cc.log(str);
        this._tipLabel.setString(str);


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
                        effectId: 5,
                        target: target,
                        loops: 1,
                        delay: 0.07,
                        zOrder: 10,
                        position: position
                    })
                };
            }(this, targetLocate);

            var ret = playEffect({
                effectId: 4,
                target: this,
                loops: 1,
                delay: 0.07,
                zOrder: 10,
                rotation: lz.getAngle(attackerLocate, targetLocate),
                anchorPoint: cc.p(0.5, 0.8),
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
    },

    _aoe: function (battleStep) {
        cc.log(battleStep);

        var attacker = battleStep.get("attacker");

        this._battleNode[attacker].atk();

        battleStep.recover();
        while (battleStep.hasNextTarget()) {
            var target = battleStep.getTarget();
            var targetLocate = this._locate[target];

            this._battleNode[target].defend(battleStep.getEffect(), battleStep.isCrit());

            var cb = function (target, position) {
                return function () {
                    playEffect({
                        effectId: 8,
                        target: target,
                        loops: 1,
                        delay: 0.06,
                        zOrder: 10,
                        position: position
                    })
                };
            }(this, targetLocate);

            var ret = playEffect({
                effectId: 7,
                target: this,
                loops: 1,
                delay: 0.04,
                zOrder: 10,
                anchorPoint: cc.p(0.5, 0.2),
                position: cc.p(targetLocate.x, targetLocate.y + 120),
                clear: true,
                cb: cb
            });

            var effectSprite = ret.sprite;
            var time = ret.time;

            var moveAction = cc.EaseSineIn.create(cc.MoveTo.create(time, targetLocate));

            effectSprite.runAction(moveAction);
        }

        return 2.0;
    },

    _heal: function (battleStep) {
        var attacker = battleStep.get("attacker");

        this._battleNode[attacker].atk();

        battleStep.recover();
        while (battleStep.hasNextTarget()) {
            var target = battleStep.getTarget();
            var targetLocate = this._locate[target];

            this._battleNode[target].heal(battleStep.getEffect(), battleStep.isCrit());

            playEffect({
                effectId: 9,
                target: this,
                loops: 1,
                delay: 0.07,
                zOrder: 10,
                anchorPoint: cc.p(0.5, 0.4),
                position: targetLocate,
                clear: true
            });
        }

        return 2.0;
    },

    _addSpirit: function (index) {
        var spirit = cc.Sprite.create(main_scene_image.icon247);

        spirit.setOpacity(200);

        var point = this._locate[index];
        var offset = lz.random(-25, 25);
        var pointArray1 = [
            cc.p(point.x, point.y + 100),
            cc.p(point.x + lz.random(-80, 80), point.y + (100 - offset) / 2),
            cc.p(point.x + lz.random(-25, 25), point.y + offset)
        ];

        spirit.setPosition(pointArray1[0]);
        spirit.setScale(0);
        this.addChild(spirit, 1);
        this._spiritNode.push(spirit);

        var pointArray2 = [
            pointArray1[2],
            cc.p(point.x + lz.random(-25, 25), point.y + lz.random(-25, 25)),
            cc.p(point.x + lz.random(-25, 25), point.y + lz.random(-25, 25)),
            cc.p(point.x + lz.random(-25, 25), point.y + lz.random(-25, 25)),
            cc.p(point.x + lz.random(-25, 25), point.y + lz.random(-25, 25)),
            cc.p(point.x + lz.random(-25, 25), point.y + lz.random(-25, 25)),
            cc.p(point.x + lz.random(-25, 25), point.y + lz.random(-25, 25)),
            cc.p(point.x + lz.random(-25, 25), point.y + lz.random(-25, 25)),
            cc.p(point.x + lz.random(-25, 25), point.y + lz.random(-25, 25)),
            pointArray1[2]
        ];

        spirit.runAction(cc.Sequence.create(
            cc.Spawn.create(
                cc.CardinalSplineTo.create(2, pointArray1, 0),
                cc.ScaleTo.create(1, 0.8, 0.8)
            ),
            cc.CallFunc.create(function () {
                spirit.runAction(
                    cc.RepeatForever.create(
                        cc.CardinalSplineTo.create(20, pointArray2, 0)
                    )
                );
            }, this)
        ));
    },

    releaseSpirit: function (index, count) {
        cc.log("BatterLayer releaseSpirit");

        for (var i = 0; i < count; ++i) {
            this._addSpirit(index);
        }
    },

    _collectSpirit: function () {
        cc.log("BatterLayer collectSpirit");

        var len = this._spiritNode.length;


        if (this._battleLog.isWin()) {
            if (len) {
                var index = this._battleLog.getSpirit(1);

                for (var i = 0; i < len; ++i) {
                    var spirit = this._spiritNode[i];

                    spirit.stopAllActions();
                    var point1 = spirit.getPosition();
                    var point2 = this._locate[index];

                    var pointArray = [
                        point1,
                        cc.p(lz.random(50, 670), (point1.y + point2.y) / 2),
                        point2
                    ];

                    spirit.runAction(cc.Sequence.create(
                        cc.Spawn.create(
                            cc.CardinalSplineTo.create(2, pointArray, 0),
                            cc.Sequence.create(
                                cc.DelayTime.create(1.5),
                                cc.CallFunc.create(function () {
                                    this._battleNode[index].runAction(
                                        cc.Sequence.create(
                                            cc.ScaleTo.create(0.5, 1.4, 1.4),
                                            cc.ScaleTo.create(0.3, 1, 1)
                                        )
                                    );
                                }, this),
                                cc.ScaleTo.create(0.5, 0.3, 0.3)
                            )
                        ),
                        cc.Hide.create()
                    ));
                }

                this.scheduleOnce(function () {
                    this.end();
                }, 4);
            } else {
                this.end();
            }

        } else {
            if (len) {
                for (var i = 0; i < len; ++i) {
                    var spirit = this._spiritNode[i];

                    spirit.stopAllActions();

                    spirit.runAction(
                        cc.Spawn.create(
                            cc.ScaleTo.create(1, 5, 5),
                            cc.FadeOut.create(1)
                        )
                    );
                }

                this.scheduleOnce(function () {
                    this.end();
                }, 2);
            } else {
                this.end();
            }


        }
    }
});


BatterLayer.create = function (battleLog) {
    var ret = new BatterLayer();

    if (ret && ret.init(battleLog)) {
        return ret;
    }

    return null;
};