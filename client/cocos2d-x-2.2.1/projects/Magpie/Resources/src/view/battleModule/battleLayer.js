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


var SUBTITLE_Z_ORDER = 60;
var TIP_Z_ORDER = 50;
var EFFECT_Z_ORDER = 40;
var ATK_NODE_Z_ORDER = 30;
var SPIRIT_Z_ORDER = 20;
var NODE_Z_ORDER = 10;

var BatterLayer = cc.Layer.extend({
    _batterLayerFit: null,

    _index: 0,
    _isEnd: false,
    _counter: 0,
    _battleLog: null,
    _battleNode: null,
    _tipNode: null,
    _spiritNode: null,
    _locate: null,
    _lineUpMidpoint: null,
    _isPlayback: false,
    _backItem: null,
    _chooseSpeedItem: [],
    _menu: null,

    _playSpeed: 0,

    init: function (battleLog) {
        cc.log("BatterLayer init");

        if (!this._super()) return false;

        this._batterLayerFit = gameFit.battleScene.batterLayer;

        this._index = 1;
        this._isEnd = false;
        this._battleLog = battleLog;
        this._isPlayback = battleLog.get("isPlayback");
        this._spiritNode = [];
        this._locate = this._batterLayerFit.locatePoints;
        this._lineUpMidpoint = this._batterLayerFit.lineUpMidpoint;

        this._chooseSpeedItem = [];

        var bgSprite = cc.Sprite.create(main_scene_image.bg13, this._batterLayerFit.bgSpriteRect);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._batterLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var battleNode = this._battleLog.get("card");

        cc.log(battleNode);

        this._battleNode = {};
        this._tipNode = {};
        for (var key in battleNode) {
            if (battleNode[key] != undefined) {
                cc.log(battleNode[key]);

                var index = parseInt(key);
                var locate = this._locate[key];

                if (typeof(battleNode[key]) == "number") {
                    this._battleNode[key] = BattleSpiritNode.create(battleNode[key], index);
                    var spiritFrame = cc.Sprite.create(main_scene_image.spirit_frame);
                    spiritFrame.setPosition(locate);
                    this.addChild(spiritFrame);
                } else {
                    this._battleNode[key] = BattleCardNode.create(battleNode[key], index);
                }

                this._battleNode[key].setPosition(locate);
                this._battleNode[key].setVisible(false);
                this.addChild(this._battleNode[key], NODE_Z_ORDER);

                this._tipNode[key] = cc.BuilderReader.load(main_scene_image.tipNode, this);
                this._tipNode[key].setPosition(locate);
                this._tipNode[key].setVisible(false);
                this.addChild(this._tipNode[key], TIP_Z_ORDER);
            }
        }

        if (this._isPlayback) {
            this._backItem = cc.MenuItemImage.create(
                main_scene_image.button26,
                main_scene_image.button26s,
                this._onClickBack,
                this
            );
        } else {
            this._backItem = cc.MenuItemImage.create(
                main_scene_image.button12,
                main_scene_image.button12s,
                this._onClickBack,
                this
            );
        }
        this._backItem.setPosition(this._batterLayerFit.backItemPoint);

        this._menu = cc.Menu.create(this._backItem);
        this.addChild(this._menu);
        this._menu.setVisible(false);

        this._playSpeed = parseInt(sys.localStorage.getItem(gameData.player.get("uid") + "playSpeedTimes")) || 1;

        for (var speed = 1; speed <= 3; ++speed) {

            this._chooseSpeedItem[speed] = cc.MenuItemImage.create(
                main_scene_image["button" + (70 + speed)],
                main_scene_image["button" + (70 + speed) + "s"],
                this._onClickChangePlaySpeed,
                this
            );

            this._chooseSpeedItem[speed].setPosition(this._batterLayerFit.chooseSpeedItemPoint);
            this._chooseSpeedItem[speed].setVisible(speed == this._playSpeed);

            this._menu.addChild(this._chooseSpeedItem[speed]);

        }

        this._battleLog.recover();

        return true;
    },

    play: function () {
        cc.log("BatterLayer play");

        for (var key in this._battleNode) {
            if (this._battleNode[key] != undefined) {
                var index = parseInt(key);

                this._battleNode[key].setVisible(true);
                this._tipNode[key].setVisible(true);

                if (this._getDirection(index) === "o") {
                    this._battleNode[key].runAnimations("beg", 0, this.began());
                }
            }
        }

        this._menu.setVisible(true);
    },

    end: function () {
        cc.log("BatterLayer end");

        this._isEnd = true;

        this._menu.setVisible(false);

        this.stopAllActions();
        this.unscheduleAllCallbacks();

        BattlePlayer.getInstance().next();
    },

    tip: function (key, name, str) {
        cc.log("BatterLayer tip");

        var tipNode = this._tipNode[key];

        if (tipNode) {
            if (str) {
                tipNode.controller.ccbLabel.setString(str);
            }

            tipNode.animationManager.runAnimationsForSequenceNamedTweenDuration(name, 0);
        }
    },

    tipHarm: function (index, value, isSkill, isCirt) {
        cc.log("BatterLayer tipHarm");

        if (isCirt) {
            this.shock();
        }

        var name = "";
        var str = "";

        if (value === 0) {
            name = "miss";
        } else if (value > 0) {
            str = "+" + value;

            if (isCirt) {
                name = "heal_crit";
            } else {
                name = "heal";
            }
        } else {
            str = "" + value;

            if (isSkill) {
                name = "skill";
            } else {
                name = "atk"
            }

            if (isCirt) {
                name += "_crit";
            }
        }

        this.tip(index, name, str);
    },

    _getDirection: function (index, isOther) {
        if (isOther) {
            return (index < 7 ? "e" : "o");
        }

        return (index < 7 ? "o" : "e");
    },

    began: function () {
        this._counter += 1;

        var that = this;
        return function () {
            that._counter -= 1;

            if (that._counter == 0) {
                var battleEffect8Node = cc.BuilderReader.load(main_scene_image.battleEffect8, that);
                battleEffect8Node.setPosition(that._batterLayerFit.vsNodePoint);
                that.addChild(battleEffect8Node, EFFECT_Z_ORDER);

                battleEffect8Node.animationManager.setCompletedAnimationCallback(that, function () {
                    battleEffect8Node.removeFromParent();
                    that.showSpiritAddition();
                });
            }
        }
    },

    showSpiritAdditionCallback: function () {
        this._counter += 1;

        var that = this;
        return function () {
            that._counter -= 1;

            if (that._counter == 0) {
                that.showSpiritAddition();
            }
        }
    },

    showSpiritAddition: function () {
        cc.log("BattleLayer showSpiritAddition");

        if (this._isEnd) {
            return;
        }

        var that = this;
        while (this._index <= 12) {
            this._index += 1;

            var index = this._index - 1;
            if (this._battleNode[index] && (this._battleNode[index] instanceof BattleSpiritNode)) {
                (function () {
                    var battleEffect1Node = cc.BuilderReader.load(main_scene_image.battleEffect1, that);
                    battleEffect1Node.setPosition(that._locate[index]);
                    that.addChild(battleEffect1Node, EFFECT_Z_ORDER);

                    var showSpiritAdditionCallback = that.showSpiritAdditionCallback();
                    battleEffect1Node.animationManager.setCompletedAnimationCallback(that, function () {
                        battleEffect1Node.removeFromParent();
                        showSpiritAdditionCallback();
                    });

                    that._battleNode[index].runAnimations(
                        "buf",
                        0,
                        that.showSpiritAdditionCallback()
                    );
                })();

                return;
            }
        }

        this.nextStep();
    },

    ccbFnShowAddition: function (startIndex) {
        cc.log("BattleLayer showOwnAddition");

        var that = this;
        var endIndex = startIndex + 6;

        for (var i = startIndex; i < endIndex; ++i) {
            if (this._battleNode[i] && (this._battleNode[i] instanceof BattleCardNode)) {
                (function () {
                    var index = i;
                    var cardNode = that._battleNode[i];
                    var locate = that._locate[i];

                    var battleEffect2Node = cc.BuilderReader.load(main_scene_image.battleEffect2, that);
                    battleEffect2Node.setPosition(locate);
                    that.addChild(battleEffect2Node, EFFECT_Z_ORDER);

                    var showSpiritAdditionCallback1 = that.showSpiritAdditionCallback();
                    battleEffect2Node.animationManager.setCompletedAnimationCallback(that, function () {
                        battleEffect2Node.removeFromParent();

                        var battleEffect3Node = cc.BuilderReader.load(main_scene_image.battleEffect3, that);
                        battleEffect3Node.setPosition(locate);
                        that.addChild(battleEffect3Node, EFFECT_Z_ORDER);

                        var showSpiritAdditionCallback2 = that.showSpiritAdditionCallback();
                        battleEffect3Node.animationManager.setCompletedAnimationCallback(that, function () {
                            battleEffect3Node.removeFromParent();
                            showSpiritAdditionCallback2();
                        });

                        that.tip(index, "buf_2", "+" + cardNode.getSpiritAtk());

                        showSpiritAdditionCallback1();
                    });

                    var spiritHp = cardNode.getSpiritHp();
                    cardNode.update(spiritHp);
                    that.tip(index, "buf_1", "+" + spiritHp);
                })();
            }
        }
    },

    setBattleNodeZOrder: function (z, index) {
        if (index != undefined) {
            this._battleNode[index].setZOrder(z);
        } else {
            for (var key in this._battleNode) {
                this._battleNode[key].setZOrder(z);
            }
        }
    },

    ccbFnCallback: function () {
    },

    nextStepCallback: function () {
        this._counter += 1;

        var that = this;
        return function () {
            that._counter -= 1;

            if (that._counter == 0) {
                that.nextStep();
            }
        }
    },

    nextStep: function () {
        cc.log("BattleLayer nextStep");

        this.ccbFnCallback = function () {
        };

        this.setBattleNodeZOrder(NODE_Z_ORDER);

        for (var key in this._battleNode) {
            if (this._battleNode[key].die) {
                this._battleNode[key].die();
            }
        }

        if (this._isEnd) {
            return;
        }

        if (!this._battleLog.hasNextBattleStep()) {
            this.scheduleOnce(this._collectSpirit, 1.3);
            return;
        }

        this.step(this._battleLog.getBattleStep());
    },

    step: function (battleStep) {
        cc.log("BattleLayer attack");
        cc.log(battleStep);

        var attacker = battleStep.get("attacker");
        var fn = "";

        if (battleStep.isSkill()) {
            fn = this._battleNode[attacker].getSkillFn();

            cc.log(fn);

            if (battleStep.isSpiritAtk()) {
                attacker = this._battleLog.getSpirit(battleStep.get("attacker"));
                battleStep.set("attacker", attacker);
            }

            var ccbNode = this._battleNode[attacker].getSubtitleNode();
            var that = this;

            var cb = function () {
                if (ccbNode) {
                    ccbNode.removeFromParent();
                }

                that.setBattleNodeZOrder(ATK_NODE_Z_ORDER, attacker);

                if (that[fn]) {
                    that[fn](battleStep);
                } else {
                    that.skill1(battleStep);
                }
            };

            var addSubtitleNodeCb = function () {
                ccbNode.setPosition(that._batterLayerFit[that._getDirection(attacker) + "SubtitleNode"]);
                that.addChild(ccbNode, SUBTITLE_Z_ORDER);

                ccbNode.animationManager.setCompletedAnimationCallback(that, cb);
            };

            if (ccbNode) {
                this._battleNode[attacker].runAnimations(
                    "rea",
                    0,
                    addSubtitleNodeCb
                );

                var battleEffect9Node = cc.BuilderReader.load(main_scene_image.battleEffect9, that);
                battleEffect9Node.setPosition(this._locate[attacker]);
                this.addChild(battleEffect9Node, EFFECT_Z_ORDER);

                battleEffect9Node.animationManager.setCompletedAnimationCallback(this, function () {
                    battleEffect9Node.removeFromParent();
                });
            } else {
                cb();
            }
        } else {
            fn = this._battleNode[attacker].getNormalAtkFn();

            this.setBattleNodeZOrder(ATK_NODE_Z_ORDER, attacker);

            if (this[fn]) {
                this[fn](battleStep);
            } else {
                this.skill1(battleStep);
            }
        }
    },

    shock: function () {
        cc.log("BattleLayer shock");

        var a0 = cc.RotateTo.create(0.03, 2);
        var a1 = cc.RotateTo.create(0.06, -2);
        var a2 = cc.RotateTo.create(0.06, 2);
        var a3 = cc.RotateTo.create(0.06, -2);
        var a4 = cc.RotateTo.create(0.06, 1.5);
        var a5 = cc.RotateTo.create(0.06, -1.5);
        var a6 = cc.RotateTo.create(0.06, 1);
        var a7 = cc.RotateTo.create(0.06, -1);
        var a8 = cc.RotateTo.create(0.06, 0);

        this.runAction(
            cc.Sequence.create(
                a0, a1, a2, a3, a4, a5, a6, a7, a8
            )
        );
    },

    skill1: function (battleStep) {
        cc.log("skill1");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.ccbFnCallback = function () {
            var that = this;

            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect1_1 = cc.BuilderReader.load(main_scene_image.effect1_1, that);
                    effect1_1.setPosition(attackerLocate);
                    that.addChild(effect1_1, EFFECT_Z_ORDER);

                    var effect1NodeAnimationManager = effect1_1.animationManager;
                    var nextStepCallback1 = that.nextStepCallback();
                    effect1NodeAnimationManager.setCompletedAnimationCallback(that, function () {
                        effect1_1.removeFromParent();

                        var effect1_2 = cc.BuilderReader.load(main_scene_image.effect1_2, that);
                        effect1_2.setPosition(targetLocate);
                        that.addChild(effect1_2, EFFECT_Z_ORDER);

                        var nextStepCallback2 = that.nextStepCallback();
                        effect1_2.animationManager.setCompletedAnimationCallback(that, function () {
                            effect1_2.removeFromParent();
                            nextStepCallback2();
                        });

                        targetNode.runAnimations(
                            effect ? ("d_1_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, false, isCrit);

                        nextStepCallback1();
                    });

                    effect1_1.runAction(
                        cc.EaseSineIn.create(
                            cc.MoveTo.create(
                                effect1NodeAnimationManager.getSequenceDuration(
                                    effect1NodeAnimationManager.getRunningSequenceName()
                                ),
                                targetLocate
                            )
                        )
                    );
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_1",
            0,
            this.nextStepCallback()
        );
    },

    skill2: function (battleStep) {
        cc.log("skill2");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.ccbFnCallback = function () {
            var that = this;

            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect2_1 = cc.BuilderReader.load(main_scene_image.effect2_1, that);
                    effect2_1.setPosition(attackerLocate);
                    that.addChild(effect2_1, EFFECT_Z_ORDER);

                    var effect1NodeAnimationManager = effect2_1.animationManager;
                    var nextStepCallback1 = that.nextStepCallback();
                    effect1NodeAnimationManager.setCompletedAnimationCallback(that, function () {
                        effect2_1.removeFromParent();

                        var effect2_2 = cc.BuilderReader.load(main_scene_image.effect2_2, that);
                        effect2_2.setPosition(targetLocate);
                        that.addChild(effect2_2, EFFECT_Z_ORDER);

                        var nextStepCallback2 = that.nextStepCallback();
                        effect2_2.animationManager.setCompletedAnimationCallback(that, function () {
                            effect2_2.removeFromParent();
                            nextStepCallback2();
                        });

                        targetNode.runAnimations(
                            effect ? ("d_1_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, false, isCrit);

                        nextStepCallback1();
                    });

                    effect2_1.runAction(
                        cc.EaseSineIn.create(
                            cc.MoveTo.create(
                                effect1NodeAnimationManager.getSequenceDuration(
                                    effect1NodeAnimationManager.getRunningSequenceName()
                                ),
                                targetLocate
                            )
                        )
                    );
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_1",
            0,
            this.nextStepCallback()
        );
    },

    skill3: function (battleStep) {
        cc.log("skill3");

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];

        battleStep.recover();

        if (battleStep.hasNextTarget()) {
            var target = battleStep.getTarget();
            var targetLocate = this._locate[target];
            var targetNode = this._battleNode[target];
            var effect = battleStep.getEffect();
            var isCrit = battleStep.isCrit();
        }

        var that = this;

        this.ccbFnCallback = function () {
            var effect3 = cc.BuilderReader.load(main_scene_image.effect3, that);
            effect3.setPosition(targetLocate);
            that.addChild(effect3, EFFECT_Z_ORDER);

            var nextStepCallback = that.nextStepCallback();
            effect3.animationManager.setCompletedAnimationCallback(that, function () {
                effect3.removeFromParent();
                nextStepCallback();
            });

            targetNode.runAnimations(
                effect ? ("d_1_" + that._getDirection(target)) : "miss",
                0,
                that.nextStepCallback()
            );

            targetNode.update(effect);
            that.tipHarm(target, effect, false, isCrit);
        };

        var nextStepCallback1 = this.nextStepCallback();
        var nextStepCallback2 = this.nextStepCallback();
        var nextStepCallback3 = this.nextStepCallback();

        var fn3 = function () {
            var time = attackerNode.runAnimations(
                "a_5_3",
                0,
                nextStepCallback3
            );

            attackerNode.runAction(
                cc.MoveTo.create(time, attackerLocate)
            );

            nextStepCallback2();
        };

        var fn2 = function () {
            attackerNode.runAnimations(
                "a_5_2",
                0,
                fn3
            );

            nextStepCallback1();
        };

        var fn1 = function () {
            var time = attackerNode.runAnimations(
                "a_5_1",
                0,
                fn2
            );

            attackerNode.runAction(
                cc.MoveTo.create(
                    time,
                    cc.p(targetLocate.x, targetLocate.y + (that._getDirection(attacker) == "o" ? -79 : 79))
                )
            );
        };

        fn1();
    },

    skill4: function (battleStep) {
        cc.log("skill4");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.ccbFnCallback = function () {
            var that = this;

            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect4_1 = cc.BuilderReader.load(main_scene_image.effect4_1, that);
                    effect4_1.setPosition(attackerLocate);
                    that.addChild(effect4_1, EFFECT_Z_ORDER);

                    var effectNodeAnimationManager = effect4_1.animationManager;
                    var nextStepCallback1 = that.nextStepCallback();
                    effectNodeAnimationManager.setCompletedAnimationCallback(that, function () {
                        effect4_1.removeFromParent();

                        var effect4_2 = cc.BuilderReader.load(main_scene_image.effect4_2, that);
                        effect4_2.setPosition(targetLocate);
                        that.addChild(effect4_2, EFFECT_Z_ORDER);

                        var nextStepCallback2 = that.nextStepCallback();
                        effect4_2.animationManager.setCompletedAnimationCallback(that, function () {
                            effect4_2.removeFromParent();
                            nextStepCallback2();
                        });

                        targetNode.runAnimations(
                            effect ? ("d_1_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, false, isCrit);

                        nextStepCallback1();
                    });

                    effect4_1.runAction(
                        cc.EaseSineIn.create(
                            cc.MoveTo.create(
                                effectNodeAnimationManager.getSequenceDuration(
                                    effectNodeAnimationManager.getRunningSequenceName()
                                ),
                                targetLocate
                            )
                        )
                    );
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_1",
            0,
            this.nextStepCallback()
        );
    },

    skill5: function (battleStep) {
        cc.log("skill5");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.ccbFnCallback = function () {
            var that = this;

            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect5_1 = cc.BuilderReader.load(main_scene_image.effect5_1, that);
                    effect5_1.setPosition(attackerLocate);
                    that.addChild(effect5_1, EFFECT_Z_ORDER);

                    var effectNodeAnimationManager = effect5_1.animationManager;
                    var nextStepCallback1 = that.nextStepCallback();
                    effectNodeAnimationManager.setCompletedAnimationCallback(that, function () {
                        effect5_1.removeFromParent();

                        var effect5_2 = cc.BuilderReader.load(main_scene_image.effect5_2, that);
                        effect5_2.setPosition(targetLocate);
                        that.addChild(effect5_2, EFFECT_Z_ORDER);

                        var nextStepCallback2 = that.nextStepCallback();
                        effect5_2.animationManager.setCompletedAnimationCallback(that, function () {
                            effect5_2.removeFromParent();
                            nextStepCallback2();
                        });

                        targetNode.runAnimations(
                            effect ? ("d_1_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, false, isCrit);

                        nextStepCallback1();
                    });

                    effect5_1.runAction(
                        cc.EaseSineIn.create(
                            cc.MoveTo.create(
                                effectNodeAnimationManager.getSequenceDuration(
                                    effectNodeAnimationManager.getRunningSequenceName()
                                ),
                                targetLocate
                            )
                        )
                    );
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_1",
            0,
            this.nextStepCallback()
        );
    },

    skill6: function (battleStep) {
        cc.log("skill6");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.ccbFnCallback = function () {
            var that = this;

            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect6_1 = cc.BuilderReader.load(main_scene_image.effect6_1, that);
                    effect6_1.setPosition(attackerLocate);
                    that.addChild(effect6_1, EFFECT_Z_ORDER);

                    var effectNodeAnimationManager = effect6_1.animationManager;
                    var nextStepCallback1 = that.nextStepCallback();
                    effectNodeAnimationManager.setCompletedAnimationCallback(that, function () {
                        effect6_1.removeFromParent();

                        var effect6_2 = cc.BuilderReader.load(main_scene_image.effect6_2, that);
                        effect6_2.setPosition(targetLocate);
                        that.addChild(effect6_2, EFFECT_Z_ORDER);

                        var nextStepCallback2 = that.nextStepCallback();
                        effect6_2.animationManager.setCompletedAnimationCallback(that, function () {
                            effect6_2.removeFromParent();
                            nextStepCallback2();
                        });

                        targetNode.runAnimations(
                            effect ? ("d_1_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, false, isCrit);

                        nextStepCallback1();
                    });

                    effect6_1.runAction(
                        cc.EaseSineIn.create(
                            cc.MoveTo.create(
                                effectNodeAnimationManager.getSequenceDuration(
                                    effectNodeAnimationManager.getRunningSequenceName()
                                ),
                                targetLocate
                            )
                        )
                    );
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_1",
            0,
            this.nextStepCallback()
        );
    },

    skill7: function (battleStep) {
        cc.log("skill7");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.ccbFnCallback = function () {
            var that = this;

            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect7_1 = cc.BuilderReader.load(main_scene_image.effect7_1, that);
                    effect7_1.setPosition(attackerLocate);
                    that.addChild(effect7_1, EFFECT_Z_ORDER);

                    var effectNodeAnimationManager = effect7_1.animationManager;
                    var nextStepCallback1 = that.nextStepCallback();
                    effectNodeAnimationManager.setCompletedAnimationCallback(that, function () {
                        effect7_1.removeFromParent();

                        var effect7_2 = cc.BuilderReader.load(main_scene_image.effect7_2, that);
                        effect7_2.setPosition(targetLocate);
                        that.addChild(effect7_2, EFFECT_Z_ORDER);

                        var nextStepCallback2 = that.nextStepCallback();
                        effect7_2.animationManager.setCompletedAnimationCallback(that, function () {
                            effect7_2.removeFromParent();
                            nextStepCallback2();
                        });

                        targetNode.runAnimations(
                            effect ? ("d_1_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, false, isCrit);

                        nextStepCallback1();
                    });

                    effect7_1.runAction(
                        cc.EaseSineIn.create(
                            cc.MoveTo.create(
                                effectNodeAnimationManager.getSequenceDuration(
                                    effectNodeAnimationManager.getRunningSequenceName()
                                ),
                                targetLocate
                            )
                        )
                    );
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_1",
            0,
            this.nextStepCallback()
        );
    },

    skill8: function (battleStep) {
        cc.log("skill8");

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];

        battleStep.recover();

        if (battleStep.hasNextTarget()) {
            var target = battleStep.getTarget();
            var targetLocate = this._locate[target];
            var targetNode = this._battleNode[target];
            var effect = battleStep.getEffect();
            var isCrit = battleStep.isCrit();
        }

        var that = this;

        this.ccbFnCallback = function () {
            var effect8 = cc.BuilderReader.load(main_scene_image.effect8, that);
            effect8.setPosition(targetLocate);
            that.addChild(effect8, EFFECT_Z_ORDER);

            var nextStepCallback = that.nextStepCallback();
            effect8.animationManager.setCompletedAnimationCallback(that, function () {
                effect8.removeFromParent();
                nextStepCallback();
            });

            targetNode.runAnimations(
                effect ? ("d_1_" + that._getDirection(target)) : "miss",
                0,
                that.nextStepCallback()
            );

            targetNode.update(effect);
            that.tipHarm(target, effect, false, isCrit);
        };

        var nextStepCallback1 = this.nextStepCallback();
        var nextStepCallback2 = this.nextStepCallback();
        var nextStepCallback3 = this.nextStepCallback();

        var fn3 = function () {
            var time = attackerNode.runAnimations(
                "a_5_3",
                0,
                nextStepCallback3
            );

            attackerNode.runAction(
                cc.MoveTo.create(time, attackerLocate)
            );

            nextStepCallback2();
        };

        var fn2 = function () {
            attackerNode.runAnimations(
                "a_5_2",
                0,
                fn3
            );

            nextStepCallback1();
        };

        var fn1 = function () {
            var time = attackerNode.runAnimations(
                "a_5_1",
                0,
                fn2
            );

            attackerNode.runAction(
                cc.MoveTo.create(
                    time,
                    cc.p(targetLocate.x, targetLocate.y + (that._getDirection(attacker) == "o" ? -79 : 79))
                )
            );
        };

        fn1();
    },

    skill9: function (battleStep) {
        cc.log("skill9");

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];

        battleStep.recover();

        if (battleStep.hasNextTarget()) {
            var target = battleStep.getTarget();
            var targetLocate = this._locate[target];
            var targetNode = this._battleNode[target];
            var effect = battleStep.getEffect();
            var isCrit = battleStep.isCrit();
        }

        var that = this;

        this.ccbFnCallback = function () {
            var effect9 = cc.BuilderReader.load(main_scene_image.effect9, that);
            effect9.setPosition(targetLocate);
            that.addChild(effect9, EFFECT_Z_ORDER);

            var nextStepCallback = that.nextStepCallback();
            effect9.animationManager.setCompletedAnimationCallback(that, function () {
                effect9.removeFromParent();
                nextStepCallback();
            });

            targetNode.runAnimations(
                effect ? ("d_1_" + that._getDirection(target)) : "miss",
                0,
                that.nextStepCallback()
            );

            targetNode.update(effect);
            that.tipHarm(target, effect, false, isCrit);
        };

        var nextStepCallback1 = this.nextStepCallback();
        var nextStepCallback2 = this.nextStepCallback();
        var nextStepCallback3 = this.nextStepCallback();

        var fn3 = function () {
            var time = attackerNode.runAnimations(
                "a_5_3",
                0,
                nextStepCallback3
            );

            attackerNode.runAction(
                cc.MoveTo.create(time, attackerLocate)
            );

            nextStepCallback2();
        };

        var fn2 = function () {
            attackerNode.runAnimations(
                "a_5_2",
                0,
                fn3
            );

            nextStepCallback1();
        };

        var fn1 = function () {
            var time = attackerNode.runAnimations(
                "a_5_1",
                0,
                fn2
            );

            attackerNode.runAction(
                cc.MoveTo.create(
                    time,
                    cc.p(targetLocate.x, targetLocate.y + (that._getDirection(attacker) == "o" ? -79 : 79))
                )
            );
        };

        fn1();
    },

    skill300: function (battleStep) {
        cc.log("skill300");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.ccbFnCallback = function () {
            var that = this;

            var effect300_1 = cc.BuilderReader.load(main_scene_image.effect300_1, this);
            effect300_1.setPosition(attackerLocate);
            this.addChild(effect300_1, EFFECT_Z_ORDER);

            var nextStepCallback = this.nextStepCallback();
            effect300_1.animationManager.setCompletedAnimationCallback(this, function () {
                effect300_1.removeFromParent();
                nextStepCallback();
            });

            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect300_2 = cc.BuilderReader.load(main_scene_image.effect300_2, that);
                    effect300_2.setPosition(targetLocate);
                    that.addChild(effect300_2, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect300_2.animationManager.setCompletedAnimationCallback(that, function () {
                        effect300_2.removeFromParent();
                        nextStepCallback();
                    });

                    targetNode.runAnimations(
                        (effect ? "d_3" : "miss"),
                        0,
                        that.nextStepCallback()
                    );

                    targetNode.update(effect);
                    that.tipHarm(target, effect, true, isCrit);
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_4",
            0,
            this.nextStepCallback()
        );
    },

    skill301: function (battleStep) {
        cc.log("skill301");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.ccbFnCallback = function () {
            var that = this;

            var effect301_1 = cc.BuilderReader.load(main_scene_image.effect301_1, this);
            effect301_1.setPosition(attackerLocate);
            this.addChild(effect301_1, EFFECT_Z_ORDER);

            var nextStepCallback = this.nextStepCallback();
            effect301_1.animationManager.setCompletedAnimationCallback(this, function () {
                effect301_1.removeFromParent();
                nextStepCallback();
            });

            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect301_2 = cc.BuilderReader.load(main_scene_image.effect301_2, that);
                    effect301_2.setPosition(targetLocate);
                    that.addChild(effect301_2, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect301_2.animationManager.setCompletedAnimationCallback(that, function () {
                        effect301_2.removeFromParent();
                        nextStepCallback();
                    });

                    targetNode.runAnimations(
                        (effect ? "d_3" : "miss"),
                        0,
                        that.nextStepCallback()
                    );

                    targetNode.update(effect);
                    that.tipHarm(target, effect, true, isCrit);
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_4",
            0,
            this.nextStepCallback()
        );
    },

    skill302: function (battleStep) {
        cc.log("skill302");

        var lineUpMidpoint = this._lineUpMidpoint;
        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.ccbFnCallback = function () {
            var that = this;

            var effect302_1 = cc.BuilderReader.load(main_scene_image.effect302_1, this);
            effect302_1.setPosition(attackerLocate);
            this.addChild(effect302_1, EFFECT_Z_ORDER);

            var nextStepCallback1 = this.nextStepCallback();
            effect302_1.animationManager.setCompletedAnimationCallback(this, function () {
                effect302_1.removeFromParent();
                nextStepCallback1();
            });

            var effect302_3 = cc.BuilderReader.load(main_scene_image.effect302_3, this);
            effect302_3.setPosition(lineUpMidpoint[that._getDirection(attacker)]);
            this.addChild(effect302_3, EFFECT_Z_ORDER);

            var nextStepCallback2 = this.nextStepCallback();
            effect302_3.animationManager.setCompletedAnimationCallback(this, function () {
                effect302_3.removeFromParent();
                nextStepCallback2();
            });

            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect302_2 = cc.BuilderReader.load(main_scene_image.effect302_2, that);
                    effect302_2.setPosition(targetLocate);
                    that.addChild(effect302_2, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect302_2.animationManager.setCompletedAnimationCallback(that, function () {
                        effect302_2.removeFromParent();
                        nextStepCallback();
                    });

                    targetNode.runAnimations(
                        (effect ? "d_3" : "miss"),
                        0,
                        that.nextStepCallback()
                    );

                    targetNode.update(effect);
                    that.tipHarm(target, effect, true, isCrit);
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_4",
            0,
            this.nextStepCallback()
        );
    },

    skill400: function (battleStep) {
        cc.log("skill400");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        this.ccbFnCallback = function () {
            var that = this;

            var isFirst = true;
            that.ccbFnCallback = function () {
                if (!isFirst) {
                    return;
                }

                isFirst = false;

                battleStep.recover();
                while (battleStep.hasNextTarget()) {
                    (function () {
                        var target = battleStep.getTarget();
                        var targetLocate = that._locate[target];
                        var targetNode = that._battleNode[target];
                        var effect = battleStep.getEffect();
                        var isCrit = battleStep.isCrit();

                        targetNode.runAnimations(
                            effect ? ("d_2_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, true, isCrit);
                    })();
                }
            };

            var effect400_1 = cc.BuilderReader.load(main_scene_image.effect400_1, that);
            effect400_1.setPosition(attackerLocate);
            that.addChild(effect400_1, EFFECT_Z_ORDER);

            var nextStepCallback = that.nextStepCallback();
            effect400_1.animationManager.setCompletedAnimationCallback(that, function () {
                effect400_1.removeFromParent();
                nextStepCallback();
            });

            battleStep.recover();
            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect400_2 = cc.BuilderReader.load(main_scene_image.effect400_2, that);
                    effect400_2.setPosition(targetLocate);
                    that.addChild(effect400_2, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect400_2.animationManager.setCompletedAnimationCallback(that, function () {
                        effect400_2.removeFromParent();
                        nextStepCallback();
                    });
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_3",
            0,
            this.nextStepCallback()
        );
    },

    skill401: function (battleStep) {
        cc.log("skill401");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();

        var that = this;
        var fn = null;
        var point = attackerLocate;

        this.ccbFnCallback = function () {
            if (fn) {
                fn();

                fn = null;
            }

            if (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect401_1 = cc.BuilderReader.load(main_scene_image.effect401_1, that);
                    effect401_1.setPosition(point);
                    that.addChild(effect401_1, EFFECT_Z_ORDER);

                    var nextStepCallback1 = that.nextStepCallback();
                    effect401_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect401_1.removeFromParent();
                        nextStepCallback1();
                    });

                    var k = lz.getDistance(point, targetLocate) / 960;
                    effect401_1.setScaleX(k);
                    effect401_1.setScaleY(k);
                    effect401_1.setRotation(lz.getAngle(point, targetLocate));

                    fn = function () {
                        var effect401_2 = cc.BuilderReader.load(main_scene_image.effect401_2, that);
                        effect401_2.setPosition(targetLocate);
                        that.addChild(effect401_2, EFFECT_Z_ORDER);

                        var nextStepCallback2 = that.nextStepCallback();
                        effect401_2.animationManager.setCompletedAnimationCallback(that, function () {
                            effect401_2.removeFromParent();
                            nextStepCallback2();
                        });

                        targetNode.runAnimations(
                            effect ? ("d_2_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, false, isCrit);
                    };

                    point = targetLocate;
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_6",
            0,
            this.nextStepCallback()
        );
    },

    skill402: function (battleStep) {
        cc.log("skill402");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.ccbFnCallback = function () {
            var that = this;

            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect402 = cc.BuilderReader.load(main_scene_image.effect402, that);
                    effect402.setPosition(targetLocate);
                    that.addChild(effect402, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect402.animationManager.setCompletedAnimationCallback(that, function () {
                        effect402.removeFromParent();
                        nextStepCallback();
                    });

                    targetNode.runAnimations(
                        effect ? ("d_2_" + that._getDirection(target)) : "miss",
                        0,
                        that.nextStepCallback()
                    );

                    targetNode.update(effect);
                    that.tipHarm(target, effect, true, isCrit);
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_3",
            0,
            this.nextStepCallback()
        );
    },

    skill403: function (battleStep) {
        cc.log("skill403");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.ccbFnCallback = function () {
            var that = this;

            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect403 = cc.BuilderReader.load(main_scene_image.effect403, that);
                    effect403.setPosition(targetLocate);
                    that.addChild(effect403, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect403.animationManager.setCompletedAnimationCallback(that, function () {
                        effect403.removeFromParent();
                        nextStepCallback();
                    });

                    targetNode.runAnimations(
                        effect ? ("d_2_" + that._getDirection(target)) : "miss",
                        0,
                        that.nextStepCallback()
                    );

                    targetNode.update(effect);
                    that.tipHarm(target, effect, true, isCrit);
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_6",
            0,
            this.nextStepCallback()
        );
    },

    skill404: function (battleStep) {
        cc.log("skill404");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];
        var attackerNode = this._battleNode[attacker];

        battleStep.recover();

        var that = this;

        this.ccbFnCallback = function () {
            that.ccbFnCallback = function () {
                battleStep.recover();
                while (battleStep.hasNextTarget()) {
                    (function () {
                        var target = battleStep.getTarget();
                        var targetLocate = that._locate[target];
                        var targetNode = that._battleNode[target];
                        var effect = battleStep.getEffect();
                        var isCrit = battleStep.isCrit();

                        var effect404_2 = cc.BuilderReader.load(main_scene_image.effect404_2, that);
                        effect404_2.setPosition(targetLocate);
                        that.addChild(effect404_2, EFFECT_Z_ORDER - 1);

                        var nextStepCallback = that.nextStepCallback();
                        effect404_2.animationManager.setCompletedAnimationCallback(that, function () {
                            effect404_2.removeFromParent();
                            nextStepCallback();
                        });

                        targetNode.runAnimations(
                            effect ? ("d_2_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, true, isCrit);
                    })();
                }
            };

            var effect404_1 = cc.BuilderReader.load(main_scene_image.effect404_1, this);
            effect404_1.setPosition(that.battleMidpoint);
            this.addChild(effect404_1, EFFECT_Z_ORDER);

            var nextStepCallback = this.nextStepCallback();
            effect404_1.animationManager.setCompletedAnimationCallback(this, function () {
                effect404_1.removeFromParent();
                nextStepCallback();
            });
        };

        var nextStepCallback1 = this.nextStepCallback();
        var nextStepCallback2 = this.nextStepCallback();
        var nextStepCallback3 = this.nextStepCallback();

        var fn3 = function () {
            var time = attackerNode.runAnimations(
                "a_7_3",
                0,
                nextStepCallback3
            );

            attackerNode.runAction(
                cc.MoveTo.create(time, attackerLocate)
            );

            nextStepCallback2();
        };

        var fn2 = function () {
            attackerNode.runAnimations(
                "a_7_2",
                0,
                fn3
            );

            nextStepCallback1();
        };

        var fn1 = function () {
            var time = attackerNode.runAnimations(
                "a_7_1",
                0,
                fn2
            );

            attackerNode.runAction(
                cc.MoveTo.create(time, that.battleMidpoint)
            );
        };

        fn1();
    },

    skill405: function (battleStep) {
        cc.log("skill405");

        var lineUpMidpoint = this._lineUpMidpoint;
        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];
        var attackerNode = this._battleNode[attacker];

        battleStep.recover();

        var that = this;

        this.ccbFnCallback = function () {
            that.ccbFnCallback = function () {
                battleStep.recover();
                while (battleStep.hasNextTarget()) {
                    (function () {
                        var target = battleStep.getTarget();
                        var targetLocate = that._locate[target];
                        var targetNode = that._battleNode[target];
                        var effect = battleStep.getEffect();
                        var isCrit = battleStep.isCrit();

                        var effect405_3 = cc.BuilderReader.load(main_scene_image.effect405_3, that);
                        effect405_3.setPosition(targetLocate);
                        that.addChild(effect405_3, EFFECT_Z_ORDER - 1);

                        var nextStepCallback = that.nextStepCallback();
                        effect405_3.animationManager.setCompletedAnimationCallback(that, function () {
                            effect405_3.removeFromParent();
                            nextStepCallback();
                        });

                        targetNode.runAnimations(
                            effect ? ("d_2_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, true, isCrit);
                    })();
                }
            };

            var effect405_1 = cc.BuilderReader.load(main_scene_image.effect405_1, this);
            effect405_1.setPosition(that.battleMidpoint);
            this.addChild(effect405_1, EFFECT_Z_ORDER);

            var nextStepCallback1 = this.nextStepCallback();
            effect405_1.animationManager.setCompletedAnimationCallback(this, function () {
                effect405_1.removeFromParent();
                nextStepCallback1();
            });

            var effect405_2 = cc.BuilderReader.load(main_scene_image.effect405_2, this);
            effect405_2.setPosition(lineUpMidpoint[that._getDirection(attacker, true)]);
            this.addChild(effect405_2, EFFECT_Z_ORDER);

            var nextStepCallback2 = this.nextStepCallback();
            effect405_2.animationManager.setCompletedAnimationCallback(this, function () {
                effect405_2.removeFromParent();
                nextStepCallback2();
            });
        };

        var nextStepCallback1 = this.nextStepCallback();
        var nextStepCallback2 = this.nextStepCallback();
        var nextStepCallback3 = this.nextStepCallback();

        var fn3 = function () {
            var time = attackerNode.runAnimations(
                "a_7_3",
                0,
                nextStepCallback3
            );

            attackerNode.runAction(
                cc.MoveTo.create(time, attackerLocate)
            );

            nextStepCallback2();
        };

        var fn2 = function () {
            attackerNode.runAnimations(
                "a_7_2",
                0,
                fn3
            );

            nextStepCallback1();
        };

        var fn1 = function () {
            var time = attackerNode.runAnimations(
                "a_7_1",
                0,
                fn2
            );

            attackerNode.runAction(
                cc.MoveTo.create(time, that.battleMidpoint)
            );
        };

        fn1();
    },

    skill500: function (battleStep) {
        cc.log("skill500");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];
        var attackerNode = this._battleNode[attacker];

        battleStep.recover();

        var that = this;

        this.ccbFnCallback = function () {
            that.ccbFnCallback = function () {
                battleStep.recover();
                while (battleStep.hasNextTarget()) {
                    (function () {
                        var target = battleStep.getTarget();
                        var targetLocate = that._locate[target];
                        var targetNode = that._battleNode[target];
                        var effect = battleStep.getEffect();
                        var isCrit = battleStep.isCrit();

                        var effect500_2 = cc.BuilderReader.load(main_scene_image.effect500_2, that);
                        effect500_2.setPosition(targetLocate);
                        that.addChild(effect500_2, EFFECT_Z_ORDER - 1);

                        var nextStepCallback = that.nextStepCallback();
                        effect500_2.animationManager.setCompletedAnimationCallback(that, function () {
                            effect500_2.removeFromParent();
                            nextStepCallback();
                        });

                        targetNode.runAnimations(
                            effect ? ("d_2_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, true, isCrit);
                    })();
                }
            };

            var effect500_1 = cc.BuilderReader.load(main_scene_image.effect500_1, this);
            effect500_1.setPosition(that.battleMidpoint);
            this.addChild(effect500_1, EFFECT_Z_ORDER);

            if (that._getDirection(attacker) == "e") {
                effect500_1.setRotation(180);
            }

            var nextStepCallback = this.nextStepCallback();
            effect500_1.animationManager.setCompletedAnimationCallback(this, function () {
                effect500_1.removeFromParent();
                nextStepCallback();
            });
        };

        var nextStepCallback1 = this.nextStepCallback();
        var nextStepCallback2 = this.nextStepCallback();
        var nextStepCallback3 = this.nextStepCallback();

        var fn3 = function () {
            var time = attackerNode.runAnimations(
                "a_7_3",
                0,
                nextStepCallback3
            );

            attackerNode.runAction(
                cc.MoveTo.create(time, attackerLocate)
            );

            nextStepCallback2();
        };

        var fn2 = function () {
            attackerNode.runAnimations(
                "a_7_2",
                0,
                fn3
            );

            nextStepCallback1();
        };

        var fn1 = function () {
            var time = attackerNode.runAnimations(
                "a_7_1",
                0,
                fn2
            );

            attackerNode.runAction(
                cc.MoveTo.create(time, that.battleMidpoint)
            );
        };

        fn1();
    },

    skill501: function (battleStep) {
        cc.log("skill501");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        this.ccbFnCallback = function () {
            var that = this;

            var isFirst = true;
            that.ccbFnCallback = function () {
                if (!isFirst) {
                    return;
                }

                isFirst = false;

                battleStep.recover();
                while (battleStep.hasNextTarget()) {
                    (function () {
                        var target = battleStep.getTarget();
                        var targetLocate = that._locate[target];
                        var targetNode = that._battleNode[target];
                        var effect = battleStep.getEffect();
                        var isCrit = battleStep.isCrit();

                        targetNode.runAnimations(
                            effect ? ("d_2_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, true, isCrit);
                    })();
                }
            };

            battleStep.recover();
            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect501 = cc.BuilderReader.load(main_scene_image.effect501, that);
                    effect501.setPosition(targetLocate);
                    that.addChild(effect501, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect501.animationManager.setCompletedAnimationCallback(that, function () {
                        effect501.removeFromParent();
                        nextStepCallback();
                    });
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_3",
            0,
            this.nextStepCallback()
        );
    },

    skill502: function (battleStep) {
        cc.log("skill502");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];
        var attackerNode = this._battleNode[attacker];

        this.ccbFnCallback = function () {
            var that = this;

            var isFirst = true;
            that.ccbFnCallback = function () {
                if (!isFirst) {
                    return;
                }

                isFirst = false;

                battleStep.recover();
                while (battleStep.hasNextTarget()) {
                    (function () {
                        var target = battleStep.getTarget();
                        var targetLocate = that._locate[target];
                        var targetNode = that._battleNode[target];
                        var effect = battleStep.getEffect();
                        var isCrit = battleStep.isCrit();

                        targetNode.runAnimations(
                            effect ? ("d_2_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, true, isCrit);
                    })();
                }
            };

            battleStep.recover();
            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect502 = cc.BuilderReader.load(main_scene_image.effect502, that);
                    effect502.setPosition(targetLocate);
                    that.addChild(effect502, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect502.animationManager.setCompletedAnimationCallback(that, function () {
                        effect502.removeFromParent();
                        nextStepCallback();
                    });
                })();
            }
        };

        var nextStepCallback1 = this.nextStepCallback();
        var nextStepCallback2 = this.nextStepCallback();
        var nextStepCallback3 = this.nextStepCallback();

        var fn3 = function () {
            var time = attackerNode.runAnimations(
                "a_7_3",
                0,
                nextStepCallback3
            );

            attackerNode.runAction(
                cc.MoveTo.create(time, attackerLocate)
            );

            nextStepCallback2();
        };

        var fn2 = function () {
            attackerNode.runAnimations(
                "a_7_2",
                0,
                fn3
            );

            nextStepCallback1();
        };

        var fn1 = function () {
            var time = attackerNode.runAnimations(
                "a_7_1",
                0,
                fn2
            );

            attackerNode.runAction(
                cc.MoveTo.create(time, that.battleMidpoint)
            );
        };

        fn1();
    },

    skill503: function (battleStep) {
        cc.log("skill503");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];
        var attackerNode = this._battleNode[attacker];

        battleStep.recover();

        var that = this;

        this.ccbFnCallback = function () {
            that.ccbFnCallback = function () {
                battleStep.recover();
                while (battleStep.hasNextTarget()) {
                    (function () {
                        var target = battleStep.getTarget();
                        var targetLocate = that._locate[target];
                        var targetNode = that._battleNode[target];
                        var effect = battleStep.getEffect();
                        var isCrit = battleStep.isCrit();

                        targetNode.runAnimations(
                            effect ? ("d_2_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, true, isCrit);
                    })();
                }
            };

            var effect503_1 = cc.BuilderReader.load(main_scene_image.effect503_1, this);
            effect503_1.setPosition(that.battleMidpoint);
            this.addChild(effect503_1, EFFECT_Z_ORDER);

            if (that._getDirection(attacker) == "e") {
                effect503_1.setRotation(180);
            }

            var nextStepCallback1 = this.nextStepCallback();
            effect503_1.animationManager.setCompletedAnimationCallback(this, function () {
                effect503_1.removeFromParent();
                nextStepCallback1();
            });

            var effect503_2 = cc.BuilderReader.load(main_scene_image.effect503_2, this);
            effect503_2.setPosition(that._batterLayerFit[that._getDirection(attacker, true) + "SubtitleNode"]);
            this.addChild(effect503_2, EFFECT_Z_ORDER);

            if (that._getDirection(attacker) == "e") {
                effect503_2.setRotation(180);
            }

            var nextStepCallback2 = this.nextStepCallback();
            effect503_2.animationManager.setCompletedAnimationCallback(this, function () {
                effect503_2.removeFromParent();
                nextStepCallback2();
            });
        };

        var nextStepCallback1 = this.nextStepCallback();
        var nextStepCallback2 = this.nextStepCallback();
        var nextStepCallback3 = this.nextStepCallback();

        var fn3 = function () {
            var time = attackerNode.runAnimations(
                "a_10_3",
                0,
                nextStepCallback3
            );

            attackerNode.runAction(
                cc.MoveTo.create(time, attackerLocate)
            );

            nextStepCallback2();
        };

        var fn2 = function () {
            attackerNode.runAnimations(
                "a_10_2",
                0,
                fn3
            );

            nextStepCallback1();
        };

        var fn1 = function () {
            var time = attackerNode.runAnimations(
                "a_10_1",
                0,
                fn2
            );

            attackerNode.runAction(
                cc.MoveTo.create(time, that.battleMidpoint)
            );
        };

        fn1();
    },

    skill600: function (battleStep) {
        cc.log("skill600");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];
        var attackerNode = this._battleNode[attacker];

        battleStep.recover();

        var that = this;

        this.ccbFnCallback = function () {
            that.ccbFnCallback = function () {
                battleStep.recover();
                while (battleStep.hasNextTarget()) {
                    (function () {
                        var target = battleStep.getTarget();
                        var targetLocate = that._locate[target];
                        var targetNode = that._battleNode[target];
                        var effect = battleStep.getEffect();
                        var isCrit = battleStep.isCrit();

                        var effect600_2 = cc.BuilderReader.load(main_scene_image.effect600_2, that);
                        effect600_2.setPosition(targetLocate);
                        that.addChild(effect600_2, EFFECT_Z_ORDER);

                        var nextStepCallback = that.nextStepCallback();
                        effect600_2.animationManager.setCompletedAnimationCallback(that, function () {
                            effect600_2.removeFromParent();
                            nextStepCallback();
                        });

                        targetNode.runAnimations(
                            effect ? ("d_2_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, true, isCrit);
                    })();
                }
            };

            var effect600_1 = cc.BuilderReader.load(main_scene_image.effect600_1, this);
            effect600_1.setPosition(that.battleMidpoint);
            this.addChild(effect600_1, EFFECT_Z_ORDER);

            if (that._getDirection(attacker) == "e") {
                effect600_1.setRotation(180);
            }

            var nextStepCallback = this.nextStepCallback();
            effect600_1.animationManager.setCompletedAnimationCallback(this, function () {
                effect600_1.removeFromParent();
                nextStepCallback();
            });
        };

        var nextStepCallback1 = this.nextStepCallback();
        var nextStepCallback2 = this.nextStepCallback();
        var nextStepCallback3 = this.nextStepCallback();

        var fn3 = function () {
            var time = attackerNode.runAnimations(
                "a_7_3",
                0,
                nextStepCallback3
            );

            attackerNode.runAction(
                cc.MoveTo.create(time, attackerLocate)
            );

            nextStepCallback2();
        };

        var fn2 = function () {
            attackerNode.runAnimations(
                "a_7_2",
                0,
                fn3
            );

            nextStepCallback1();
        };

        var fn1 = function () {
            var time = attackerNode.runAnimations(
                "a_7_1",
                0,
                fn2
            );

            attackerNode.runAction(
                cc.MoveTo.create(time, that.battleMidpoint)
            );
        };

        fn1();
    },

    skill601: function (battleStep) {
        cc.log("skill601");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];
        var attackerNode = this._battleNode[attacker];

        this.ccbFnCallback = function () {
            var that = this;

            var isFirst = true;
            that.ccbFnCallback = function () {
                if (!isFirst) {
                    return;
                }

                isFirst = false;

                battleStep.recover();
                while (battleStep.hasNextTarget()) {
                    (function () {
                        var target = battleStep.getTarget();
                        var targetLocate = that._locate[target];
                        var targetNode = that._battleNode[target];
                        var effect = battleStep.getEffect();
                        var isCrit = battleStep.isCrit();

                        targetNode.runAnimations(
                            effect ? ("d_2_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, true, isCrit);
                    })();
                }
            };

            var effect601_1 = cc.BuilderReader.load(main_scene_image.effect601_1, that);
            effect601_1.setPosition(attackerNode.getPosition());
            that.addChild(effect601_1, EFFECT_Z_ORDER);

            var nextStepCallback = that.nextStepCallback();
            effect601_1.animationManager.setCompletedAnimationCallback(that, function () {
                effect601_1.removeFromParent();
                nextStepCallback();
            });

            battleStep.recover();
            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect601_2 = cc.BuilderReader.load(main_scene_image.effect601_2, that);
                    effect601_2.setPosition(targetLocate);
                    that.addChild(effect601_2, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect601_2.animationManager.setCompletedAnimationCallback(that, function () {
                        effect601_2.removeFromParent();
                        nextStepCallback();
                    });
                })();
            }
        };

        var nextStepCallback1 = this.nextStepCallback();
        var nextStepCallback2 = this.nextStepCallback();
        var nextStepCallback3 = this.nextStepCallback();

        var fn3 = function () {
            var time = attackerNode.runAnimations(
                "a_7_3",
                0,
                nextStepCallback3
            );

            attackerNode.runAction(
                cc.MoveTo.create(time, attackerLocate)
            );

            nextStepCallback2();
        };

        var fn2 = function () {
            attackerNode.runAnimations(
                "a_7_2",
                0,
                fn3
            );

            nextStepCallback1();
        };

        var fn1 = function () {
            var time = attackerNode.runAnimations(
                "a_7_1",
                0,
                fn2
            );

            attackerNode.runAction(
                cc.MoveTo.create(time, that.battleMidpoint)
            );
        };

        fn1();
    },

    skill700: function (battleStep) {
        cc.log("skill700");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];
        var that = this;

        this.ccbFnCallback = function () {
            that.ccbFnCallback = function () {
                battleStep.recover();
                while (battleStep.hasNextTarget()) {
                    (function () {
                        var target = battleStep.getTarget();
                        var targetLocate = that._locate[target];
                        var targetNode = that._battleNode[target];
                        var effect = battleStep.getEffect();
                        var isCrit = battleStep.isCrit();

                        var effect700_2 = cc.BuilderReader.load(main_scene_image.effect700_2, that);
                        effect700_2.setPosition(targetLocate);
                        that.addChild(effect700_2, EFFECT_Z_ORDER);

                        var nextStepCallback = that.nextStepCallback();
                        effect700_2.animationManager.setCompletedAnimationCallback(that, function () {
                            effect700_2.removeFromParent();
                            nextStepCallback();
                        });

                        targetNode.runAnimations(
                            effect ? ("d_2_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, true, isCrit);
                    })();
                }
            };

            var point = null;

            battleStep.recover();
            while (battleStep.hasNextTarget()) {
                var targetLocate = that._locate[battleStep.getTarget()];
                point = point ? cc.p((targetLocate.x + point.x) / 2, (targetLocate.y + point.y) / 2) : targetLocate;
            }

            var effect700_1 = cc.BuilderReader.load(main_scene_image.effect700_1, this);
            effect700_1.setPosition(attackerLocate);
            this.addChild(effect700_1, EFFECT_Z_ORDER);

            var nextStepCallback = this.nextStepCallback();
            effect700_1.animationManager.setCompletedAnimationCallback(this, function () {
                effect700_1.removeFromParent();
                nextStepCallback();
            });

            effect700_1.setRotation(lz.getAngle(attackerLocate, point));
        };

        this._battleNode[attacker].runAnimations(
            "a_9_" + this._getDirection(attacker),
            0,
            this.nextStepCallback()
        );
    },

    skill701: function (battleStep) {
        cc.log("skill701");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.ccbFnCallback = function () {
            var that = this;

            var effect701_1 = cc.BuilderReader.load(main_scene_image.effect701_1, that);
            effect701_1.setPosition(attackerLocate);
            that.addChild(effect701_1, EFFECT_Z_ORDER);

            var nextStepCallback = that.nextStepCallback();
            effect701_1.animationManager.setCompletedAnimationCallback(that, function () {
                effect701_1.removeFromParent();
                nextStepCallback();
            });

            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect701_2 = cc.BuilderReader.load(main_scene_image.effect701_2, that);
                    effect701_2.setPosition(targetLocate);
                    that.addChild(effect701_2, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect701_2.animationManager.setCompletedAnimationCallback(that, function () {
                        effect701_2.removeFromParent();
                        nextStepCallback();
                    });

                    targetNode.runAnimations(
                        effect ? ("d_2_" + that._getDirection(target)) : "miss",
                        0,
                        that.nextStepCallback()
                    );

                    targetNode.update(effect);
                    that.tipHarm(target, effect, true, isCrit);
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_3",
            0,
            this.nextStepCallback()
        );
    },

    skill702: function (battleStep) {
        cc.log("skill702");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        this.ccbFnCallback = function () {
            var that = this;

            var isFirst = true;
            that.ccbFnCallback = function () {
                if (!isFirst) {
                    return;
                }

                isFirst = false;

                battleStep.recover();
                while (battleStep.hasNextTarget()) {
                    (function () {
                        var target = battleStep.getTarget();
                        var targetLocate = that._locate[target];
                        var targetNode = that._battleNode[target];
                        var effect = battleStep.getEffect();
                        var isCrit = battleStep.isCrit();

                        targetNode.runAnimations(
                            effect ? ("d_2_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, true, isCrit);
                    })();
                }
            };

            var effect702_2 = cc.BuilderReader.load(main_scene_image.effect702_2, that);
            effect702_2.setPosition(attackerLocate);
            that.addChild(effect702_2, EFFECT_Z_ORDER);

            var nextStepCallback = that.nextStepCallback();
            effect702_2.animationManager.setCompletedAnimationCallback(that, function () {
                effect702_2.removeFromParent();
                nextStepCallback();
            });

            battleStep.recover();
            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect702_1 = cc.BuilderReader.load(main_scene_image.effect1_1, that);
                    effect702_1.setPosition(attackerLocate);
                    that.addChild(effect702_1, EFFECT_Z_ORDER);

                    var effect1NodeAnimationManager = effect702_1.animationManager;
                    var nextStepCallback1 = that.nextStepCallback();
                    effect1NodeAnimationManager.setCompletedAnimationCallback(that, function () {
                        effect702_1.removeFromParent();

                        var effect702_3 = cc.BuilderReader.load(main_scene_image.effect702_3, that);
                        effect702_3.setPosition(targetLocate);
                        that.addChild(effect702_3, EFFECT_Z_ORDER);

                        var nextStepCallback2 = that.nextStepCallback();
                        effect702_3.animationManager.setCompletedAnimationCallback(that, function () {
                            effect702_3.removeFromParent();
                            nextStepCallback2();
                        });

                        nextStepCallback1();
                    });

                    var gameMidpointX = gameFit.GAME_MIDPOINT.x;

                    var pointArray = [
                        attackerLocate,
                        cc.p(lz.random(gameMidpointX - 300, gameMidpointX + 300), (attackerLocate.y + targetLocate.y) / 2),
                        targetLocate
                    ];

                    effect702_1.runAction(
                        cc.CardinalSplineTo.create(
                            effect1NodeAnimationManager.getSequenceDuration(
                                effect1NodeAnimationManager.getRunningSequenceName()
                            ),
                            pointArray,
                            0
                        )
                    );
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_3",
            0,
            this.nextStepCallback()
        );
    },

    skill800: function (battleStep) {
        cc.log("skill800");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        this.ccbFnCallback = function () {
            var that = this;

            var isFirst = true;
            that.ccbFnCallback = function () {
                if (!isFirst) {
                    return;
                }

                isFirst = false;

                battleStep.recover();
                while (battleStep.hasNextTarget()) {
                    (function () {
                        var target = battleStep.getTarget();
                        var targetLocate = that._locate[target];
                        var targetNode = that._battleNode[target];
                        var effect = battleStep.getEffect();
                        var isCrit = battleStep.isCrit();

                        targetNode.runAnimations(
                            effect ? ("d_2_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, true, isCrit);
                    })();
                }
            };

            battleStep.recover();
            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect800 = cc.BuilderReader.load(main_scene_image.effect800, that);
                    effect800.setPosition(targetLocate);
                    that.addChild(effect800, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect800.animationManager.setCompletedAnimationCallback(that, function () {
                        effect800.removeFromParent();
                        nextStepCallback();
                    });
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_2_" + this._getDirection(attacker),
            0,
            this.nextStepCallback()
        );
    },

    skill801: function (battleStep) {
        cc.log("skill801");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];
        var attackerNode = this._battleNode[attacker];

        battleStep.recover();

        if (battleStep.hasNextTarget()) {
            var target = battleStep.getTarget();
            var targetLocate = this._locate[target];
            var targetNode = this._battleNode[target];
            var effect = battleStep.getEffect();
            var isCrit = battleStep.isCrit();
        }

        var that = this;

        var nextStepCallback1 = this.nextStepCallback();
        var nextStepCallback2 = this.nextStepCallback();
        var nextStepCallback3 = this.nextStepCallback();
        var nextStepCallback4 = this.nextStepCallback();

        var fn4 = function () {
            attackerNode.runAnimations(
                "a_8_" + that._getDirection(attacker) + "_4",
                0,
                nextStepCallback4
            );

            attackerNode.setPosition(attackerLocate);

            nextStepCallback3();
        };

        var fn3 = function () {
            attackerNode.runAnimations(
                "a_8_" + that._getDirection(attacker) + "_3",
                0,
                fn4
            );

            var effect801 = cc.BuilderReader.load(main_scene_image.effect801, that);
            effect801.setPosition(targetLocate);
            that.addChild(effect801, EFFECT_Z_ORDER);

            var nextStepCallback = that.nextStepCallback();
            effect801.animationManager.setCompletedAnimationCallback(that, function () {
                effect801.removeFromParent();
                nextStepCallback();
            });

            targetNode.runAnimations(
                effect ? ("d_2_" + that._getDirection(target)) : "miss",
                0,
                that.nextStepCallback()
            );

            targetNode.update(effect);
            that.tipHarm(target, effect, true, isCrit);

            nextStepCallback2();
        };

        var fn2 = function () {
            var time = attackerNode.runAnimations(
                "a_8_" + that._getDirection(attacker) + "_2",
                0,
                fn3
            );

            attackerNode.runAction(
                cc.EaseSineIn.create(
                    cc.MoveTo.create(time, targetLocate)
                )
            );

            nextStepCallback1();
        };

        var fn1 = function () {
            attackerNode.runAnimations(
                "a_8_" + that._getDirection(attacker) + "_1",
                0,
                fn2
            );
        };

        fn1();
    },

    skill802: function (battleStep) {
        cc.log("skill802");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        this.ccbFnCallback = function () {
            var that = this;

            var isFirst = true;
            that.ccbFnCallback = function () {
                if (!isFirst) {
                    return;
                }

                isFirst = false;

                battleStep.recover();
                while (battleStep.hasNextTarget()) {
                    (function () {
                        var target = battleStep.getTarget();
                        var targetLocate = that._locate[target];
                        var targetNode = that._battleNode[target];
                        var effect = battleStep.getEffect();
                        var isCrit = battleStep.isCrit();

                        targetNode.runAnimations(
                            effect ? ("d_2_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, true, isCrit);
                    })();
                }
            };

            battleStep.recover();
            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect802 = cc.BuilderReader.load(main_scene_image.effect802, that);
                    effect802.setPosition(targetLocate);
                    that.addChild(effect802, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect802.animationManager.setCompletedAnimationCallback(that, function () {
                        effect802.removeFromParent();
                        nextStepCallback();
                    });
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_2_" + this._getDirection(attacker),
            0,
            this.nextStepCallback()
        );
    },

    skill803: function (battleStep) {
        cc.log("skill803");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        this.ccbFnCallback = function () {
            var that = this;

            var isFirst = true;
            that.ccbFnCallback = function () {
                if (!isFirst) {
                    return;
                }

                isFirst = false;

                battleStep.recover();
                while (battleStep.hasNextTarget()) {
                    (function () {
                        var target = battleStep.getTarget();
                        var targetLocate = that._locate[target];
                        var targetNode = that._battleNode[target];
                        var effect = battleStep.getEffect();
                        var isCrit = battleStep.isCrit();

                        targetNode.runAnimations(
                            effect ? ("d_2_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, true, isCrit);
                    })();
                }
            };

            battleStep.recover();
            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect803 = cc.BuilderReader.load(main_scene_image.effect803, that);
                    effect803.setPosition(targetLocate);
                    that.addChild(effect803, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect803.animationManager.setCompletedAnimationCallback(that, function () {
                        effect803.removeFromParent();
                        nextStepCallback();
                    });
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_2_" + this._getDirection(attacker),
            0,
            this.nextStepCallback()
        );
    },

    skill804: function (battleStep) {
        cc.log("skill804");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        this.ccbFnCallback = function () {
            var that = this;

            var isFirst = true;
            that.ccbFnCallback = function () {
                if (!isFirst) {
                    return;
                }

                isFirst = false;

                battleStep.recover();
                while (battleStep.hasNextTarget()) {
                    (function () {
                        var target = battleStep.getTarget();
                        var targetLocate = that._locate[target];
                        var targetNode = that._battleNode[target];
                        var effect = battleStep.getEffect();
                        var isCrit = battleStep.isCrit();

                        targetNode.runAnimations(
                            effect ? ("d_2_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, true, isCrit);
                    })();
                }
            };

            battleStep.recover();
            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect804 = cc.BuilderReader.load(main_scene_image.effect804, that);
                    effect804.setPosition(targetLocate);
                    that.addChild(effect804, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect804.animationManager.setCompletedAnimationCallback(that, function () {
                        effect804.removeFromParent();
                        nextStepCallback();
                    });
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_2_" + this._getDirection(attacker),
            0,
            this.nextStepCallback()
        );
    },

    skill805: function (battleStep) {
        cc.log("skill805");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        this.ccbFnCallback = function () {
            var that = this;

            var isFirst = true;
            that.ccbFnCallback = function () {
                if (!isFirst) {
                    return;
                }

                isFirst = false;

                battleStep.recover();
                while (battleStep.hasNextTarget()) {
                    (function () {
                        var target = battleStep.getTarget();
                        var targetLocate = that._locate[target];
                        var targetNode = that._battleNode[target];
                        var effect = battleStep.getEffect();
                        var isCrit = battleStep.isCrit();

                        targetNode.runAnimations(
                            effect ? ("d_2_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, true, isCrit);
                    })();
                }
            };

            battleStep.recover();
            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect805 = cc.BuilderReader.load(main_scene_image.effect805, that);
                    effect805.setPosition(targetLocate);
                    that.addChild(effect805, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect805.animationManager.setCompletedAnimationCallback(that, function () {
                        effect805.removeFromParent();
                        nextStepCallback();
                    });
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_2_" + this._getDirection(attacker),
            0,
            this.nextStepCallback()
        );
    },

    skill806: function (battleStep) {
        cc.log("skill806");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        this.ccbFnCallback = function () {
            var that = this;

            var isFirst = true;
            that.ccbFnCallback = function () {
                if (!isFirst) {
                    return;
                }

                isFirst = false;

                battleStep.recover();
                while (battleStep.hasNextTarget()) {
                    (function () {
                        var target = battleStep.getTarget();
                        var targetLocate = that._locate[target];
                        var targetNode = that._battleNode[target];
                        var effect = battleStep.getEffect();
                        var isCrit = battleStep.isCrit();

                        targetNode.runAnimations(
                            effect ? ("d_2_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, true, isCrit);
                    })();
                }
            };

            battleStep.recover();
            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect806 = cc.BuilderReader.load(main_scene_image.effect806, that);
                    effect806.setPosition(targetLocate);
                    that.addChild(effect806, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect806.animationManager.setCompletedAnimationCallback(that, function () {
                        effect806.removeFromParent();
                        nextStepCallback();
                    });
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_2_" + this._getDirection(attacker),
            0,
            this.nextStepCallback()
        );
    },

    skill807: function (battleStep) {
        cc.log("skill807");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        this.ccbFnCallback = function () {
            var that = this;

            var isFirst = true;
            that.ccbFnCallback = function () {
                if (!isFirst) {
                    return;
                }

                isFirst = false;

                battleStep.recover();
                while (battleStep.hasNextTarget()) {
                    (function () {
                        var target = battleStep.getTarget();
                        var targetLocate = that._locate[target];
                        var targetNode = that._battleNode[target];
                        var effect = battleStep.getEffect();
                        var isCrit = battleStep.isCrit();

                        targetNode.runAnimations(
                            effect ? ("d_2_" + that._getDirection(target)) : "miss",
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, true, isCrit);
                    })();
                }
            };

            var effect807_1 = cc.BuilderReader.load(main_scene_image.effect807_1, that);
            effect807_1.setPosition(attackerLocate);
            that.addChild(effect807_1, EFFECT_Z_ORDER);

            var nextStepCallback = that.nextStepCallback();
            effect807_1.animationManager.setCompletedAnimationCallback(that, function () {
                effect807_1.removeFromParent();
                nextStepCallback();
            });

            battleStep.recover();
            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect807_2 = cc.BuilderReader.load(main_scene_image.effect807_2, that);
                    effect807_2.setPosition(targetLocate);
                    that.addChild(effect807_2, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect807_2.animationManager.setCompletedAnimationCallback(that, function () {
                        effect807_2.removeFromParent();
                        nextStepCallback();
                    });
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "a_3",
            0,
            this.nextStepCallback()
        );
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
        this.addChild(spirit, SPIRIT_Z_ORDER);
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
        cc.log("BatterLayer _collectSpirit");

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
                    var gameMidpointX = gameFit.GAME_MIDPOINT.x;

                    var pointArray = [
                        point1,
                        cc.p(lz.random(gameMidpointX - 300, gameMidpointX + 300), (point1.y + point2.y) / 2),
                        point2
                    ];

                    spirit.runAction(cc.Sequence.create(
                        cc.Spawn.create(
                            cc.CardinalSplineTo.create(2, pointArray, 0),
                            cc.Sequence.create(
                                cc.DelayTime.create(1.5),
                                cc.CallFunc.create(function () {
                                    this._battleNode[index].runAnimations("col");
                                }, this),
                                cc.ScaleTo.create(0.5, 0.3, 0.3)
                            )
                        ),
                        cc.Hide.create()
                    ));
                }

                this.scheduleOnce(function () {
                    this.end();
                }, 3);
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
                }, 1.5);
            }
        }
    },

    _onClickBack: function () {
        cc.log("BattleLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._isPlayback) {
            this.end();
            return;
        }

        var player = gameData.player;

        if (player.get("lv") >= 10 && player.getRemainDays(MONTH_CARD) > 0) {
            this.end();
        } else {
            TipLayer.tip("月卡玩家10级可跳过");
        }
    },

    _onClickChangePlaySpeed: function () {
        cc.log("BattleLayer _onClickChangePlaySpeed");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._playSpeed++;

        if (this._playSpeed > 3) {
            this._playSpeed = 1;
        }

        var vip = gameData.player.get("vip");
        var lv = gameData.player.get("lv");

        if (vip < 1) { // 普通玩家
            if (lv < 10) {
                TipLayer.tip("vip1或10级开启2倍速");
            } else if (this._playSpeed == 3) {
                TipLayer.tip("vip2开启3倍速");
            } else {
                cc.Director.getInstance().getScheduler().setTimeScale(BATTLE_PLAY_SPEEDS[this._playSpeed]);
                sys.localStorage.setItem(gameData.player.get("uid") + "playSpeedTimes", this._playSpeed);

                for (var i = 1; i <= 3; i++) {
                    this._chooseSpeedItem[i].setVisible(i == this._playSpeed);
                }
            }
        } else { // vip玩家
            if (this._playSpeed == 3 && vip < 2) {
                TipLayer.tip("vip2开启3倍速");
            } else {
                cc.Director.getInstance().getScheduler().setTimeScale(BATTLE_PLAY_SPEEDS[this._playSpeed]);
                sys.localStorage.setItem(gameData.player.get("uid") + "playSpeedTimes", this._playSpeed);

                for (var i = 1; i <= 3; i++) {
                    this._chooseSpeedItem[i].setVisible(i == this._playSpeed);
                }
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
