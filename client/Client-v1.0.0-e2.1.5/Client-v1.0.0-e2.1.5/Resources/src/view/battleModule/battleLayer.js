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
    _batterLayerFit: null,

    _index: 0,
    _isEnd: false,
    _counter: 0,
    _battleLog: null,
    _battleNode: null,
    _tipNode: null,
    _spiritNode: null,
    _locate: null,

    init: function (battleLog) {
        cc.log("BatterLayer init");

        if (!this._super()) return false;

        this._batterLayerFit = gameFit.battleScene.batterLayer;

        this._index = 1;
        this._isEnd = false;
        this._battleLog = battleLog;
        this._spiritNode = [];
        this._locate = this._batterLayerFit.locatePoints;

        var bgSprite = cc.Sprite.create(main_scene_image.bg13, this._batterLayerFit.bgSpriteRect);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._batterLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        return true;
    },

    play: function () {
        cc.log("BatterLayer play");

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
                this.addChild(this._battleNode[key]);

                cc.log(this._battleNode[key]);

                if (index < 7) {
                    this._battleNode[key].runAnimations("beg_1", 0, this.began());
                }

                this._tipNode[key] = cc.BuilderReader.load(main_scene_image.tipNode, this);
                this._tipNode[key].setPosition(locate);
                this.addChild(this._tipNode[key], 3);
            }
        }

        this._backItem = cc.MenuItemFont.create("结束战斗", this._onClickBack, this);
        this._backItem.setPosition(this._batterLayerFit.backItemPoint);
        var menu = cc.Menu.create(this._backItem);
        this.addChild(menu);

        this._battleLog.recover();
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
            tipNode.controller.label.setString(str);
            tipNode.animationManager.runAnimationsForSequenceNamedTweenDuration(name, 0);
        }
    },

    tipHarm: function (index, value, isCirt) {
        cc.log("BatterLayer tipHarm");

        var name = "";
        var str = "";

        if (value === 0) {
            str = "闪";
            name = "mis_1";
        } else if (value > 0) {
            str = "+" + value;

            if (isCirt) {
                name = "atk_2_2";
            } else {
                name = "atk_2_1";
            }
        } else {
            str = "" + value;

            if (isCirt) {
                name = "atk_1_2";
            } else {
                name = "atk_1_1";
            }
        }

        this.tip(index, name, str);
    },

    _getDirection: function (index) {
        if (index <= 6) {
            return 1;
        }

        return 2;
    },

    began: function () {
        this._counter += 1;

        var that = this;
        return function () {
            that._counter -= 1;

            if (that._counter == 0) {
                var effect15Node = cc.BuilderReader.load(main_scene_image.effect15, that);
                effect15Node.setPosition(that._batterLayerFit.effect15NodePoint);
                that.addChild(effect15Node);

                effect15Node.animationManager.setCompletedAnimationCallback(that, function () {
                    effect15Node.removeFromParent();
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
                    var effect8Node = cc.BuilderReader.load(main_scene_image.effect8, that);
                    effect8Node.setPosition(that._locate[index]);
                    that.addChild(effect8Node);

                    var showSpiritAdditionCallback = that.showSpiritAdditionCallback();
                    effect8Node.animationManager.setCompletedAnimationCallback(that, function () {
                        effect8Node.removeFromParent();
                        showSpiritAdditionCallback();
                    });

                    that._battleNode[index].runAnimations(
                        "buf_1_" + that._getDirection(index),
                        0,
                        that.showSpiritAdditionCallback()
                    );
                })();

                return;
            }
        }

        this.nextStep();
    },

    showAddition: function (startIndex) {
        cc.log("BattleLayer showOwnAddition");

        var that = this;
        var endIndex = startIndex + 6;

        for (var i = startIndex; i < endIndex; ++i) {
            if (this._battleNode[i] && (this._battleNode[i] instanceof BattleCardNode)) {
                (function () {
                    var index = i;
                    var cardNode = that._battleNode[i];
                    var locate = that._locate[i];

                    var effect9Node = cc.BuilderReader.load(main_scene_image.effect9, that);
                    effect9Node.setPosition(locate);
                    that.addChild(effect9Node);

                    var showSpiritAdditionCallback1 = that.showSpiritAdditionCallback();
                    effect9Node.animationManager.setCompletedAnimationCallback(that, function () {
                        effect9Node.removeFromParent();

                        var effect10Node = cc.BuilderReader.load(main_scene_image.effect10, that);
                        effect10Node.setPosition(locate);
                        that.addChild(effect10Node);

                        var showSpiritAdditionCallback2 = that.showSpiritAdditionCallback();
                        effect10Node.animationManager.setCompletedAnimationCallback(that, function () {
                            effect10Node.removeFromParent();
                            showSpiritAdditionCallback2();
                        });

                        that.tip(index, "buf_2", "攻击\n +" + cardNode.getSpiritAtk());

                        showSpiritAdditionCallback1();
                    });

                    var spiritHp = cardNode.getSpiritHp();
                    cardNode.update(spiritHp);
                    that.tip(index, "buf_1", "生命\n +" + spiritHp);
                })();
            }
        }
    },

    callback: function () {

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

        this.callback = function () {
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

        this.attack(this._battleLog.getBattleStep());
    },

    attack: function (battleStep) {
        cc.log("BattleLayer attack");
        cc.log(battleStep);

        if (battleStep.isSkill()) {
            var skillType = this._battleNode[battleStep.get("attacker")].getSkillType();
            var isSpiritAtk = battleStep.isSpiritAtk();

            if (isSpiritAtk) {
                battleStep.set("attacker", this._battleLog.getSpirit(battleStep.get("attacker")));
            }

            var attacker = battleStep.get("attacker");
            var ccbNode = this._battleNode[attacker].getSubtitleNode();
            var that = this;

            var cb = function () {
                if (ccbNode) {
                    ccbNode.removeFromParent();
                }

                if (skillType === 1) {
                    that.singleAtk(battleStep);
                } else if (skillType === 2) {
                    that.aoeAtk(battleStep);
                } else if (skillType === 3) {
                    that.heal(battleStep);
                } else if (skillType === 4) {
                    that.heal(battleStep);
                }
            };

            var addSubtitleNodeCb = function () {
                if (ccbNode) {
                    ccbNode.setPosition(that._batterLayerFit["ccbNodePoint" + that._getDirection(attacker)]);
                    that.addChild(ccbNode, 5);

                    ccbNode.animationManager.setCompletedAnimationCallback(that, cb);
                } else {
                    cb();
                }
            };

            this._battleNode[attacker].runAnimations(
                "rea_1",
                0,
                addSubtitleNodeCb
            );
        } else {
            this.normalAtk(battleStep);
        }
    },

    normalAtk: function (battleStep) {
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
                    that.addChild(effect1Node);

                    var effect1NodeAnimationManager = effect1Node.animationManager;
                    var nextStepCallback1 = that.nextStepCallback();
                    effect1NodeAnimationManager.setCompletedAnimationCallback(that, function () {
                        effect1Node.removeFromParent();

                        var effect2Node = cc.BuilderReader.load(main_scene_image.effect2, that);
                        effect2Node.setPosition(targetLocate);
                        that.addChild(effect2Node);

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
                        that.tipHarm(target, effect, isCrit);

                        nextStepCallback1();
                    });

                    effect1Node.setRotation(lz.getAngle(attackerLocate, targetLocate));
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
                    that.addChild(effect3Node);

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
                    that.tipHarm(target, effect, isCrit);
                })();
            }
        };

        this._battleNode[attacker].runAnimations(
            "atk_2_" + this._getDirection(attacker),
            0,
            this.nextStepCallback()
        );
    },

    aoeAtk: function (battleStep) {
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
                            nextStepCallback2();
                        });

                        targetNode.runAnimations(
                            (effect ? "def_3_" : "mis_1_") + that._getDirection(target),
                            0,
                            that.nextStepCallback()
                        );

                        targetNode.update(effect);
                        that.tipHarm(target, effect, isCrit);

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
            this.addChild(effect6Node);

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
                    that.addChild(effect7Node);

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
                    that.tipHarm(target, effect, isCrit);
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

        if (gameData.player.get("lv") < 10) {
            TipLayer.tip("10级开始后，可以跳过战斗");
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