/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-7
 * Time: 上午10:25
 * To change this template use File | Settings | File Templates.
 */


/*
 * passive skill upgrade label
 * */


var USE_NULL = 0;
var USE_MONEY = 1;
var USE_GOLD = 2;

var STOP_UNTIL_NULL = 0;
var STOP_UNTIL_BLUE = 1;
var STOP_UNTIL_YELLOW = 2;

var USE_MONEY_CONSUME = 5000;
var USE_GOLD_CONSUME = 20;


var PassiveSkillAfreshLabel = cc.Layer.extend({
    _passiveSkillAfreshLabelFit: null,

    _leadCard: null,
    _leadCardHeadNode: null,
    _nameLabel: null,
    _lvLabel: null,
    _resLabel: null,
    _useMoneyItem: null,
    _useGoldItem: null,
    _useType: USE_NULL,
    _stopTypeLabel: null,
    _stopType: STOP_UNTIL_NULL,
    _passiveSkillList: [],
    _afreshIdList: [],
    _afreshItem: null,
    _repeatAfreshItem: null,
    _startItem: null,
    _cancelItem: null,
    _shyLayer: null,
    _selectLeadCardIcon: null,

    onEnter: function () {
        cc.log("PassiveSkillAfreshLabel onEnter");

        this._super();
        this.update();

        lz.um.beginLogPageView("被动洗炼界面");
    },

    onExit: function () {
        cc.log("PassiveSkillAfreshLabel onExit");

        this._super();

        lz.um.endLogPageView("被动洗炼界面");
    },

    init: function () {
        cc.log("PassiveSkillAfreshLabel init");

        if (!this._super()) return false;

        this._passiveSkillAfreshLabelFit = gameFit.mainScene.passiveSkillAfreshLabel;

        this._selectId = 0;

        var cardItemBgSprite = cc.Sprite.create(main_scene_image.icon68);
        cardItemBgSprite.setPosition(this._passiveSkillAfreshLabelFit.cardItemBgSpritePoint);
        this.addChild(cardItemBgSprite);

        this._nameLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 22);
        this._nameLabel.setColor(cc.c3b(255, 239, 131));
        this._nameLabel.setAnchorPoint(cc.p(0, 0.5));
        this._nameLabel.setPosition(this._passiveSkillAfreshLabelFit.nameLabelPoint);
        this.addChild(this._nameLabel);

        this._lvLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 22);
        this._lvLabel.setAnchorPoint(cc.p(0, 0.5));
        this._lvLabel.setPosition(this._passiveSkillAfreshLabelFit.lvLabelPoint);
        this.addChild(this._lvLabel);

        this._resLabel = cc.Node.create();
        this._resLabel.setAnchorPoint(cc.p(0, 0));
        this._resLabel.setPosition(this._passiveSkillAfreshLabelFit.resLabelPoint);
        this.addChild(this._resLabel, 1);

        var resLabelBgSprite = cc.Sprite.create(main_scene_image.icon424);
        resLabelBgSprite.setAnchorPoint(cc.p(0, 0));
        resLabelBgSprite.setPosition(this._passiveSkillAfreshLabelFit.resLabelBgSpritePoint);
        this._resLabel.addChild(resLabelBgSprite);

        this._fullAttributeLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 18);
        this._fullAttributeLabel.setPosition(cc.p(360, 349));
        this._resLabel.addChild(this._fullAttributeLabel);

        this._tipLabel = cc.LabelTTF.create("魔石洗炼获得金色属性概率提升100倍", "STHeitiTC-Medium", 22);
        this._tipLabel.setColor(cc.c3b(255, 239, 131));
        this._tipLabel.setPosition(this._passiveSkillAfreshLabelFit.tipLabelPoint);
        this._resLabel.addChild(this._tipLabel);

        var resMenu = cc.Menu.create();
        resMenu.setPosition(cc.p(0, 0));
        this._resLabel.addChild(resMenu, 1);

        for (var i = 0; i < 3; ++i) {
            var y = this._passiveSkillAfreshLabelFit.basePointY - this._passiveSkillAfreshLabelFit.offsetPointY * i;

            var passiveSkillBgSprite = cc.Sprite.create(main_scene_image.icon65);
            passiveSkillBgSprite.setAnchorPoint(cc.p(0, 0.5));
            passiveSkillBgSprite.setPosition(cc.p(10, y));
            this._resLabel.addChild(passiveSkillBgSprite);

            var nameLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 28);
            nameLabel.setPosition(cc.p(100, y));
            this._resLabel.addChild(nameLabel, 2);

            var valueLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 28);
            valueLabel.setPosition(cc.p(330, y));
            this._resLabel.addChild(valueLabel, 2);

            var lockNameIcon = cc.Sprite.create(main_scene_image.icon425);
            lockNameIcon.setPosition(cc.p(187, y - 2));
            lockNameIcon.setVisible(false);
            this._resLabel.addChild(lockNameIcon, 2);

            var lockValueIcon = cc.Sprite.create(main_scene_image.icon425);
            lockValueIcon.setPosition(cc.p(417, y - 2));
            lockValueIcon.setVisible(false);
            this._resLabel.addChild(lockValueIcon, 2);

            var lockNameItem = cc.MenuItemImage.create(
                main_scene_image.button79,
                main_scene_image.button79s,
                this._onClickLockName(i),
                this
            );
            lockNameItem.setPosition(cc.p(120, y));
            resMenu.addChild(lockNameItem);

            var lockValueItem = cc.MenuItemImage.create(
                main_scene_image.button79,
                main_scene_image.button79s,
                this._onClickLockValue(i),
                this
            );
            lockValueItem.setPosition(cc.p(350, y));
            resMenu.addChild(lockValueItem);

            this._passiveSkillList[i] = {
                nameLabel: nameLabel,
                valueLabel: valueLabel,
                lockNameIcon: lockNameIcon,
                lockValueIcon: lockValueIcon,
                lockNameItem: lockNameItem,
                lockValueItem: lockValueItem,
                lockStatue: LOCK_TYPE_DEFAULT
            }
        }

        var changeItem = cc.MenuItemImage.create(
            main_scene_image.button80,
            main_scene_image.button80s,
            this._onClickChange,
            this
        );
        changeItem.setPosition(cc.p(455, 380));
        resMenu.addChild(changeItem);

        this._useMoneyItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            main_scene_image.button25d,
            this._onClickUseMoney,
            this
        );
        this._useMoneyItem.setPosition(cc.p(60, 92));
        resMenu.addChild(this._useMoneyItem);

        this._useGoldItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            main_scene_image.button25d,
            this._onClickUseGold,
            this
        );
        this._useGoldItem.setPosition(cc.p(280, 92));
        resMenu.addChild(this._useGoldItem);

        var moneyIcon = cc.Sprite.create(main_scene_image.icon149);
        moneyIcon.setPosition(cc.p(100, 92));
        this._resLabel.addChild(moneyIcon);

        var moneyLabel = cc.LabelTTF.create(USE_MONEY_CONSUME + " / 次", "STHeitiTC-Medium", 20);
        moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        moneyLabel.setPosition(cc.p(130, 90));
        this._resLabel.addChild(moneyLabel);

        var goldIcon = cc.Sprite.create(main_scene_image.icon148);
        goldIcon.setPosition(cc.p(325, 92));
        this._resLabel.addChild(goldIcon);

        var goldLabel = cc.LabelTTF.create(USE_GOLD_CONSUME + " / 次", "STHeitiTC-Medium", 20);
        goldLabel.setAnchorPoint(cc.p(0, 0.5));
        goldLabel.setPosition(cc.p(350, 90));
        this._resLabel.addChild(goldLabel);

        this._stopTypeLabel = cc.Node.create();
        this._stopTypeLabel.setAnchorPoint(cc.p(0, 0));
        this._stopTypeLabel.setPosition(this._passiveSkillAfreshLabelFit.stopTypeLabelPoint);
        this.addChild(this._stopTypeLabel, 2);
        this._stopTypeLabel.setVisible(false);

        var stopTypeBgSprite = cc.Sprite.create(main_scene_image.bg16);
        stopTypeBgSprite.setAnchorPoint(cc.p(0, 0));
        this._stopTypeLabel.addChild(stopTypeBgSprite);

        var blueLabel = cc.Sprite.create(main_scene_image.icon50);
        blueLabel.setScaleX(0.91);
        blueLabel.setScaleY(0.4);
        blueLabel.setAnchorPoint(cc.p(0, 0.5));
        blueLabel.setPosition(cc.p(0, 178));
        this._stopTypeLabel.addChild(blueLabel);

        var yellowLabel = cc.Sprite.create(main_scene_image.icon50);
        yellowLabel.setScaleX(0.91);
        yellowLabel.setScaleY(0.4);
        yellowLabel.setAnchorPoint(cc.p(0, 0.5));
        yellowLabel.setPosition(cc.p(0, 96));
        this._stopTypeLabel.addChild(yellowLabel);

        var stopTypeMenu = cc.Menu.create();
        stopTypeMenu.setPosition(cc.p(0, 0));
        this._stopTypeLabel.addChild(stopTypeMenu);

        this._stopUntilBlueItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            main_scene_image.button25d,
            this._onClickStopUntilBlue,
            this
        );
        this._stopUntilBlueItem.setPosition(cc.p(60, 178));
        stopTypeMenu.addChild(this._stopUntilBlueItem);

        this._stopUntilYellowItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            main_scene_image.button25d,
            this._onClickStopUntilYellow,
            this
        );
        this._stopUntilYellowItem.setPosition(cc.p(60, 96));
        stopTypeMenu.addChild(this._stopUntilYellowItem);


        this._selectLeadCardIcon = cc.Sprite.create(main_scene_image.icon11);
        this._selectLeadCardIcon.setPosition(this._passiveSkillAfreshLabelFit.selectLeadCardIconPoint);
        this.addChild(this._selectLeadCardIcon);

        var selectLeadCardItem = cc.MenuItemImage.create(
            main_scene_image.card_item_bg1,
            main_scene_image.card_item_bg_s,
            this._onClickSelectLeadCard,
            this
        );
        selectLeadCardItem.setPosition(this._passiveSkillAfreshLabelFit.selectLeadCardItemPoint);

        this._afreshItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon69,
            this._onClickAfresh,
            this
        );
        this._afreshItem.setPosition(this._passiveSkillAfreshLabelFit.afreshItemPoint);

        this._repeatAfreshItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon70,
            this._onClickRepeatAfresh,
            this
        );
        this._repeatAfreshItem.setPosition(this._passiveSkillAfreshLabelFit.repeatAfreshItemPoint);

        this._startItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon71,
            this._onClickStart,
            this
        );
        this._startItem.setPosition(this._passiveSkillAfreshLabelFit.startItemPoint);
        this._startItem.setVisible(false);

        this._cancelItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon72,
            this._onClickCancel,
            this
        );
        this._cancelItem.setPosition(this._passiveSkillAfreshLabelFit.cancelItemPoint);
        this._cancelItem.setVisible(false);

        var helpItem = cc.MenuItemImage.create(
            main_scene_image.button41,
            main_scene_image.button41s,
            this._onClickHelp,
            this
        );
        helpItem.setPosition(this._passiveSkillAfreshLabelFit.helpItemPoint);

        var menu = cc.Menu.create(
            selectLeadCardItem,
            this._afreshItem,
            this._repeatAfreshItem,
            this._startItem,
            this._cancelItem,
            helpItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 2);

        this._shyLayer = ShyLayer.create(function () {
            TipLayer.tip("请先关闭自动洗炼");
        });
        this.addChild(this._shyLayer);

        var stopItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon73,
            this._onClickStop,
            this
        );
        stopItem.setPosition(this._passiveSkillAfreshLabelFit.stopItemPoint);

        var shyLayerMenu = cc.Menu.create(stopItem);
        shyLayerMenu.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
        shyLayerMenu.setPosition(cc.p(0, 0));
        this._shyLayer.addChild(shyLayerMenu);

        this._shyLayer.setVisible(false);

        this._reset();

        this._useType = USE_MONEY;
        this._useMoneyItem.setEnabled(false);
        this._useGoldItem.setEnabled(true);

        return true;
    },

    update: function (isAfresh) {
        cc.log("PassiveSkillAfreshLabel update");

        if (this._leadCard) {
            if (this._leadCardHeadNode == null) {
                this._leadCardHeadNode = CardHeadNode.create(this._leadCard);
                this._leadCardHeadNode.setPosition(this._passiveSkillAfreshLabelFit.leadCardHeadNodePoint);
                this.addChild(this._leadCardHeadNode, 2);
            }

            this._nameLabel.setString(this._leadCard.get("name"));
            this._nameLabel.setVisible(true);

            this._lvLabel.setString("LV: " + this._leadCard.get("lv"));
            this._lvLabel.setVisible(true);

            var star = this._leadCard.get("star");
            var table = outputTables.passive_skill_config.rows[star];
            this._fullAttributeLabel.setString("最高加成" + table.full_attribute.toFixed(1) + "%");

            var passiveSkillCount = 0;
            var lockNum = 0;
            var passiveSkill = this._leadCard.getPassiveSkillById(this._selectId);
            var maxValue = 0.0;
            this._afreshIdList = [];

            for (var key in passiveSkill) {
                var passiveSkillLabel = this._passiveSkillList[passiveSkillCount++];
                var lock = passiveSkillLabel.lockStatue;

                if (lock != LOCK_TYPE_BOTH) {
                    var ps = {
                        id: passiveSkill[key].id,
                        lock: lock
                    };
                    this._afreshIdList.push(ps);
                }

                var value = passiveSkill[key].value.toFixed(1);
                if (value > maxValue) {
                    maxValue = value;
                }

                if (value == table.full_attribute) {
                    passiveSkillLabel.valueLabel.setString("+ " + value + "% (满)");
                } else {
                    passiveSkillLabel.valueLabel.setString("+ " + value + "%");
                }

                if (value >= table.yellow_attribute) {
                    passiveSkillLabel.valueLabel.setColor(cc.c3b(255, 248, 69));
                } else if (value >= table.blue_attribute) {
                    passiveSkillLabel.valueLabel.setColor(cc.c3b(105, 218, 255));
                } else {
                    passiveSkillLabel.valueLabel.setColor(cc.c3b(118, 238, 60));
                }

                passiveSkillLabel.nameLabel.setString(passiveSkill[key].description);

                passiveSkillLabel.nameLabel.setVisible(true);
                passiveSkillLabel.valueLabel.setVisible(true);
                passiveSkillLabel.lockNameItem.setEnabled(true);
                passiveSkillLabel.lockValueItem.setEnabled(true);

                if (lock == LOCK_TYPE_BOTH) {
                    lockNum += 2;
                } else if (lock != LOCK_TYPE_DEFAULT) {
                    lockNum += 1;
                } else {
                    if (isAfresh) {
                        var valueLabel = passiveSkillLabel.valueLabel;

                        var callFunc = cc.CallFunc.create(function () {
                            gameData.sound.playEffect(main_scene_image.passive_skill_afresh, false);
                        }, this);

                        valueLabel.runAction(
                            cc.Sequence.create(
                                cc.Spawn.create(cc.FadeIn.create(0.8), callFunc)
                            )
                        );
                    }
                }
            }

            if (maxValue == 10.0 && isAfresh) {
                var effect = cc.BuilderReader.load(main_scene_image.uiEffect26, this);
                effect.setPosition(this._passiveSkillAfreshLabelFit.effectPoint);
                this.addChild(effect, 2);
                effect.animationManager.setCompletedAnimationCallback(this, function () {
                    effect.removeFromParent();
                });
            }

            if (lockNum == 2 * passiveSkillCount - 1) {
                for (var i = 0; i < passiveSkillCount; ++i) {
                    var passiveSkillLabel = this._passiveSkillList[i];
                    if (passiveSkillLabel.lockStatue != LOCK_TYPE_BOTH) {
                        if (passiveSkillLabel.lockStatue != LOCK_TYPE_NAME) {
                            passiveSkillLabel.lockNameItem.setEnabled(false);
                        } else {
                            passiveSkillLabel.lockValueItem.setEnabled(false);

                        }
                        break;
                    }
                }
            }
        }

        var isEnabled = (this._leadCard && this._useType != USE_NULL);
        this._afreshItem.setEnabled(isEnabled);
        this._repeatAfreshItem.setEnabled(isEnabled);
        this._startItem.setEnabled(isEnabled && (this._stopType != STOP_UNTIL_NULL));
    },

    _updateStopLabel: function () {

        if (this._stopUntilBlueIcon) {
            this._stopUntilBlueIcon.removeFromParent();
            this._stopUntilBlueIcon = null;
        }

        if (this._stopUntilYellowIcon) {
            this._stopUntilYellowIcon.removeFromParent();
            this._stopUntilYellowIcon = null;
        }

        var star = this._leadCard.get("star");
        var table = outputTables.passive_skill_config.rows[star];

        this._stopUntilBlueIcon = ColorLabelTTF.create({
            string: "出现",
            fontName: "STHeitiTC-Medium",
            fontSize: 20
        }, {
            string: "蓝色",
            fontName: "STHeitiTC-Medium",
            fontSize: 20,
            color: cc.c3b(105, 218, 255)
        }, {
            string: "属性以上停止洗炼 ",
            fontName: "STHeitiTC-Medium",
            fontSize: 20
        }, {
            string: "(",
            fontName: "STHeitiTC-Medium",
            fontSize: 20
        }, {
            string: table.blue_attribute.toFixed(1) + "%",
            fontName: "STHeitiTC-Medium",
            fontSize: 20,
            color: cc.c3b(105, 218, 255)
        }, {
            string: " - ",
            fontName: "STHeitiTC-Medium",
            fontSize: 20
        }, {
            string: table.full_attribute.toFixed(1) + "%",
            fontName: "STHeitiTC-Medium",
            fontSize: 20,
            color: cc.c3b(255, 248, 69)
        }, {
            string: ")",
            fontName: "STHeitiTC-Medium",
            fontSize: 20
        });

        this._stopUntilBlueIcon.setAnchorPoint(cc.p(0, 0));
        this._stopUntilBlueIcon.setPosition(cc.p(80, 178));
        this._stopTypeLabel.addChild(this._stopUntilBlueIcon);

        this._stopUntilYellowIcon = ColorLabelTTF.create({
            string: "出现",
            fontName: "STHeitiTC-Medium",
            fontSize: 20
        }, {
            string: "金色",
            fontName: "STHeitiTC-Medium",
            fontSize: 20,
            color: cc.c3b(255, 248, 69)
        }, {
            string: "属性以上停止洗炼 ",
            fontName: "STHeitiTC-Medium",
            fontSize: 20
        }, {
            string: "(",
            fontName: "STHeitiTC-Medium",
            fontSize: 20
        }, {
            string: table.yellow_attribute.toFixed(1) + "%",
            fontName: "STHeitiTC-Medium",
            fontSize: 20,
            color: cc.c3b(255, 248, 69)
        }, {
            string: " - ",
            fontName: "STHeitiTC-Medium",
            fontSize: 20
        }, {
            string: table.full_attribute.toFixed(1) + "%",
            fontName: "STHeitiTC-Medium",
            fontSize: 20,
            color: cc.c3b(255, 248, 69)
        }, {
            string: ")",
            fontName: "STHeitiTC-Medium",
            fontSize: 20
        });
        this._stopUntilYellowIcon.setAnchorPoint(cc.p(0, 0));
        this._stopUntilYellowIcon.setPosition(cc.p(80, 96));
        this._stopTypeLabel.addChild(this._stopUntilYellowIcon);
    },

    _canAfresh: function () {
        if (!this._leadCard) {
            TipLayer.tip("请选择主卡");

            return false;
        }

        if (this._useType == USE_NULL) {
            TipLayer.tip("请选择类型");

            return false;
        }

        var player = gameData.player;

        if (this._useType == USE_GOLD) {
            if (player.get("gold") < USE_GOLD_CONSUME) {
                TipLayer.tip("魔石不足");

                return false;
            }
        }

        if (this._useType == USE_MONEY) {
            if (player.get("money") < USE_MONEY_CONSUME) {
                TipLayer.tip("仙币不足");

                return false;
            }
        }

        return true;
    },

    _reset: function () {
        cc.log("PassiveSkillAfreshLabel _reset");

        if (this._leadCardHeadNode != null) {
            this._leadCardHeadNode.removeFromParent();
            this._leadCardHeadNode = null;
        }

        this._selectLeadCardIcon.stopAllActions();
        this._selectLeadCardIcon.setOpacity(255);

        this._selectLeadCardIcon.runAction(
            cc.RepeatForever.create(
                cc.Sequence.create(
                    cc.FadeOut.create(2),
                    cc.FadeIn.create(2)
                )
            )
        );

        this._nameLabel.setString("");
        this._nameLabel.setVisible(false);

        this._lvLabel.setString("LV: 0");
        this._lvLabel.setVisible(false);

        this._resLabel.setVisible(true);

        this._resetPassiveSkillLabel();
    },

    _resetPassiveSkillLabel: function () {
        for (var i = 0; i < 3; ++i) {
            var passiveSkillLabel = this._passiveSkillList[i];

            passiveSkillLabel.nameLabel.setVisible(false);
            passiveSkillLabel.valueLabel.setVisible(false);
            passiveSkillLabel.lockNameItem.setEnabled(false);
            passiveSkillLabel.lockValueItem.setEnabled(false);
            passiveSkillLabel.lockNameIcon.setVisible(false);
            passiveSkillLabel.lockValueIcon.setVisible(false);
            passiveSkillLabel.lockStatue = LOCK_TYPE_DEFAULT;
            passiveSkillLabel.id = 0;
        }

        this._afreshIdList = [];
    },

    _afresh: function (isRepeatAfresh) {
        cc.log("PassiveSkillAfreshLabel _afresh");

        var that = this;

        this._leadCard.afreshPassiveSkill(function (isCanAfresh) {
            if (isRepeatAfresh) {
                that._afreshCallBack(isCanAfresh);
            }

            that.update(isCanAfresh);
        }, this._selectId, this._afreshIdList, this._useType);
    },

    _repeatAfresh: function () {
        cc.log("PassiveSkillAfreshLabel _repeatAfresh");

        this._afresh(true);
    },

    _afreshCallBack: function (isCanAfresh) {
        cc.log("PassiveSkillAfreshLabel _afreshCallBack: " + this._stopType);

        var passiveSkill = this._leadCard.getPassiveSkillById(this._selectId);
        var maxValue = 0;
        var len = this._afreshIdList.length;
        for (var i = 0; i < len; ++i) {
            var lock = this._afreshIdList[i].lock;
            if (lock != LOCK_TYPE_VALUE && lock != LOCK_TYPE_BOTH) {
                maxValue = Math.max(maxValue, passiveSkill[this._afreshIdList[i].id].value);
            }
        }

        var star = this._leadCard.get("star");
        var table = outputTables.passive_skill_config.rows[star];

        if (isCanAfresh) {
            if (this._stopType == STOP_UNTIL_BLUE) {
                if (maxValue >= table.yellow_attribute) {
                    TipLayer.tip("人品爆发，惊现金色属性，洗炼完毕");
                    this._onClickStop();
                } else if (maxValue >= table.blue_attribute) {
                    TipLayer.tip("人品爆发，出现蓝色属性，洗炼完毕");
                    this._onClickStop();
                }
            } else if (this._stopType == STOP_UNTIL_YELLOW) {
                if (maxValue >= table.yellow_attribute) {
                    TipLayer.tip("人品爆发，惊现金色属性，洗炼完毕");
                    this._onClickStop();
                }
            }
        } else {
            this._onClickStop();
        }
    },

    _setTip: function () {
        var str = this._tipLabel.getString();
        var len = str.length;

        if (len > 8) {
            str = "正在洗炼中";
        } else {
            str = "正在洗炼中";

            len = len - 4;
            if (len > 3) len = 0;

            for (var i = 0; i < len; ++i) {
                str += ".";
            }
        }

        this._tipLabel.setString(str);
    },

    _onClickSelectLeadCard: function () {
        cc.log("PassiveSkillAfreshLabel _onClickSelectLeadCard");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (mandatoryTeachingLayer) {
            if (mandatoryTeachingLayer.isTeaching()) {
                mandatoryTeachingLayer.clearAndSave();
                mandatoryTeachingLayer.next();
            }
        }

        var that = this;
        var cardListLayer = CardListLayer.create(SELECT_TYPE_PASSIVE_SKILL_AFRESH_MASTER, function (data) {
            cc.log(data);

            if (data) {
                var leadCard = data[0] || null;

                if (leadCard !== that._leadCard) {
                    that._reset();
                    that._leadCard = leadCard;
                    that._selectId = leadCard.getActivePassiveSkillId();
                }
            }

            that.getParent().backToThisLayer();

            cc.log("this._leadCard :");
            cc.log(that._leadCard);
        }, {
            leadCard: this._leadCard
        });

        this.getParent().switchToCardListLayer(cardListLayer);
    },

    _onClickLockName: function (index) {
        return function () {
            cc.log("PassiveSkillAfreshLabel _onClickLockName: " + index);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var passiveSkill = this._passiveSkillList[index];
            var statue = passiveSkill.lockStatue;

            if (statue == LOCK_TYPE_NAME || statue == LOCK_TYPE_BOTH) {
                statue -= LOCK_TYPE_NAME;
            } else {
                statue += LOCK_TYPE_NAME;
            }

            passiveSkill.lockStatue = statue;
            passiveSkill.lockNameIcon.setVisible(statue == LOCK_TYPE_NAME || statue == LOCK_TYPE_BOTH);

            this.update();
        }
    },

    _onClickLockValue: function (index) {
        return function () {
            cc.log("PassiveSkillAfreshLabel _onClickLock: " + index);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var passiveSkill = this._passiveSkillList[index];
            var statue = passiveSkill.lockStatue;

            if (statue == LOCK_TYPE_VALUE || statue == LOCK_TYPE_BOTH) {
                statue -= LOCK_TYPE_VALUE;
            } else {
                statue += LOCK_TYPE_VALUE;
            }

            passiveSkill.lockStatue = statue;
            passiveSkill.lockValueIcon.setVisible(statue == LOCK_TYPE_VALUE || statue == LOCK_TYPE_BOTH);

            this.update();
        }
    },

    _onClickUseMoney: function () {
        cc.log("PassiveSkillAfreshLabel _onClickUseMoney");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._useType = USE_MONEY;
        this._useMoneyItem.setEnabled(false);
        this._useGoldItem.setEnabled(true);

        this.update();
    },

    _onClickUseGold: function () {
        cc.log("PassiveSkillAfreshLabel _onClickUseGold");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._useType = USE_GOLD;
        this._useMoneyItem.setEnabled(true);
        this._useGoldItem.setEnabled(false);

        this.update();
    },

    _onClickStopUntilBlue: function () {
        cc.log("PassiveSkillAfreshLabel _onClickStopUntilBlue");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._stopType = STOP_UNTIL_BLUE;
        this._stopUntilBlueItem.setEnabled(false);
        this._stopUntilYellowItem.setEnabled(true);

        this.update();
    },

    _onClickStopUntilYellow: function () {
        cc.log("PassiveSkillAfreshLabel _onClickStopUntilYellow");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._stopType = STOP_UNTIL_YELLOW;
        this._stopUntilBlueItem.setEnabled(true);
        this._stopUntilYellowItem.setEnabled(false);

        this.update();
    },

    _onClickAfresh: function () {
        cc.log("PassiveSkillAfreshLabel _onClickAfresh");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (!this._canAfresh()) {
            return;
        }

        if (mandatoryTeachingLayer) {
            if (mandatoryTeachingLayer.isTeaching()) {
                mandatoryTeachingLayer.clearAndSave();
                mandatoryTeachingLayer.next();
            }
        }

        var passiveSkill = this._leadCard.getPassiveSkillById(this._selectId);
        var isTip = false;
        var len = this._afreshIdList.length;

        var star = this._leadCard.get("star");
        var table = outputTables.passive_skill_config.rows[star];

        for (var i = 0; i < len; i++) {
            var id = this._afreshIdList[i].id;
            if (this._afreshIdList[i].lock != LOCK_TYPE_VALUE) {
                if (passiveSkill[id].value >= table.yellow_attribute) {
                    isTip = true;
                    break;
                }
            }
        }

        var that = this;
        var cb = function() {
            that._afresh();
        };

        if (isTip) {
            AdvancedTipsLabel.pop(TYPE_PASSIVE_SKILL_AFRESH_TIPS, cb);
        } else {
            this._afresh();
        }
    },

    _onClickRepeatAfresh: function () {
        cc.log("PassiveSkillAfreshLabel _onClickRepeatAfresh");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (!this._canAfresh()) {
            return;
        }

        this._updateStopLabel();

        this._resLabel.setVisible(false);
        this._afreshItem.setVisible(false);
        this._repeatAfreshItem.setVisible(false);
        this._stopTypeLabel.setVisible(true);
        this._startItem.setVisible(true);
        this._cancelItem.setVisible(true);
        this._shyLayer.setVisible(false);
    },

    _onClickStart: function () {
        cc.log("PassiveSkillAfreshLabel _onClickStart");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var passiveSkill = this._leadCard.getPassiveSkillById(this._selectId);
        var isTip = false;
        var len = this._afreshIdList.length;

        var star = this._leadCard.get("star");
        var table = outputTables.passive_skill_config.rows[star];

        for (var i = 0; i < len; i++) {
            var id = this._afreshIdList[i].id;
            if (this._afreshIdList[i].lock != LOCK_TYPE_VALUE) {
                if (passiveSkill[id].value >= table.yellow_attribute) {
                    isTip = true;
                    break;
                }
            }
        }

        var that = this;
        var cb = function () {
            that._resLabel.setVisible(true);
            that._afreshItem.setVisible(false);
            that._repeatAfreshItem.setVisible(false);
            that._stopTypeLabel.setVisible(false);
            that._startItem.setVisible(false);
            that._cancelItem.setVisible(false);
            that._shyLayer.setVisible(true);

            that._setTip();

            that.schedule(that._repeatAfresh, 1);
            that.schedule(that._setTip, 1);
        };

        if (isTip) {
            AdvancedTipsLabel.pop(TYPE_PASSIVE_SKILL_AFRESH_TIPS, cb);
        } else {
            cb();
        }
    },

    _onClickCancel: function () {
        cc.log("PassiveSkillAfreshLabel _onClickCancel");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._resLabel.setVisible(true);
        this._afreshItem.setVisible(true);
        this._repeatAfreshItem.setVisible(true);
        this._stopTypeLabel.setVisible(false);
        this._startItem.setVisible(false);
        this._cancelItem.setVisible(false);
        this._shyLayer.setVisible(false);
    },

    _onClickStop: function () {
        cc.log("PassiveSkillAfreshLabel _onClickStop");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._resLabel.setVisible(true);
        this._afreshItem.setVisible(true);
        this._repeatAfreshItem.setVisible(true);
        this._stopTypeLabel.setVisible(false);
        this._startItem.setVisible(false);
        this._cancelItem.setVisible(false);
        this._shyLayer.setVisible(false);

        this.unschedule(this._repeatAfresh);
        this.unschedule(this._setTip);

        this._tipLabel.setString("魔石洗炼获得金色属性概率提升100倍");
    },

    _onClickChange: function () {
        cc.log("PassiveSkillAfreshLabel _onClickChange");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (!this._leadCard) {
            TipLayer.tip("请先选择卡牌");
            return;
        }

        var that = this;
        var cb = function (id) {
            cc.log(id);
            if (id != that._selectId) {
                that._selectId = id;
                that._resetPassiveSkillLabel();
                that.update();
            }
        };

        PassiveSkillLabel.pop(
            {
                id: this._selectId,
                card: this._leadCard,
                cb: cb
            }
        );
    },

    _onClickHelp: function () {
        cc.log("PassiveSkillAfreshLabel _onClickHelp");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        GameHelpLabel.pop(gameHelp["passiveSkillAfresh"]);
    }
});


PassiveSkillAfreshLabel.create = function () {
    var ret = new PassiveSkillAfreshLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};

PassiveSkillAfreshLabel.canEnter = function () {
    var limitLv = outputTables.function_limit.rows[1].pass_skillafresh;
    var lv = gameData.player.get("lv");

    if (lv >= limitLv) {
        return true;
    }

    TipLayer.tip("技能洗练" + limitLv + "级开放");

    return false;
};