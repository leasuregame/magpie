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

var BATTLE_SHOCK_TAG = 234590;

var DAMAGE_LOWER_LIMIT = 0.80;
var DAMAGE_UPPER_LIMIT = 1.20;

var BOSS_CARD_SCALE = 1.5;

var BattleLayer = cc.Layer.extend({
    _battleLayerFit: null,

    _skillStep: null,
    _index: 0,
    _isEnd: false,
    _counter: 0,
    _battleLog: null,
    _type: PVE_BATTLE_LOG,
    _battleNode: null,
    _spiritNode: null,
    _locate: null,
    _lastTipOffset: null,
    _battleMidpoint: null,
    _lineUpMidpoint: null,
    _isPlayback: false,
    _playSpeed: 0,
    _backItem: null,
    _chooseSpeedItem: null,
    _menu: null,
    _stepLabel: null,

    init: function (battleLog) {
        cc.log("BattleLayer init");

        if (!this._super()) return false;

        this._battleLayerFit = gameFit.battleScene.battleLayer;

        this._skillStep = {};
        this._index = 1;
        this._isEnd = false;
        this._battleLog = battleLog;
        this._type = this._battleLog.get("type");
        this._isPlayback = this._battleLog.get("isPlayback");
        this._spiritNode = [];
        this._locate = this._battleLayerFit.locatePoints;
        this._battleMidpoint = this._battleLayerFit.battleMidpoint;
        this._lineUpMidpoint = this._battleLayerFit.lineUpMidpoint;
        this._chooseSpeedItem = [];

        this._battleLog.recover();
        for (var i = 0; i < 2; ++i) {
            if (this._battleLog.hasNextBattleStep()) {
                this._battleLog.getBattleStep();
            }
        }

        var bgSprite = cc.Sprite.create(main_scene_image.bg13, this._battleLayerFit.bgSpriteRect);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._battleLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var battleNode = this._battleLog.get("card");

        cc.log(battleNode);

        this._battleNode = {};
        for (var key in battleNode) {
            if (battleNode[key] != undefined) {
                cc.log(battleNode[key]);

                var index = parseInt(key);
                var locate = this._locate[key];

                if (typeof(battleNode[key]) == "number") {
                    this._battleNode[key] = BattleSpiritNode.create(battleNode[key], index);
                    var spiritFrame = cc.Sprite.create(main_scene_image.spirit_frame);
                    this._battleNode[key].addChild(spiritFrame, -1);
                } else {
                    this._battleNode[key] = BattleCardNode.create(battleNode[key], index);
                }

                this._battleNode[key].setPosition(locate);
                this._battleNode[key].setVisible(false);
                this.addChild(
                    this._battleNode[key],
                    NODE_Z_ORDER + (this._battleNode[key].isBossCard && this._battleNode[key].isBossCard() ? 1 : 0)
                );
            }
        }

        this._stepLabel = cc.LabelTTF.create("回合: 0 / " + BATTLE_MAX_STEP, "STHeitiTC-Medium", 24);
        this._stepLabel.setPosition(this._battleLayerFit.stepLabelPoint);
        this.addChild(this._stepLabel);

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
        this._backItem.setPosition(this._battleLayerFit.backItemPoint);

        this._menu = cc.Menu.create(this._backItem);
        this.addChild(this._menu);
        this._menu.setVisible(false);

        this._playSpeed = lz.load(gameData.player.get("uid") + "playSpeedTimes") || 1;

        for (var speed = 1; speed <= 3; ++speed) {

            this._chooseSpeedItem[speed] = cc.MenuItemImage.create(
                main_scene_image["button" + (70 + speed)],
                main_scene_image["button" + (70 + speed) + "s"],
                this._onClickChangePlaySpeed,
                this
            );

            this._chooseSpeedItem[speed].setPosition(this._battleLayerFit.chooseSpeedItemPoint);
            this._chooseSpeedItem[speed].setVisible(speed == this._playSpeed);

            this._menu.addChild(this._chooseSpeedItem[speed]);

        }

        return true;
    },

    play: function () {
        cc.log("BattleLayer play");

        var that = this;

        if (this._type == BOSS_BATTLE_LOG) {
            this.bossCeremony(function () {
                that.ownCeremony();
            })
        } else {
            this.ownCeremony();
        }

        this._menu.setVisible(true);
    },

    end: function () {
        cc.log("BattleLayer end");

        this._isEnd = true;

        this._menu.setVisible(false);

        this.stopAllActions();
        this.unscheduleAllCallbacks();

        BattlePlayer.getInstance().next();
    },

    tip: function (key, name, str, random) {
        cc.log("BattleLayer tip");

        var tipNode = cc.BuilderReader.load(main_scene_image.tipNode, this);
        tipNode.setPosition(this._getTipPoint(key, random));
        this.addChild(tipNode, TIP_Z_ORDER);

        if (tipNode) {
            if (str) {
                tipNode.controller.ccbLabel.setString(str);
            }

            tipNode.animationManager.runAnimationsForSequenceNamedTweenDuration(name, 0);
            tipNode.animationManager.setCompletedAnimationCallback(this, function () {
                tipNode.removeFromParent();
            });
        }
    },

    tipHarm: function (index, value, isSkill, isCirt, random) {
        cc.log("BattleLayer tipHarm");

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

        this.tip(index, name, str, random);
    },

    _getTipPoint: function (key, random) {
        var point0 = this._locate[key];

        if (!random) {
            return point0;
        }

        var x1 = point0.x - 40;
        var x2 = point0.x + 40;
        var y1 = point0.y - 85;
        var y2 = point0.y + 40;

        var lastTipPoint = cc.pAdd(point0, this._lastTipOffset || cc.p(0, 0));
        var ly1 = lastTipPoint.y - 30;
        var ly2 = lastTipPoint.y + 30;

        var yAreaList = [];

        if (ly1 > y1) {
            yAreaList.push({
                y1: y1,
                y2: ly1
            });
        }

        if (ly2 < y2) {
            yAreaList.push({
                y1: ly2,
                y2: y2
            })
        }

        var yArea = yAreaList[lz.randomInt(0, yAreaList.length)];

        point = cc.p(lz.random(x1, x2), lz.random(yArea.y1, yArea.y2));
        this._lastTipOffset = cc.pSub(point, point0);

        return point;
    },

    _getDirection: function (index, isOther) {
        if (isOther) {
            return (index < 7 ? "e" : "o");
        }

        return (index < 7 ? "o" : "e");
    },

    join: function (faction) {
        cc.log("BattleLayer join: " + faction);

        var limit = LINE_UP_CARD_LIMIT[faction];
        var card = this._battleLog.get("card");
        var index = 0;

        for (var i = limit.start; i <= limit.end; ++i) {
            if (this._battleNode[i]) {
                this._battleNode[i].removeFromParent();
                delete this._battleNode[i];
            }

            if (card[i] != undefined) {
                cc.log(card[i]);

                var locate = this._locate[i];

                if (typeof(card[i]) == "number") {
                    index = i;

                    this._battleNode[i] = BattleSpiritNode.create(card[i], i);
                    var spiritFrame = cc.Sprite.create(main_scene_image.spirit_frame);
                    this._battleNode[i].addChild(spiritFrame, -1);
                } else {
                    this._battleNode[i] = BattleCardNode.create(card[i], i);
                }

                this._battleNode[i].setPosition(locate);
                this._battleNode[i].setVisible(false);
                this.addChild(
                    this._battleNode[i],
                    NODE_Z_ORDER + (this._battleNode[i].isBossCard && this._battleNode[i].isBossCard() ? 1 : 0)
                );
            }
        }

        var that = this;
        this.ceremony(faction, function () {
            that.showSpiritAddition(index);
        })
    },

    ceremony: function (faction, cb) {
        cc.log("BattleLayer ceremony");

        var limit = LINE_UP_CARD_LIMIT[faction];
        var count = 0;

        for (var i = limit.start; i <= limit.end; ++i) {
            if (this._battleNode[i] != undefined) {
                count += 1;

                this._battleNode[i].setVisible(true);
                this._battleNode[i].runAnimations("beg", 0, function () {
                    count -= 1;

                    if (count == 0) {
                        if (cb) {
                            cb();
                        }
                    }
                });
            }
        }
    },

    ownCeremony: function () {
        cc.log("BattleLayer ownCeremony");

        for (var key in this._battleNode) {
            if (this._battleNode[key] != undefined) {
                var index = parseInt(key);

                this._battleNode[key].setVisible(true);

                if (this._getDirection(index) === "o") {
                    this._battleNode[key].runAnimations("beg", 0, this.began());
                }
            }
        }
    },

    bossCeremony: function (cb) {
        cc.log("BattleLayer bossCeremony");

        for (var key in this._battleNode) {
            if (this._battleNode[key] != undefined) {
                var index = parseInt(key);

                if (this._getDirection(index) === "e") {
                    this._battleNode[key].setVisible(true);
                }

                if (this._battleNode[key].isBossCard && this._battleNode[key].isBossCard()) {
                    this._battleNode[key].runAnimations("beg", 0, cb);
                }
            }
        }
    },

    began: function () {
        this._counter += 1;

        var that = this;
        return function () {
            that._counter -= 1;

            if (that._counter == 0) {
                var battleEffect8Node = cc.BuilderReader.load(main_scene_image.battleEffect8, that);
                battleEffect8Node.setPosition(that._battleLayerFit.vsNodePoint);
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

    showSpiritAddition: function (index) {
        cc.log("BattleLayer showSpiritAddition");

        if (this._isEnd) {
            return;
        }

        var that = this;
        if (!index) {
            while (this._index <= 12) {
                if (this._battleNode[this._index] && (this._battleNode[this._index] instanceof BattleSpiritNode)) {
                    index = this._index;
                    this._index += 1;
                    break;
                }

                this._index += 1;
            }
        }

        if (index) {
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

            return;
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
            this._battleNode[index].setZOrder(
                z + (this._battleNode[index].isBossCard && this._battleNode[index].isBossCard() ? 1 : 0)
            );
        } else {
            for (var key in this._battleNode) {
                this._battleNode[key].setZOrder(
                    z + (this._battleNode[key].isBossCard && this._battleNode[key].isBossCard() ? 1 : 0)
                );
            }
        }
    },

    nextStepCallback: function () {
        this._counter += 1;

        var that = this;
        return function () {
            that._counter -= 1;

            if (that._counter == 0) {
                that.scheduleOnce(that.nextStep, 0.1);
            }
        }
    },

    nextStep: function () {
        cc.log("BattleLayer nextStep");

        this._skillStep = {
            index: 0,
            step: []
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

    step: function (step) {
        cc.log("BattleLayer step");
        cc.log(step);

        if (typeof (step) == "string") {
            this.refreshStep(step);
        } else {
            this.battleStep(step);
        }
    },

    refreshStep: function (faction) {
        cc.log("BattleLayer refreshStep");

        var limit = LINE_UP_CARD_LIMIT[faction];
        var that = this;

        for (var i = limit.start; i <= limit.end; ++i) {
            if (this._battleNode[i] && (this._battleNode[i] instanceof BattleSpiritNode)) {
                this._battleNode[i].runAnimations("die", 0, function () {
                    that.join(faction);
                });
                return;
            }
        }

        this.join(faction);
    },

    battleStep: function (battleStep) {
        cc.log("BattleLayer battleStep");

        var step = battleStep.get("step");
        var attacker = battleStep.get("attacker");
        var fn = "";

        if (step) {
            this._stepLabel.setString("回合: " + step + " / " + BATTLE_MAX_STEP);
        }

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

                that.skill(fn, battleStep);
            };

            var addSubtitleNodeCb = function () {
                ccbNode.setPosition(that._battleLayerFit[that._getDirection(attacker) + "SubtitleNode"]);
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

            this.skill(fn, battleStep);
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

    startShock: function () {
        this.stopActionByTag(BATTLE_SHOCK_TAG);

        var action = cc.RepeatForever.create(
            cc.Sequence.create(
                cc.MoveTo.create(0.06, cc.p(0, 10)),
                cc.MoveTo.create(0.06, cc.p(0, -10))
            )
        );

        action.setTag(BATTLE_SHOCK_TAG);

        this.runAction(action);
    },

    stopShock: function () {
        this.stopActionByTag(BATTLE_SHOCK_TAG);

        var action = cc.Sequence.create(
            cc.MoveTo.create(0.06, cc.p(0, 7)),
            cc.MoveTo.create(0.06, cc.p(0, -7)),
            cc.MoveTo.create(0.06, cc.p(0, 3)),
            cc.MoveTo.create(0.06, cc.p(0, -3)),
            cc.MoveTo.create(0.06, cc.p(0, 0))
        );

        action.setTag(BATTLE_SHOCK_TAG);

        this.runAction(action);
    },

    ccbFnCallback: function () {
        cc.log("BattleLayer ccbFnCallback");

        var index = this._skillStep.index;
        var step = this._skillStep.step[index];

        if (step) {
            if (!step.times || --step.times <= 0) {
                index = step.fn();

                if (index != undefined) {
                    this._skillStep.index = index;
                } else {
                    this._skillStep.index += 1;
                }
            }
        }
    },

    _damageAssessed: function (t, n) {
        cc.log("BattleLayer damageAssessed");

        var k = t >= 0 ? 1 : -1;
        t = Math.abs(t);
        var damage = [];
        var index = 0;

        while (n > 0) {
            if (t > 0 && n > 1) {
                damage[index] = lz.randomInt(Math.ceil(t / n * DAMAGE_LOWER_LIMIT), Math.floor(t / n * DAMAGE_UPPER_LIMIT));
            } else {
                damage[index] = t;
            }

            t -= damage[index];
            damage[index] *= k;
            n -= 1;
            index += 1;
        }

        return damage;
    },

    skill: function (fn, battleStep) {
        cc.log("BattleLayer skill");

        if (!fn || !this[fn]) {
            fn = "skill1";
        }

        this[fn](battleStep);
        this.ccbFnCallback();
    },

    // card skill
    skill1: function (battleStep) {
        cc.log("skill1");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_1",
                        0,
                        that.nextStepCallback()
                    )
                }
            },
            {
                times: 1,
                fn: function () {
                    battleStep.recover();
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
                }
            }
        ];
    },

    skill2: function (battleStep) {
        cc.log("skill2");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_1",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
                    battleStep.recover();
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
                }
            }
        ];
    },

    skill3: function (battleStep) {
        cc.log("skill3");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        battleStep.recover();
        if (battleStep.hasNextTarget()) {
            var target = battleStep.getTarget();
            var targetLocate = this._locate[target];
            var targetNode = this._battleNode[target];
            var effect = battleStep.getEffect();
            var isCrit = battleStep.isCrit();
        }

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    var nextStepCallback1 = that.nextStepCallback();
                    var nextStepCallback2 = that.nextStepCallback();
                    var nextStepCallback3 = that.nextStepCallback();

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
                }
            },
            {
                times: 1,
                fn: function () {
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
                }
            }
        ];
    },

    skill4: function (battleStep) {
        cc.log("skill4");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_1",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
                    battleStep.recover();
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
                }
            }
        ];
    },

    skill5: function (battleStep) {
        cc.log("skill5");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_1",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect5_2 = cc.BuilderReader.load(main_scene_image.effect5_2, that);
                    effect5_2.setPosition(attackerLocate);
                    that.addChild(effect5_2, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect5_2.animationManager.setCompletedAnimationCallback(that, function () {
                        effect5_2.removeFromParent();
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

                            var effect5_1 = cc.BuilderReader.load(main_scene_image.effect5_1, that);
                            effect5_1.setPosition(attackerLocate);
                            that.addChild(effect5_1, EFFECT_Z_ORDER);

                            var effectNodeAnimationManager = effect5_1.animationManager;
                            var nextStepCallback1 = that.nextStepCallback();
                            effectNodeAnimationManager.setCompletedAnimationCallback(that, function () {
                                effect5_1.removeFromParent();

                                var effect5_3 = cc.BuilderReader.load(main_scene_image.effect5_3, that);
                                effect5_3.setPosition(targetLocate);
                                that.addChild(effect5_3, EFFECT_Z_ORDER);

                                var nextStepCallback2 = that.nextStepCallback();
                                effect5_3.animationManager.setCompletedAnimationCallback(that, function () {
                                    effect5_3.removeFromParent();
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
                }
            }
        ];
    },

    skill6: function (battleStep) {
        cc.log("skill6");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_1",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
                    battleStep.recover();
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
                }
            }
        ];
    },

    skill7: function (battleStep) {
        cc.log("skill7");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_1",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
                    battleStep.recover();
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
                }
            }
        ];
    },

    skill8: function (battleStep) {
        cc.log("skill8");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        battleStep.recover();

        if (battleStep.hasNextTarget()) {
            var target = battleStep.getTarget();
            var targetLocate = this._locate[target];
            var targetNode = this._battleNode[target];
            var effect = battleStep.getEffect();
            var isCrit = battleStep.isCrit();
        }

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    var nextStepCallback1 = that.nextStepCallback();
                    var nextStepCallback2 = that.nextStepCallback();
                    var nextStepCallback3 = that.nextStepCallback();

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
                }
            },
            {
                times: 1,
                fn: function () {
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
                }
            }
        ];
    },

    skill9: function (battleStep) {
        cc.log("skill9");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        battleStep.recover();

        if (battleStep.hasNextTarget()) {
            var target = battleStep.getTarget();
            var targetLocate = this._locate[target];
            var targetNode = this._battleNode[target];
            var effect = battleStep.getEffect();
            var isCrit = battleStep.isCrit();
        }

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    var nextStepCallback1 = that.nextStepCallback();
                    var nextStepCallback2 = that.nextStepCallback();
                    var nextStepCallback3 = that.nextStepCallback();

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
                }
            },
            {
                times: 1,
                fn: function () {
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
                }
            }
        ];
    },

    skill10: function (battleStep) {
        cc.log("skill10");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_1",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect10_1 = cc.BuilderReader.load(main_scene_image.effect10_1, that);
                    effect10_1.setPosition(attackerLocate);
                    that.addChild(effect10_1, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect10_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect10_1.removeFromParent();
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

                            var effect10_2 = cc.BuilderReader.load(main_scene_image.effect10_2, that);
                            effect10_2.setPosition(attackerLocate);
                            that.addChild(effect10_2, EFFECT_Z_ORDER);

                            var effectNodeAnimationManager = effect10_2.animationManager;
                            var nextStepCallback1 = that.nextStepCallback();
                            effectNodeAnimationManager.setCompletedAnimationCallback(that, function () {
                                effect10_2.removeFromParent();

                                var effect10_3 = cc.BuilderReader.load(main_scene_image.effect10_3, that);
                                effect10_3.setPosition(targetLocate);
                                that.addChild(effect10_3, EFFECT_Z_ORDER);

                                var nextStepCallback2 = that.nextStepCallback();
                                effect10_3.animationManager.setCompletedAnimationCallback(that, function () {
                                    effect10_3.removeFromParent();
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

                            effect10_2.runAction(
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
                }
            }
        ];
    },

    skill11: function (battleStep) {
        cc.log("skill11");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_1",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect11_1 = cc.BuilderReader.load(main_scene_image.effect11_1, that);
                    effect11_1.setPosition(attackerLocate);
                    that.addChild(effect11_1, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect11_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect11_1.removeFromParent();
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

                            var effect11_2 = cc.BuilderReader.load(main_scene_image.effect11_2, that);
                            effect11_2.setPosition(attackerLocate);
                            that.addChild(effect11_2, EFFECT_Z_ORDER);

                            var effectNodeAnimationManager = effect11_2.animationManager;
                            var nextStepCallback1 = that.nextStepCallback();
                            effectNodeAnimationManager.setCompletedAnimationCallback(that, function () {
                                effect11_2.removeFromParent();

                                var effect11_3 = cc.BuilderReader.load(main_scene_image.effect11_3, that);
                                effect11_3.setPosition(targetLocate);
                                that.addChild(effect11_3, EFFECT_Z_ORDER);

                                var nextStepCallback2 = that.nextStepCallback();
                                effect11_3.animationManager.setCompletedAnimationCallback(that, function () {
                                    effect11_3.removeFromParent();
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

                            var x = (attackerLocate.x + targetLocate.x) / 2;
                            var y = (attackerLocate.y + targetLocate.y) / 2;
                            var point = lz.checkPoint(cc.p(lz.random(x - 100, x + 100), y));

                            var pointArray = [
                                attackerLocate,
                                point,
                                targetLocate
                            ];

                            effect11_2.runAction(
                                cc.CardinalSplineTo.create(
                                    effectNodeAnimationManager.getSequenceDuration(
                                        effectNodeAnimationManager.getRunningSequenceName()
                                    ),
                                    pointArray,
                                    0
                                )
                            );
                        })();
                    }
                }
            }
        ];
    },

    skill12: function (battleStep) {
        cc.log("skill12");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        battleStep.recover();

        if (battleStep.hasNextTarget()) {
            var target = battleStep.getTarget();
            var targetLocate = this._locate[target];
            var targetNode = this._battleNode[target];
            var effect = battleStep.getEffect();
            var isCrit = battleStep.isCrit();
        }

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_11",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                time: 1,
                fn: function () {
                    var effect12_1 = cc.BuilderReader.load(main_scene_image.effect12_1, that);
                    effect12_1.setPosition(attackerLocate);
                    that.addChild(effect12_1, EFFECT_Z_ORDER);

                    if (that._getDirection(attacker) == "e") {
                        effect12_1.setRotation(180);
                    }

                    var nextStepCallback = that.nextStepCallback();
                    effect12_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect12_1.removeFromParent();
                        nextStepCallback();
                    });
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect12_2 = cc.BuilderReader.load(main_scene_image.effect12_2, that);
                    effect12_2.setPosition(targetLocate);
                    that.addChild(effect12_2, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect12_2.animationManager.setCompletedAnimationCallback(that, function () {
                        effect12_2.removeFromParent();
                        nextStepCallback();
                    });

                    targetNode.runAnimations(
                        effect ? ("d_1_" + that._getDirection(target)) : "miss",
                        0,
                        that.nextStepCallback()
                    );

                    targetNode.update(effect);
                    that.tipHarm(target, effect, false, isCrit);
                }
            }
        ];
    },

    skill300: function (battleStep) {
        cc.log("skill300");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_4",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect300_1 = cc.BuilderReader.load(main_scene_image.effect300_1, that);
                    effect300_1.setPosition(attackerLocate);
                    that.addChild(effect300_1, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect300_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect300_1.removeFromParent();
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
                }
            }
        ];
    },

    skill301: function (battleStep) {
        cc.log("skill301");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_4",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect301_1 = cc.BuilderReader.load(main_scene_image.effect301_1, that);
                    effect301_1.setPosition(attackerLocate);
                    that.addChild(effect301_1, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect301_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect301_1.removeFromParent();
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
                }
            }
        ];
    },

    skill302: function (battleStep) {
        cc.log("skill302");

        var that = this;

        var lineUpMidpoint = this._lineUpMidpoint;
        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_12",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect302_1 = cc.BuilderReader.load(main_scene_image.effect302_1, that);
                    effect302_1.setPosition(attackerLocate);
                    that.addChild(effect302_1, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect302_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect302_1.removeFromParent();
                        nextStepCallback();
                    });
                }
            },
            {
                times: 1,
                fn: function () {
                    battleStep.recover();
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

                    var effect302_3 = cc.BuilderReader.load(main_scene_image.effect302_3, that);
                    effect302_3.setPosition(lineUpMidpoint[that._getDirection(attacker)]);
                    that.addChild(effect302_3, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect302_3.animationManager.setCompletedAnimationCallback(that, function () {
                        effect302_3.removeFromParent();
                        nextStepCallback();
                    });
                }
            }
        ];
    },

    skill400: function (battleStep) {
        cc.log("skill400");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_3",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect400_1 = cc.BuilderReader.load(main_scene_image.effect400_1, that);
                    effect400_1.setPosition(attackerLocate);
                    that.addChild(effect400_1, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect400_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect400_1.removeFromParent();
                        nextStepCallback();
                    });
                }
            },
            {
                times: 1,
                fn: function () {
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

                            if (targetNode.isBossCard()) {
                                effect400_2.setScale(BOSS_CARD_SCALE);
                            }

                            var nextStepCallback = that.nextStepCallback();
                            effect400_2.animationManager.setCompletedAnimationCallback(that, function () {
                                effect400_2.removeFromParent();
                                nextStepCallback();
                            });
                        })();
                    }
                }
            },
            {
                times: targetLen,
                fn: function () {
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
                }
            }
        ];
    },

    skill401: function (battleStep) {
        cc.log("skill401");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        var fn = null;
        var point = attackerLocate;

        battleStep.recover();
        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_6",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                fn: function () {
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
                                    effect ? "d_8" : "miss",
                                    0,
                                    that.nextStepCallback()
                                );

                                targetNode.update(effect);
                                that.tipHarm(target, effect, true, isCrit);
                            };

                            point = targetLocate;
                        })();
                    }

                    return 1;
                }
            }
        ];
    },

    skill402: function (battleStep) {
        cc.log("skill402");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_3",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
                    battleStep.recover();
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

                            if (targetNode.isBossCard()) {
                                effect402.setScale(BOSS_CARD_SCALE);
                            }

                            var nextStepCallback = that.nextStepCallback();
                            effect402.animationManager.setCompletedAnimationCallback(that, function () {
                                effect402.removeFromParent();
                                nextStepCallback();
                            });

                            targetNode.runAnimations(
                                effect ? "d_4" : "miss",
                                0,
                                that.nextStepCallback()
                            );

                            targetNode.update(effect);
                            that.tipHarm(target, effect, true, isCrit);
                        })();
                    }
                }
            }
        ];
    },

    skill403: function (battleStep) {
        cc.log("skill403");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_6",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
                    battleStep.recover();
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
                }
            }
        ];
    },

    skill404: function (battleStep) {
        cc.log("skill404");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    var nextStepCallback1 = that.nextStepCallback();
                    var nextStepCallback2 = that.nextStepCallback();
                    var nextStepCallback3 = that.nextStepCallback();

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
                            cc.MoveTo.create(time, that._battleMidpoint)
                        );
                    };

                    fn1();
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect404_1 = cc.BuilderReader.load(main_scene_image.effect404_1, that);
                    effect404_1.setPosition(that._battleMidpoint);
                    that.addChild(effect404_1, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect404_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect404_1.removeFromParent();
                        nextStepCallback();
                    });
                }
            },
            {
                times: 1,
                fn: function () {
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

                            if (targetNode.isBossCard()) {
                                effect404_2.setScale(BOSS_CARD_SCALE);
                            }

                            var nextStepCallback = that.nextStepCallback();
                            effect404_2.animationManager.setCompletedAnimationCallback(that, function () {
                                effect404_2.removeFromParent();
                                nextStepCallback();
                            });

                            targetNode.runAnimations(
                                effect ? "d_5" : "miss",
                                0,
                                that.nextStepCallback()
                            );

                            targetNode.update(effect);
                            that.tipHarm(target, effect, true, isCrit);
                        })();
                    }
                }
            }
        ];
    },

    skill405: function (battleStep) {
        cc.log("skill405");

        var that = this;

        var lineUpMidpoint = this._lineUpMidpoint;
        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_3",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect405_1 = cc.BuilderReader.load(main_scene_image.effect405_1, that);
                    effect405_1.setPosition(attackerLocate);
                    that.addChild(effect405_1, EFFECT_Z_ORDER);

                    var nextStepCallback1 = that.nextStepCallback();
                    effect405_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect405_1.removeFromParent();
                        nextStepCallback1();
                    });
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect405_2 = cc.BuilderReader.load(main_scene_image.effect405_2, that);
                    effect405_2.setPosition(lineUpMidpoint[that._getDirection(attacker, true)]);
                    that.addChild(effect405_2, EFFECT_Z_ORDER);

                    var nextStepCallback2 = that.nextStepCallback();
                    effect405_2.animationManager.setCompletedAnimationCallback(that, function () {
                        effect405_2.removeFromParent();
                        nextStepCallback2();
                    });
                }
            },
            {
                times: 1,
                fn: function () {
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
                }
            }
        ];
    },

    skill500: function (battleStep) {
        cc.log("skill500");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    var nextStepCallback1 = that.nextStepCallback();
                    var nextStepCallback2 = that.nextStepCallback();
                    var nextStepCallback3 = that.nextStepCallback();

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
                            cc.MoveTo.create(time, that._battleMidpoint)
                        );
                    };

                    fn1();
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect500_1 = cc.BuilderReader.load(main_scene_image.effect500_1, that);
                    effect500_1.setPosition(that._battleMidpoint);
                    that.addChild(effect500_1, EFFECT_Z_ORDER);

                    if (that._getDirection(attacker) == "e") {
                        effect500_1.setRotation(180);
                    }

                    var nextStepCallback = that.nextStepCallback();
                    effect500_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect500_1.removeFromParent();
                        nextStepCallback();
                    });
                }
            },
            {
                times: 1,
                fn: function () {
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

                            if (targetNode.isBossCard()) {
                                effect500_2.setScale(BOSS_CARD_SCALE);
                            }

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
                }
            }
        ];
    },

    skill501: function (battleStep) {
        cc.log("skill501");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_3",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
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

                            if (targetNode.isBossCard()) {
                                effect501.setScale(BOSS_CARD_SCALE);
                            }

                            var nextStepCallback = that.nextStepCallback();
                            effect501.animationManager.setCompletedAnimationCallback(that, function () {
                                effect501.removeFromParent();
                                nextStepCallback();
                            });
                        })();
                    }
                }
            },
            {
                times: targetLen,
                fn: function () {
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
                }
            }
        ];
    },

    skill502: function (battleStep) {
        cc.log("skill502");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    var nextStepCallback1 = that.nextStepCallback();
                    var nextStepCallback2 = that.nextStepCallback();
                    var nextStepCallback3 = that.nextStepCallback();

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
                            cc.MoveTo.create(time, that._battleMidpoint)
                        );
                    };

                    fn1();
                }
            },
            {
                times: 1,
                fn: function () {
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

                            if (targetNode.isBossCard()) {
                                effect502.setScale(BOSS_CARD_SCALE);
                            }

                            var nextStepCallback = that.nextStepCallback();
                            effect502.animationManager.setCompletedAnimationCallback(that, function () {
                                effect502.removeFromParent();
                                nextStepCallback();
                            });
                        })();
                    }
                }
            },
            {
                times: targetLen,
                fn: function () {
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
                }
            }
        ];
    },

    skill503: function (battleStep) {
        cc.log("skill503");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    var nextStepCallback1 = that.nextStepCallback();
                    var nextStepCallback2 = that.nextStepCallback();
                    var nextStepCallback3 = that.nextStepCallback();

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
                            cc.MoveTo.create(time, that._battleMidpoint)
                        );
                    };

                    fn1();
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect503_1 = cc.BuilderReader.load(main_scene_image.effect503_1, that);
                    effect503_1.setPosition(that._battleMidpoint);
                    that.addChild(effect503_1, EFFECT_Z_ORDER);

                    if (that._getDirection(attacker) == "e") {
                        effect503_1.setRotation(180);
                    }

                    var nextStepCallback1 = that.nextStepCallback();
                    effect503_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect503_1.removeFromParent();
                        nextStepCallback1();
                    });

                    var effect503_2 = cc.BuilderReader.load(main_scene_image.effect503_2, that);
                    effect503_2.setPosition(that._battleLayerFit[that._getDirection(attacker, true) + "SubtitleNode"]);
                    that.addChild(effect503_2, EFFECT_Z_ORDER);

                    if (that._getDirection(attacker) == "e") {
                        effect503_2.setRotation(180);
                    }

                    var nextStepCallback2 = that.nextStepCallback();
                    effect503_2.animationManager.setCompletedAnimationCallback(that, function () {
                        effect503_2.removeFromParent();
                        nextStepCallback2();
                    });
                }
            },
            {
                times: 1,
                fn: function () {
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
                }
            }
        ];
    },

    skill600: function (battleStep) {
        cc.log("skill600");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    var nextStepCallback1 = that.nextStepCallback();
                    var nextStepCallback2 = that.nextStepCallback();
                    var nextStepCallback3 = that.nextStepCallback();

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
                            cc.MoveTo.create(time, that._battleMidpoint)
                        );
                    };

                    fn1();
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect600_1 = cc.BuilderReader.load(main_scene_image.effect600_1, that);
                    effect600_1.setPosition(that._battleMidpoint);
                    that.addChild(effect600_1, EFFECT_Z_ORDER);

                    if (that._getDirection(attacker) == "e") {
                        effect600_1.setRotation(180);
                    }

                    var nextStepCallback = that.nextStepCallback();
                    effect600_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect600_1.removeFromParent();
                        nextStepCallback();
                    });
                }
            },
            {
                times: 1,
                fn: function () {
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
                }
            }
        ];
    },

    skill601: function (battleStep) {
        cc.log("skill601");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    var nextStepCallback1 = that.nextStepCallback();
                    var nextStepCallback2 = that.nextStepCallback();
                    var nextStepCallback3 = that.nextStepCallback();

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
                            cc.MoveTo.create(time, that._battleMidpoint)
                        );
                    };

                    fn1();
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect601_1 = cc.BuilderReader.load(main_scene_image.effect601_1, that);
                    effect601_1.setPosition(attackerNode.getPosition());
                    that.addChild(effect601_1, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect601_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect601_1.removeFromParent();
                        nextStepCallback();
                    });
                }
            },
            {
                times: 1,
                fn: function () {
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

                            if (targetNode.isBossCard()) {
                                effect601_2.setScale(BOSS_CARD_SCALE);
                            }

                            var nextStepCallback = that.nextStepCallback();
                            effect601_2.animationManager.setCompletedAnimationCallback(that, function () {
                                effect601_2.removeFromParent();
                                nextStepCallback();
                            });
                        })();
                    }
                }
            },
            {
                times: targetLen,
                fn: function () {
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
                }
            }
        ];
    },

    skill700: function (battleStep) {
        cc.log("skill700");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_9_" + that._getDirection(attacker),
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
                    var point = null;

                    battleStep.recover();
                    while (battleStep.hasNextTarget()) {
                        var targetLocate = that._locate[battleStep.getTarget()];
                        point = point ? cc.p((targetLocate.x + point.x) / 2, (targetLocate.y + point.y) / 2) : targetLocate;
                    }

                    var effect700_1 = cc.BuilderReader.load(main_scene_image.effect700_1, that);
                    effect700_1.setPosition(attackerLocate);
                    that.addChild(effect700_1, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect700_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect700_1.removeFromParent();
                        nextStepCallback();
                    });

                    effect700_1.setRotation(lz.getAngle(attackerLocate, point));
                }
            },
            {
                times: 1,
                fn: function () {
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
                }
            }
        ];
    },

    skill701: function (battleStep) {
        cc.log("skill701");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        battleStep.recover();
        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_3",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect701_1 = cc.BuilderReader.load(main_scene_image.effect701_1, that);
                    effect701_1.setPosition(attackerLocate);
                    that.addChild(effect701_1, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect701_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect701_1.removeFromParent();
                        nextStepCallback();
                    });
                }
            },
            {
                fn: function () {
                    if (battleStep.hasNextTarget()) {
                        (function () {
                            var target = battleStep.getTarget();
                            var targetLocate = that._locate[target];
                            var targetNode = that._battleNode[target];
                            var effect = battleStep.getEffect();
                            var isCrit = battleStep.isCrit();

                            var effect701_2 = cc.BuilderReader.load(main_scene_image.effect701_2, that);
                            effect701_2.setPosition(attackerLocate);
                            that.addChild(effect701_2, EFFECT_Z_ORDER);

                            var effectNodeAnimationManager = effect701_2.animationManager;
                            var nextStepCallback1 = that.nextStepCallback();
                            effectNodeAnimationManager.setCompletedAnimationCallback(that, function () {
                                effect701_2.removeFromParent();

                                var effect701_3 = cc.BuilderReader.load(main_scene_image.effect701_3, that);
                                effect701_3.setPosition(targetLocate);
                                that.addChild(effect701_3, EFFECT_Z_ORDER);

                                var nextStepCallback2 = that.nextStepCallback();
                                effect701_3.animationManager.setCompletedAnimationCallback(that, function () {
                                    effect701_3.removeFromParent();
                                    nextStepCallback2();
                                });

                                targetNode.runAnimations(
                                    effect ? ("d_2_" + that._getDirection(target)) : "miss",
                                    0,
                                    that.nextStepCallback()
                                );

                                targetNode.update(effect);
                                that.tipHarm(target, effect, true, isCrit);

                                nextStepCallback1();
                            });

                            effect701_2.runAction(
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

                    return 2;
                }
            }
        ];
    },

    skill702: function (battleStep) {
        cc.log("skill702");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_3",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
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

                            var effect702_1 = cc.BuilderReader.load(main_scene_image.effect702_1, that);
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

                            var x = (attackerLocate.x + targetLocate.x) / 2;
                            var y = (attackerLocate.y + targetLocate.y) / 2;
                            var point = lz.checkPoint(cc.p(lz.random(x - 200, x + 200), y));

                            var pointArray = [
                                attackerLocate,
                                point,
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
                }
            },
            {
                times: targetLen,
                fn: function () {
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
                }
            }
        ];
    },

    skill800: function (battleStep) {
        cc.log("skill800");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_2_" + that._getDirection(attacker),
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
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
                }
            },
            {
                times: targetLen,
                fn: function () {
                    battleStep.recover();
                    while (battleStep.hasNextTarget()) {
                        (function () {
                            var target = battleStep.getTarget();
                            var targetLocate = that._locate[target];
                            var targetNode = that._battleNode[target];
                            var effect = battleStep.getEffect();
                            var isCrit = battleStep.isCrit();

                            targetNode.runAnimations(
                                effect ? "d_7" : "miss",
                                0,
                                that.nextStepCallback()
                            );

                            targetNode.update(effect);
                            that.tipHarm(target, effect, true, isCrit);
                        })();
                    }
                }
            }
        ];
    },

    skill801: function (battleStep) {
        cc.log("skill801");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        battleStep.recover();
        if (battleStep.hasNextTarget()) {
            var target = battleStep.getTarget();
            var targetLocate = this._locate[target];
            var targetNode = this._battleNode[target];
            var effect = battleStep.getEffect();
            var isCrit = battleStep.isCrit();
        }

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    var nextStepCallback1 = that.nextStepCallback();
                    var nextStepCallback2 = that.nextStepCallback();
                    var nextStepCallback3 = that.nextStepCallback();
                    var nextStepCallback4 = that.nextStepCallback();

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
                }
            }
        ];
    },

    skill802: function (battleStep) {
        cc.log("skill802");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_2_" + that._getDirection(attacker),
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
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
                }
            },
            {
                times: targetLen,
                fn: function () {
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
                }
            }
        ];
    },

    skill803: function (battleStep) {
        cc.log("skill803");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_2_" + that._getDirection(attacker),
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
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
                }
            },
            {
                times: targetLen,
                fn: function () {
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
                }
            }
        ];
    },

    skill804: function (battleStep) {
        cc.log("skill804");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_2_" + that._getDirection(attacker),
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
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
                }
            },
            {
                times: targetLen,
                fn: function () {
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
                }
            }
        ];
    },

    skill805: function (battleStep) {
        cc.log("skill805");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_2_" + that._getDirection(attacker),
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
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
                }
            },
            {
                times: targetLen,
                fn: function () {
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
                }
            }
        ];
    },

    skill806: function (battleStep) {
        cc.log("skill806");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_2_" + that._getDirection(attacker),
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
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
                }
            },
            {
                times: targetLen,
                fn: function () {
                    battleStep.recover();
                    while (battleStep.hasNextTarget()) {
                        (function () {
                            var target = battleStep.getTarget();
                            var targetLocate = that._locate[target];
                            var targetNode = that._battleNode[target];
                            var effect = battleStep.getEffect();
                            var isCrit = battleStep.isCrit();

                            targetNode.runAnimations(
                                effect ? "d_6" : "miss",
                                0,
                                that.nextStepCallback()
                            );

                            targetNode.update(effect);
                            that.tipHarm(target, effect, true, isCrit);
                        })();
                    }
                }
            }
        ];
    },

    skill807: function (battleStep) {
        cc.log("skill807");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_3",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect807_1 = cc.BuilderReader.load(main_scene_image.effect807_1, that);
                    effect807_1.setPosition(attackerLocate);
                    that.addChild(effect807_1, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect807_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect807_1.removeFromParent();
                        nextStepCallback();
                    });
                }
            },
            {
                times: 1,
                fn: function () {
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
                }
            },
            {
                times: targetLen,
                fn: function () {
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
                }
            }
        ];
    },

    // boss skill
    skill1001: function (battleStep) {
        cc.log("skill1001");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_1001",
                        0,
                        that.nextStepCallback()
                    )
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect1001_1 = cc.BuilderReader.load(main_scene_image.effect1001_1, that);
                    effect1001_1.setPosition(attackerLocate);
                    that.addChild(effect1001_1, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect1001_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect1001_1.removeFromParent();
                        nextStepCallback();
                    });
                }
            },
            {
                times: 1,
                fn: function () {
                    battleStep.recover();
                    while (battleStep.hasNextTarget()) {
                        (function () {
                            var target = battleStep.getTarget();
                            var targetLocate = that._locate[target];
                            var targetNode = that._battleNode[target];
                            var effect = battleStep.getEffect();
                            var isCrit = battleStep.isCrit();

                            var effect1001_2 = cc.BuilderReader.load(main_scene_image.effect1001_2, that);
                            effect1001_2.setPosition(attackerLocate);
                            that.addChild(effect1001_2, EFFECT_Z_ORDER);

                            var effectNodeAnimationManager = effect1001_2.animationManager;
                            var nextStepCallback1 = that.nextStepCallback();
                            effectNodeAnimationManager.setCompletedAnimationCallback(that, function () {
                                effect1001_2.removeFromParent();

                                var effect1001_3 = cc.BuilderReader.load(main_scene_image.effect1001_3, that);
                                effect1001_3.setPosition(targetLocate);
                                that.addChild(effect1001_3, EFFECT_Z_ORDER);

                                var nextStepCallback2 = that.nextStepCallback();
                                effect1001_3.animationManager.setCompletedAnimationCallback(that, function () {
                                    effect1001_3.removeFromParent();
                                    nextStepCallback2();
                                });

                                targetNode.runAnimations(
                                    effect ? "d_1001" : "miss",
                                    0,
                                    that.nextStepCallback()
                                );

                                targetNode.update(effect);
                                that.tipHarm(target, effect, false, isCrit);

                                nextStepCallback1();
                            });

                            effect1001_2.controller.ccbNode.setRotation(lz.getAngle(attackerLocate, targetLocate));

                            effect1001_2.runAction(
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
                }
            }
        ];
    },

    skill1002: function (battleStep) {
        cc.log("skill1002");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        battleStep.recover();
        if (battleStep.hasNextTarget()) {
            var target = battleStep.getTarget();
            var targetLocate = this._locate[target];
            var targetNode = this._battleNode[target];
            var effect = battleStep.getEffect();
            var isCrit = battleStep.isCrit();
            var len = 2;
            var damageList = this._damageAssessed(effect, len);
            var index = 0;
        }

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_1002",
                        0,
                        that.nextStepCallback()
                    )
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect1002_1 = cc.BuilderReader.load(main_scene_image.effect1002_1, that);
                    effect1002_1.setPosition(attackerLocate);
                    that.addChild(effect1002_1, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect1002_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect1002_1.removeFromParent();
                        nextStepCallback();
                    });

                    if (that._getDirection(attacker) == "e") {
                        effect1002_1.setRotation(180);
                    }
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect1002_2 = cc.BuilderReader.load(main_scene_image.effect1002_2, that);
                    effect1002_2.setPosition(targetLocate);
                    that.addChild(effect1002_2, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect1002_2.animationManager.setCompletedAnimationCallback(that, function () {
                        effect1002_2.removeFromParent();
                        nextStepCallback();
                    });
                }
            },
            {
                times: 1,
                fn: function () {
                    targetNode.runAnimations(
                        effect ? "d_1002" : "miss",
                        0,
                        that.nextStepCallback()
                    );

                    if (effect == 0) {
                        that.tipHarm(target, effect, false, isCrit);
                    }
                }
            },
            {
                fn: function () {
                    var damage = damageList[index++];

                    targetNode.update(damage);
                    that.tipHarm(target, damage, false, isCrit, true);

                    return 4;
                }
            }
        ];
    },

    skill1003: function (battleStep) {
        cc.log("skill1003");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_1003",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
                    battleStep.recover();
                    while (battleStep.hasNextTarget()) {
                        (function () {
                            var target = battleStep.getTarget();
                            var targetLocate = that._locate[target];
                            var targetNode = that._battleNode[target];
                            var effect = battleStep.getEffect();
                            var isCrit = battleStep.isCrit();

                            var effect1003_1 = cc.BuilderReader.load(main_scene_image.effect1003_1, that);
                            effect1003_1.setPosition(attackerLocate);
                            that.addChild(effect1003_1, EFFECT_Z_ORDER);

                            var nextStepCallback1 = that.nextStepCallback();
                            effect1003_1.animationManager.setCompletedAnimationCallback(that, function () {
                                effect1003_1.removeFromParent();
                                nextStepCallback1();
                            });

                            var k = lz.getDistance(attackerLocate, targetLocate) / 960;
                            effect1003_1.setScaleX(k);
                            effect1003_1.setScaleY(k);
                            effect1003_1.setRotation(lz.getAngle(attackerLocate, targetLocate));
                        })();
                    }
                }
            },
            {
                times: 1,
                fn: function () {
                    battleStep.recover();
                    while (battleStep.hasNextTarget()) {
                        (function () {
                            var target = battleStep.getTarget();
                            var targetLocate = that._locate[target];
                            var targetNode = that._battleNode[target];
                            var effect = battleStep.getEffect();
                            var isCrit = battleStep.isCrit();

                            var effect1003_2 = cc.BuilderReader.load(main_scene_image.effect1003_2, that);
                            effect1003_2.setPosition(targetLocate);
                            that.addChild(effect1003_2, EFFECT_Z_ORDER);

                            var nextStepCallback2 = that.nextStepCallback();
                            effect1003_2.animationManager.setCompletedAnimationCallback(that, function () {
                                effect1003_2.removeFromParent();
                                nextStepCallback2();
                            });

                            targetNode.runAnimations(
                                effect ? "d_1003" : "miss",
                                0,
                                that.nextStepCallback()
                            );

                            targetNode.update(effect);
                            that.tipHarm(target, effect, false, isCrit);
                        })();
                    }
                }
            }
        ];
    },

    skill1700: function (battleStep) {
        cc.log("skill1700");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_1700",
                        0,
                        that.nextStepCallback()
                    );
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect1700_1 = cc.BuilderReader.load(main_scene_image.effect1700_1, that);
                    effect1700_1.setPosition(attackerLocate);
                    that.addChild(effect1700_1, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect1700_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect1700_1.removeFromParent();
                        nextStepCallback();

                        that.stopShock();
                    });
                }
            },
            {
                times: 1,
                fn: function () {
                    that.startShock();

                    battleStep.recover();
                    while (battleStep.hasNextTarget()) {
                        (function () {
                            var target = battleStep.getTarget();
                            var targetLocate = that._locate[target];
                            var targetNode = that._battleNode[target];
                            var effect = battleStep.getEffect();
                            var isCrit = battleStep.isCrit();

                            var effect1700_2 = cc.BuilderReader.load(main_scene_image.effect1700_2, that);
                            effect1700_2.setPosition(targetLocate);
                            that.addChild(effect1700_2, EFFECT_Z_ORDER);

                            var nextStepCallback = that.nextStepCallback();
                            effect1700_2.animationManager.setCompletedAnimationCallback(that, function () {
                                effect1700_2.removeFromParent();
                                nextStepCallback();
                            });
                        })();
                    }
                }
            },
            {
                times: targetLen,
                fn: function () {
                    battleStep.recover();
                    while (battleStep.hasNextTarget()) {
                        (function () {
                            var target = battleStep.getTarget();
                            var targetLocate = that._locate[target];
                            var targetNode = that._battleNode[target];
                            var effect = battleStep.getEffect();
                            var isCrit = battleStep.isCrit();

                            targetNode.runAnimations(
                                effect ? "d_1700" : "miss",
                                0,
                                that.nextStepCallback()
                            );

                            targetNode.update(effect);
                            that.tipHarm(target, effect, true, isCrit);
                        })();
                    }
                }
            }
        ];
    },

    skill1800: function (battleStep) {
        cc.log("skill1800");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_1800",
                        0,
                        that.nextStepCallback()
                    )
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect1800_1 = cc.BuilderReader.load(main_scene_image.effect1800_1, that);
                    effect1800_1.setPosition(attackerLocate);
                    that.addChild(effect1800_1, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect1800_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect1800_1.removeFromParent();
                        nextStepCallback();
                    });
                }
            },
            {
                times: 1,
                fn: function () {
                    battleStep.recover();
                    while (battleStep.hasNextTarget()) {
                        (function () {
                            var target = battleStep.getTarget();
                            var targetLocate = that._locate[target];
                            var targetNode = that._battleNode[target];
                            var effect = battleStep.getEffect();
                            var isCrit = battleStep.isCrit();

                            var effect1800_3 = cc.BuilderReader.load(main_scene_image.effect1800_3, that);
                            effect1800_3.setPosition(attackerLocate);
                            that.addChild(effect1800_3, EFFECT_Z_ORDER);

                            var effect1800_2 = cc.BuilderReader.load(main_scene_image.effect1800_2, that);
                            effect1800_2.setPosition(attackerLocate);
                            that.addChild(effect1800_2, EFFECT_Z_ORDER);

                            var effectNodeAnimationManager = effect1800_2.animationManager;
                            var nextStepCallback1 = that.nextStepCallback();
                            effectNodeAnimationManager.setCompletedAnimationCallback(that, function () {
                                effect1800_2.removeFromParent();

                                var effect1800_4 = cc.BuilderReader.load(main_scene_image.effect1800_4, that);
                                effect1800_4.setPosition(targetLocate);
                                that.addChild(effect1800_4, EFFECT_Z_ORDER);

                                var nextStepCallback3 = that.nextStepCallback();
                                effect1800_4.animationManager.setCompletedAnimationCallback(that, function () {
                                    effect1800_4.removeFromParent();
                                    nextStepCallback3();
                                });

                                targetNode.runAnimations(
                                    effect ? "d_1800" : "miss",
                                    0,
                                    that.nextStepCallback()
                                );

                                targetNode.update(effect);
                                that.tipHarm(target, effect, true, isCrit);

                                nextStepCallback1();
                            });

                            var nextStepCallback2 = that.nextStepCallback();
                            effect1800_3.animationManager.setCompletedAnimationCallback(that, function () {
                                effect1800_3.removeFromParent();
                                nextStepCallback2();
                            });

                            var action = cc.EaseSineIn.create(
                                cc.MoveTo.create(
                                    effectNodeAnimationManager.getSequenceDuration(
                                        effectNodeAnimationManager.getRunningSequenceName()
                                    ),
                                    targetLocate
                                )
                            );

                            effect1800_2.setRotation(lz.getAngle(attackerLocate, targetLocate));
                            effect1800_2.runAction(action.clone());
                            effect1800_3.runAction(action);
                        })();
                    }
                }
            }
        ];
    },

    skill1801: function (battleStep) {
        cc.log("skill1801");

        var that = this;

        var attacker = battleStep.get("attacker");
        var attackerNode = this._battleNode[attacker];
        var attackerLocate = this._locate[attacker];
        var targetLen = battleStep.get("targetLen");

        battleStep.recover();
        if (battleStep.hasNextTarget()) {
            var target = battleStep.getTarget();
            var targetLocate = this._locate[target];
            var targetNode = this._battleNode[target];
            var effect = battleStep.getEffect();
            var isCrit = battleStep.isCrit();
            var len = 6;
            var damageList = this._damageAssessed(effect, len);
            var index = 0;
        }

        var isFirst = true;

        this._skillStep.step = [
            {
                times: 1,
                fn: function () {
                    that._battleNode[attacker].runAnimations(
                        "a_1801",
                        0,
                        that.nextStepCallback()
                    )
                }
            },
            {
                times: 1,
                fn: function () {
                    var effect1801_1 = cc.BuilderReader.load(main_scene_image.effect1801_1, that);
                    effect1801_1.setPosition(attackerLocate);
                    that.addChild(effect1801_1, EFFECT_Z_ORDER);

                    var nextStepCallback = that.nextStepCallback();
                    effect1801_1.animationManager.setCompletedAnimationCallback(that, function () {
                        effect1801_1.removeFromParent();
                        nextStepCallback();
                    });
                }
            },
            {
                fn: function () {
                    var isLeft = index % 2 != 0;
                    var damage = damageList[index++];
                    var point = cc.pAdd(attackerLocate, cc.p(isLeft ? -100 : 100, 0));

                    var effect1801_2 = cc.BuilderReader.load(main_scene_image.effect1801_2, that);
                    effect1801_2.setPosition(point);
                    that.addChild(effect1801_2, EFFECT_Z_ORDER + 1);

                    if (!isLeft) {
                        effect1801_2.setScaleX(-1);
                    }

                    var effectNodeAnimationManager = effect1801_2.animationManager;
                    var nextStepCallback1 = that.nextStepCallback();
                    effectNodeAnimationManager.setCompletedAnimationCallback(that, function () {
                        effect1801_2.removeFromParent();

                        if (isFirst) {
                            isFirst = false;

                            var effect1801_3 = cc.BuilderReader.load(main_scene_image.effect1801_3, that);
                            effect1801_3.setPosition(targetLocate);
                            that.addChild(effect1801_3, EFFECT_Z_ORDER);

                            var nextStepCallback2 = that.nextStepCallback();
                            effect1801_3.animationManager.setCompletedAnimationCallback(that, function () {
                                effect1801_3.removeFromParent();
                                nextStepCallback2();
                            });

                            targetNode.runAnimations(
                                effect ? "d_1801" : "miss",
                                0,
                                that.nextStepCallback()
                            );

                            that.startShock();
                        }

                        if (index >= len) {
                            that.stopShock();
                        }

                        targetNode.update(damage);
                        that.tipHarm(target, damage, true, isCrit, true);

                        nextStepCallback1();
                    });

                    effect1801_2.setRotation(lz.getAngle(point, targetLocate));

                    effect1801_2.runAction(
                        cc.EaseSineIn.create(
                            cc.MoveTo.create(
                                effectNodeAnimationManager.getSequenceDuration(
                                    effectNodeAnimationManager.getRunningSequenceName()
                                ),
                                targetLocate
                            )
                        )
                    );

                    return 2;
                }
            }
        ];
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
        cc.log("BattleLayer releaseSpirit");

        for (var i = 0; i < count; ++i) {
            this._addSpirit(index);
        }
    },

    _collectSpirit: function () {
        cc.log("BattleLayer _collectSpirit");

        var len = this._spiritNode.length;

        if (!len) {
            this.end();
        }

        if (this._battleLog.isWin()) {
            if (len) {
                var index = this._battleLog.getSpirit("o");

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

      //  if (player.get("lv") >= 10 && player.getRemainDays(MONTH_CARD) > 0) {
            this.end();
      //  } else {
      //      TipLayer.tip("月卡玩家10级可跳过");
      //  }
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
            if (lv < 5) {
                TipLayer.tip("vip1或5级开启2倍速");
            } else if (this._playSpeed == 3) {
                TipLayer.tip("vip2开启3倍速");
            } else {
                cc.Director.getInstance().getScheduler().setTimeScale(BATTLE_PLAY_SPEEDS[this._playSpeed]);
                lz.save(gameData.player.get("uid") + "playSpeedTimes", this._playSpeed);

                for (var i = 1; i <= 3; i++) {
                    this._chooseSpeedItem[i].setVisible(i == this._playSpeed);
                }
            }
        } else { // vip玩家
            if (this._playSpeed == 3 && vip < 2) {
                TipLayer.tip("vip2开启3倍速");
            } else {
                cc.Director.getInstance().getScheduler().setTimeScale(BATTLE_PLAY_SPEEDS[this._playSpeed]);
                lz.save(gameData.player.get("uid") + "playSpeedTimes", this._playSpeed);

                for (var i = 1; i <= 3; i++) {
                    this._chooseSpeedItem[i].setVisible(i == this._playSpeed);
                }
            }
        }
    }
});


BattleLayer.create = function (battleLog) {
    var ret = new BattleLayer();

    if (ret && ret.init(battleLog)) {
        return ret;
    }

    return null;
};