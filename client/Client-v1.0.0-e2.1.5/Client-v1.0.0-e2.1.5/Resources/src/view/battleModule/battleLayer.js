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
    _isEnd: false,
    _counter: 0,
    _battleLog: null,
    _battleNode: {},
    _spiritNode: [],
    _locate: {
        1: cc.p(160, 450),
        2: cc.p(360, 450),
        3: cc.p(560, 450),
        4: cc.p(160, 250),
        5: cc.p(360, 250),
        6: cc.p(560, 250),
        7: cc.p(160, 750),
        8: cc.p(360, 750),
        9: cc.p(560, 750),
        10: cc.p(160, 950),
        11: cc.p(360, 950),
        12: cc.p(560, 950)
    },

    init: function (battleLog) {
        cc.log("BatterLayer init");

        if (!this._super()) return false;

        this._isEnd = false;
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

        return true;
    },

    play: function () {
        cc.log("BatterLayer play");

        this._backItem.setVisible(true);

        this._battleLog.recover();
        this.nextStep();
    },

    end: function () {
        cc.log("BatterLayer end");

        this._isEnd = true;

        this._backItem.setVisible(false);

        this.stopAllActions();
        this.unscheduleAllCallbacks();

        BattlePlayer.getInstance().next();
    },

    _playAStep: function () {
        this.unschedule(this._playAStep);

        if (!this._battleLog.hasNextBattleStep()) {
            this.scheduleOnce(this._collectSpirit, 1.5);
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

        cc.log("set next round schedule");
        this.schedule(this._playAStep, delay, 1, 0);
    },

    callback: function () {

    },

    nextStepCallback: function () {
        cc.log("BattleLayer nextStep");

        this._counter += 1;

        var that = this;
        return function () {
            cc.log(this);

            that._counter -= 1;

            if (that._counter == 0) {
                cc.log("xxxxxxxxxxxx进入下回合");

                that.nextStep();
            }
        }
    },

    nextStep: function () {
        cc.log("BattleLayer nextStep");

        if (this._isEnd) {
            return;
        }

        if (!this._battleLog.hasNextBattleStep()) {
            this.scheduleOnce(this._collectSpirit, 1);
            return;
        }

        var battleStep = this._battleLog.getBattleStep();

        cc.log(battleStep);

        if (battleStep.isSkill()) {
            var skillType = this._battleNode[battleStep.get("attacker")].getSkillType();

            if (battleStep.isSpiritAtk()) {
                battleStep.set("attacker", this._battleLog.getSpirit(battleStep.get("attacker")));
            }

            if (skillType === 1) {
                this.aoeAtk(battleStep);
            } else if (skillType === 2) {
                this.aoeAtk(battleStep);
            } else if (skillType === 3) {
                this.aoeAtk(battleStep);
            } else if (skillType === 4) {
                this.aoeAtk(battleStep);
            } else {
                cc.log("技能类型出错");
                this.end();
            }
        } else {
            this.aoeAtk(battleStep);
        }

    },

    _getDirection: function (index) {
        if (index <= 6) {
            return 1;
        }

        return 2;
    },

    normalAtk: function (battleStep) {
        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        this._battleNode[attacker].runAnimations(
            "atk_1_" + this._getDirection(attacker),
            0,
            this.nextStepCallback()
        );

        this.callback = function () {
            battleStep.recover();
            while (battleStep.hasNextTarget()) {
                var target = battleStep.getTarget();
                var targetLocate = this._locate[target];

                this._battleNode[target].runAnimations(
                    "def_1_" + this._getDirection(target),
                    0,
                    this.nextStepCallback()
                );

//              this._battleNode[target].defend(battleStep.getEffect(), battleStep.isCrit());

                var effect1Node = cc.BuilderReader.load(main_scene_image.effect1, this);

                var that = this;
                var effect1Cb = (function (effect1Node, targetLocate) {
                    return function () {
                        var effect2Node = cc.BuilderReader.load(main_scene_image.effect1, this);

                        var effect2Cb = (function () {

                        })();

                        effect2Node.setPosition(targetLocate);
                        that.addChild(effect1Node);

                        effect1Node.animationManager.setCompletedAnimationCallback(this, cb);

                        effect1Node.removeFromParent();
                    };
                })(effect1Node, targetLocate);

                effect1Node.setPosition(attackerLocate);
                this.addChild(effect1Node);

                effect1Node.animationManager.setCompletedAnimationCallback(this, effect1Cb);
                effect1Node.setRotation(lz.getAngle(attackerLocate, targetLocate));
                effect1Node.runAction(
                    cc.EaseSineIn.create(
                        cc.MoveTo.create(0.5, targetLocate)
                    )
                );
            }
        };
    },

    singleAtk: function (battleStep) {
        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        cc.log(attacker);

        this._battleNode[attacker].runAnimations(
            "atk_2_" + this._getDirection(attacker),
            0,
            this.nextStepCallback()
        );

        this.callback = function () {
            battleStep.recover();
            while (battleStep.hasNextTarget()) {
                var target = battleStep.getTarget();
                var targetLocate = this._locate[target];
                var targetNode = this._battleNode[target];

                var effect3Node = cc.BuilderReader.load(main_scene_image.effect3, this);

                effect3Node.setPosition(targetLocate);
                this.addChild(effect3Node);

                var that = this;
                var effect3Cb = (function (effect3Node, targetNode) {
                    var nextStepCallback = that.nextStepCallback();

                    return function () {
                        effect3Node.removeFromParent();
                        targetNode.dead();
                        nextStepCallback();
                    }
                })(effect3Node, targetNode);

                effect3Node.animationManager.setCompletedAnimationCallback(this, effect3Cb);

                targetNode.runAnimations(
                    "def_2_" + this._getDirection(target),
                    0,
                    this.nextStepCallback()
                );

                targetNode.update(battleStep.getEffect(), battleStep.isCrit());
            }
        };
    },

    aoeAtk: function (battleStep) {
        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        cc.log("x--------");
        cc.log(attacker);
        cc.log("x--------");

        this._battleNode[attacker].runAnimations(
            "atk_3_" + this._getDirection(attacker),
            0,
            this.nextStepCallback()
        );


        battleStep.recover();
        this.callback = function () {
            while (battleStep.hasNextTarget()) {
                var that = this;

                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    cc.log("--------");
                    cc.log(target);
                    cc.log("--------");


                    var effect4Node = cc.BuilderReader.load(main_scene_image.effect4, that);
                    effect4Node.setPosition(targetLocate);
                    that.addChild(effect4Node);

                    var nextStepCallback1 = that.nextStepCallback();
                    effect4Node.animationManager.setCompletedAnimationCallback(that, function () {
                        effect4Node.removeFromParent();

                        var effect5Node = cc.BuilderReader.load(main_scene_image.effect5, that);
                        effect5Node.setPosition(targetLocate);
                        that.addChild(effect5Node);

                        var nextStepCallback2 = that.nextStepCallback();
                        effect5Node.animationManager.setCompletedAnimationCallback(that, function () {
                            effect5Node.removeFromParent();
                            targetNode.dead();
                            nextStepCallback2();
                        });

                        targetNode.runAnimations(
                            "def_3_" + that._getDirection(target),
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect, isCrit);

                        nextStepCallback1();
                    });

                    targetNode.runAnimations(
                        "def_2_" + that._getDirection(attacker),
                        0,
                        that.nextStepCallback()
                    );
                })();
            }
        };
    },

    heal: function (battleStep) {
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
                cc.ScaleTo.create(1, 1, 1)
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

        if (!len) {
            this.end();
        }

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