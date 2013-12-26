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
    _isPlayback: false,

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
        this._backItem.setVisible(false);

        var menu = cc.Menu.create(this._backItem);
        this.addChild(menu);

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
    },

    end: function () {
        cc.log("BatterLayer end");

        this._isEnd = true;

        this._backItem.setVisible(false);

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

        var name = "";
        var str = "";

        if (value === 0) {
            name = "miss";
        } else if (value > 0) {
            str = "+" + value;

            if (isCirt) {
                name = "atk_2_2";
            } else {
                name = "atk_2_1";
            }
        } else {
            str = "" + value;

            if (isSkill) {
                name = "atk_3_";
            } else {
                name = "atk_1_"
            }

            if (isCirt) {
                name += "2";
            } else {
                name += "1";
            }
        }

        this.tip(index, name, str);
    },

    _getDirection: function (index) {
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

        if (battleStep.isSkill()) {
            var skillFn = this._battleNode[battleStep.get("attacker")].getSkillFn();

            cc.log(skillFn);

            if (battleStep.isSpiritAtk()) {
                battleStep.set("attacker", this._battleLog.getSpirit(battleStep.get("attacker")));
            }

            var attacker = battleStep.get("attacker");
            var ccbNode = this._battleNode[attacker].getSubtitleNode();
            var that = this;

            var cb = function () {
                if (ccbNode) {
                    ccbNode.removeFromParent();
                }

                this["skill1"](battleStep);
            };

            var addSubtitleNodeCb = function () {
                ccbNode.setPosition(that._batterLayerFit[that._getDirection(attacker) + "SubtitleNode"]);
                that.addChild(ccbNode, EFFECT_Z_ORDER);

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
            var normalAtkFn = this._battleNode[battleStep.get("attacker")].getNormalAtkFn();

            cc.log(normalAtkFn);

            this["skill1"](battleStep);
        }
    },

    skill1: function (battleStep) {
        cc.log("skill1");

        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.callback = function () {
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

    normalAtk1: function (battleStep) {
        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.callback = function () {
            var that = this;

            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect1Node = cc.BuilderReader.load(main_scene_image.effect1, that);
                    effect1Node.setPosition(attackerLocate);
                    that.addChild(effect1Node, EFFECT_Z_ORDER);

                    var effect1NodeAnimationManager = effect1Node.animationManager;
                    var nextStepCallback1 = that.nextStepCallback();
                    effect1NodeAnimationManager.setCompletedAnimationCallback(that, function () {
                        effect1Node.removeFromParent();

                        var effect2Node = cc.BuilderReader.load(main_scene_image.effect2, that);
                        effect2Node.setPosition(targetLocate);
                        that.addChild(effect2Node, EFFECT_Z_ORDER);

                        var nextStepCallback2 = that.nextStepCallback();
                        effect2Node.animationManager.setCompletedAnimationCallback(that, function () {
                            effect2Node.removeFromParent();
                            nextStepCallback2();
                        });

                        targetNode.runAnimations(
                            (effect ? "def_1_" : "mis_1_") + that._getDirection(target),
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, false, isCrit);

                        nextStepCallback1();
                    });

                    effect1Node.runAction(
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
            "atk_1_" + this._getDirection(attacker),
            0,
            this.nextStepCallback()
        );
    },

    normalAtk2: function (battleStep) {
        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.callback = function () {
            var that = this;

            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect26Node = cc.BuilderReader.load(main_scene_image.effect26, that);
                    effect26Node.setPosition(attackerLocate);
                    that.addChild(effect26Node, EFFECT_Z_ORDER);

                    var nextStepCallback1 = that.nextStepCallback();
                    effect26Node.animationManager.setCompletedAnimationCallback(that, function () {
                        effect26Node.removeFromParent();
                        nextStepCallback1();
                    });

                    var k = lz.getDistance(attackerLocate, targetLocate) / 960;
                    effect26Node.setScaleX(k);
                    effect26Node.setScaleY(k);
                    effect26Node.setRotation(lz.getAngle(attackerLocate, targetLocate));

                    that.scheduleOnce(function () {
                        var effect27Node = cc.BuilderReader.load(main_scene_image.effect27, that);
                        effect27Node.setPosition(targetLocate);
                        that.addChild(effect27Node, EFFECT_Z_ORDER);

                        var nextStepCallback2 = that.nextStepCallback();
                        effect27Node.animationManager.setCompletedAnimationCallback(that, function () {
                            effect27Node.removeFromParent();
                            nextStepCallback2();
                        });

                        targetNode.runAnimations(
                            (effect ? "def_1_" : "mis_1_") + that._getDirection(target),
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, false, isCrit);
                    }, 0.16);
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "atk_1_" + this._getDirection(attacker),
            0,
            this.nextStepCallback()
        );
    },

    normalAtk3: function (battleStep) {
        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.callback = function () {
            var that = this;

            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect25Node = cc.BuilderReader.load(main_scene_image.effect25, that);
                    effect25Node.setPosition(attackerLocate);
                    that.addChild(effect25Node, EFFECT_Z_ORDER);

                    var effect1NodeAnimationManager = effect25Node.animationManager;
                    var nextStepCallback1 = that.nextStepCallback();
                    effect1NodeAnimationManager.setCompletedAnimationCallback(that, function () {
                        effect25Node.removeFromParent();

                        var effect24Node = cc.BuilderReader.load(main_scene_image.effect24, that);
                        effect24Node.setPosition(targetLocate);
                        that.addChild(effect24Node, EFFECT_Z_ORDER);

                        var nextStepCallback2 = that.nextStepCallback();
                        effect24Node.animationManager.setCompletedAnimationCallback(that, function () {
                            effect24Node.removeFromParent();
                            nextStepCallback2();
                        });

                        targetNode.runAnimations(
                            (effect ? "def_1_" : "mis_1_") + that._getDirection(target),
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, false, isCrit);

                        nextStepCallback1();
                    });

                    effect25Node.runAction(
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
            "atk_1_" + this._getDirection(attacker),
            0,
            this.nextStepCallback()
        );
    },

    singleAtk: function (battleStep) {
        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.callback = function () {
            var that = this;

            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect3Node = cc.BuilderReader.load(main_scene_image.effect3, that);
                    effect3Node.setPosition(targetLocate);
                    that.addChild(effect3Node, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect3Node.animationManager.setCompletedAnimationCallback(that, function () {
                        effect3Node.removeFromParent();
                        nextStepCallback();
                    });

                    targetNode.runAnimations(
                        (effect ? "def_2_" : "mis_1_") + that._getDirection(target),
                        0,
                        that.nextStepCallback()
                    );

                    targetNode.update(effect);
                    that.tipHarm(target, effect, true, isCrit);
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "atk_2_" + this._getDirection(attacker),
            0,
            this.nextStepCallback()
        );
    },

    aoeAtk1: function (battleStep) {
        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.callback = function () {
            var that = this;

            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect19Node = cc.BuilderReader.load(main_scene_image.effect19, that);
                    effect19Node.setPosition(attackerLocate);
                    that.addChild(effect19Node, EFFECT_Z_ORDER);

                    var effect1NodeAnimationManager = effect19Node.animationManager;
                    var nextStepCallback1 = that.nextStepCallback();
                    effect1NodeAnimationManager.setCompletedAnimationCallback(that, function () {
                        effect19Node.removeFromParent();

                        var effect20Node = cc.BuilderReader.load(main_scene_image.effect20, that);
                        effect20Node.setPosition(targetLocate);
                        that.addChild(effect20Node, EFFECT_Z_ORDER);

                        var nextStepCallback2 = that.nextStepCallback();
                        effect20Node.animationManager.setCompletedAnimationCallback(that, function () {
                            effect20Node.removeFromParent();
                            nextStepCallback2();
                        });

                        targetNode.runAnimations(
                            (effect ? "def_3_" : "mis_1_") + that._getDirection(target),
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, true, isCrit);

                        nextStepCallback1();
                    });

                    effect19Node.runAction(
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
            "atk_3_" + this._getDirection(attacker),
            0,
            this.nextStepCallback()
        );
    },

    aoeAtk2: function (battleStep) {
        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.callback = function () {
            var that = this;

            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect21Node = cc.BuilderReader.load(main_scene_image.effect21, that);
                    effect21Node.setPosition(targetLocate);
                    that.addChild(effect21Node, EFFECT_Z_ORDER);

                    var nextStepCallback1 = that.nextStepCallback();
                    effect21Node.animationManager.setCompletedAnimationCallback(that, function () {
                        effect21Node.removeFromParent();
                        nextStepCallback1();
                    });

                    targetNode.runAnimations(
                        (effect ? "def_3_" : "mis_1_") + that._getDirection(target),
                        0,
                        that.nextStepCallback()
                    );

                    targetNode.update(effect);
                    that.tipHarm(target, effect, true, isCrit);
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "atk_3_" + this._getDirection(attacker),
            0,
            this.nextStepCallback()
        );
    },

    aoeAtk3: function (battleStep) {
        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.callback = function () {
            var that = this;

            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect4Node = cc.BuilderReader.load(main_scene_image.effect4, that);
                    effect4Node.setPosition(targetLocate);
                    that.addChild(effect4Node, EFFECT_Z_ORDER);

                    var nextStepCallback1 = that.nextStepCallback();
                    effect4Node.animationManager.setCompletedAnimationCallback(that, function () {
                        effect4Node.removeFromParent();

                        var effect5Node = cc.BuilderReader.load(main_scene_image.effect5, that);
                        effect5Node.setPosition(targetLocate);
                        that.addChild(effect5Node, EFFECT_Z_ORDER);

                        var nextStepCallback2 = that.nextStepCallback();
                        effect5Node.animationManager.setCompletedAnimationCallback(that, function () {
                            effect5Node.removeFromParent();
                            nextStepCallback2();
                        });

                        targetNode.runAnimations(
                            (effect ? "def_3_" : "mis_1_") + that._getDirection(target),
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, true, isCrit);

                        nextStepCallback1();
                    });
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "atk_3_" + this._getDirection(attacker),
            0,
            this.nextStepCallback()
        );
    },

    heal: function (battleStep) {
        var attacker = battleStep.get("attacker");
        var attackerLocate = this._locate[attacker];

        battleStep.recover();
        this.callback = function () {
            var that = this;

            var effect6Node = cc.BuilderReader.load(main_scene_image.effect6, this);
            effect6Node.setPosition(attackerLocate);
            this.addChild(effect6Node, EFFECT_Z_ORDER);

            var nextStepCallback = this.nextStepCallback();
            effect6Node.animationManager.setCompletedAnimationCallback(this, function () {
                effect6Node.removeFromParent();
                nextStepCallback();
            });

            while (battleStep.hasNextTarget()) {
                (function () {
                    var target = battleStep.getTarget();
                    var targetLocate = that._locate[target];
                    var targetNode = that._battleNode[target];
                    var effect = battleStep.getEffect();
                    var isCrit = battleStep.isCrit();

                    var effect7Node = cc.BuilderReader.load(main_scene_image.effect7, that);
                    effect7Node.setPosition(targetLocate);
                    that.addChild(effect7Node, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect7Node.animationManager.setCompletedAnimationCallback(that, function () {
                        effect7Node.removeFromParent();
                        nextStepCallback();
                    });

                    targetNode.runAnimations(
                        (effect ? "def_4_" : "mis_1_") + that._getDirection(target),
                        0,
                        that.nextStepCallback()
                    );

                    targetNode.update(effect);
                    that.tipHarm(target, effect, true, isCrit);
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "atk_4_" + this._getDirection(attacker),
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
                                    this._battleNode[index].runAnimations("col_1");
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
        } else if (gameData.player.get("lv") < 10) {
            TipLayer.tip("10级以后，可以跳过战斗");
        } else {
            this.end();
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