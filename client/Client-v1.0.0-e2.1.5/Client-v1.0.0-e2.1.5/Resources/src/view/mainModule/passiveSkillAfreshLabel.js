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

var PassiveSkillAfreshLabel = cc.Layer.extend({
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
    },

    init: function () {
        cc.log("PassiveSkillAfreshLabel init");

        if (!this._super()) return false;

        var cardItemBgSprite = cc.Sprite.create(main_scene_image.icon68);
        cardItemBgSprite.setPosition(cc.p(328, 725));
        this.addChild(cardItemBgSprite);

        this._nameLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 22);
        this._nameLabel.setColor(cc.c3b(255, 239, 131));
        this._nameLabel.setAnchorPoint(cc.p(0, 0.5));
        this._nameLabel.setPosition(cc.p(243, 742));
        this.addChild(this._nameLabel);

        this._lvLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 22);
        this._lvLabel.setColor(cc.c3b(255, 239, 131));
        this._lvLabel.setAnchorPoint(cc.p(0, 0.5));
        this._lvLabel.setPosition(cc.p(245, 708));
        this.addChild(this._lvLabel);

        this._resLabel = cc.Node.create();
        this._resLabel.setAnchorPoint(cc.p(0, 0));
        this._resLabel.setPosition(cc.p(133, 300));
        this.addChild(this._resLabel, 1);

        var resLabelBgSprite = cc.Sprite.create(main_scene_image.icon66);
        resLabelBgSprite.setAnchorPoint(cc.p(0, 0));
        this._resLabel.addChild(resLabelBgSprite);

        var tipLabel = cc.LabelTTF.create("最高加成10.0%", "STHeitiTC-Medium", 18);
        tipLabel.setColor(cc.c3b(255, 239, 131));
        tipLabel.setPosition(cc.p(380, 349));
        this._resLabel.addChild(tipLabel);

        this._tipLabel = cc.LabelTTF.create("魔石洗炼获得金色属性概率提升100倍", "STHeitiTC-Medium", 18);
        this._tipLabel.setColor(cc.c3b(255, 239, 131));
        this._tipLabel.setPosition(cc.p(227, 45));
        this._resLabel.addChild(this._tipLabel);

        var resMenu = cc.Menu.create();
        resMenu.setPosition(cc.p(0, 0));
        this._resLabel.addChild(resMenu);

        for (var i = 0; i < 3; ++i) {
            var y = 308 - 78 * i;

            var passiveSkillBgSprite = cc.Sprite.create(main_scene_image.icon65);
            passiveSkillBgSprite.setAnchorPoint(cc.p(0, 0.5));
            passiveSkillBgSprite.setPosition(cc.p(0, y));
            this._resLabel.addChild(passiveSkillBgSprite);

            var nameLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 28);
            nameLabel.setPosition(cc.p(80, y));
            this._resLabel.addChild(nameLabel);

            var valueLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 28);
            valueLabel.setPosition(cc.p(190, y));
            this._resLabel.addChild(valueLabel);
            valueLabel.setVisible(false);

            var lockIcon = cc.Sprite.create(main_scene_image.icon200);
            lockIcon.setPosition(cc.p(310, y));
            this._resLabel.addChild(lockIcon);
            lockIcon.setScale(0.6);

            var lockItem = cc.MenuItemImage.create(
                main_scene_image.button24,
                main_scene_image.button24s,
                this._onClickLock(i),
                this
            );
            lockItem.setPosition(cc.p(385, y));
            resMenu.addChild(lockItem);

            var hookLabel = cc.Sprite.create(main_scene_image.icon20);
            hookLabel.setPosition(cc.p(360, y));
            this._resLabel.addChild(hookLabel);

            this._passiveSkillList[i] = {
                nameLabel: nameLabel,
                valueLabel: valueLabel,
                hookLabel: hookLabel,
                lockIcon: lockIcon,
                lockItem: lockItem,
                isLock: false
            }
        }

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

        var moneyLabel = cc.LabelTTF.create("20000 / 次", "STHeitiTC-Medium", 20);
        moneyLabel.setColor(cc.c3b(255, 239, 131));
        moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        moneyLabel.setPosition(cc.p(130, 90));
        this._resLabel.addChild(moneyLabel);

        var goldIcon = cc.Sprite.create(main_scene_image.icon148);
        goldIcon.setPosition(cc.p(325, 92));
        this._resLabel.addChild(goldIcon);

        var goldLabel = cc.LabelTTF.create("10 / 次", "STHeitiTC-Medium", 20);
        goldLabel.setColor(cc.c3b(255, 239, 131));
        goldLabel.setAnchorPoint(cc.p(0, 0.5));
        goldLabel.setPosition(cc.p(350, 90));
        this._resLabel.addChild(goldLabel);


        this._stopTypeLabel = cc.Node.create();
        this._stopTypeLabel.setAnchorPoint(cc.p(0, 0));
        this._stopTypeLabel.setPosition(cc.p(106, 380));
        this.addChild(this._stopTypeLabel, 2);
        this._stopTypeLabel.setVisible(false);

        var stopTypeBgSprite = cc.Sprite.create(main_scene_image.bg16);
        stopTypeBgSprite.setAnchorPoint(cc.p(0, 0));
        this._stopTypeLabel.addChild(stopTypeBgSprite);

        var stopUntilBlueIcon = cc.LabelTTF.create(
            "出现蓝色属性以上停止洗炼 (5.0% - 10.0%)",
            "STHeitiTC-Medium",
            20
        );
        stopUntilBlueIcon.setColor(cc.c3b(255, 239, 131));
        stopUntilBlueIcon.setAnchorPoint(cc.p(0, 0.5));
        stopUntilBlueIcon.setPosition(cc.p(80, 178));
        this._stopTypeLabel.addChild(stopUntilBlueIcon);

        var stopUntilYellowIcon = cc.LabelTTF.create(
            "出现金色属性以上停止洗炼 (8.0% - 10.0%)",
            "STHeitiTC-Medium",
            20
        );
        stopUntilYellowIcon.setColor(cc.c3b(255, 239, 131));
        stopUntilYellowIcon.setAnchorPoint(cc.p(0, 0.5));
        stopUntilYellowIcon.setPosition(cc.p(80, 96));
        this._stopTypeLabel.addChild(stopUntilYellowIcon);

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
        this._selectLeadCardIcon.setPosition(cc.p(189, 724));
        this.addChild(this._selectLeadCardIcon);

        var selectLeadCardItem = cc.MenuItemImage.create(
            main_scene_image.card_item_bg1,
            main_scene_image.card_item_bg_s,
            this._onClickSelectLeadCard,
            this
        );
        selectLeadCardItem.setPosition(cc.p(191, 724));

        this._afreshItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon69,
            this._onClickAfresh,
            this
        );
        this._afreshItem.setPosition(cc.p(260, 270));

        this._repeatAfreshItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon70,
            this._onClickRepeatAfresh,
            this
        );
        this._repeatAfreshItem.setPosition(cc.p(460, 270));

        this._startItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon71,
            this._onClickStart,
            this
        );
        this._startItem.setPosition(cc.p(260, 270));
        this._startItem.setVisible(false);

        this._cancelItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon72,
            this._onClickCancel,
            this
        );
        this._cancelItem.setPosition(cc.p(460, 270));
        this._cancelItem.setVisible(false);

        var menu = cc.Menu.create(
            selectLeadCardItem,
            this._afreshItem,
            this._repeatAfreshItem,
            this._startItem,
            this._cancelItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

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
        stopItem.setPosition(cc.p(360, 270));

        var shyLayerMenu = cc.Menu.create(stopItem);
        shyLayerMenu.setPosition(cc.p(0, 0));
        this._shyLayer.addChild(shyLayerMenu);

        this._shyLayer.setVisible(false);

        this._reset();
        this._onClickUseMoney();

        return true;
    },

    update: function (isAfresh) {
        cc.log("PassiveSkillAfreshLabel update");


        if (this._leadCard) {
            if (this._leadCardHeadNode == null) {
                this._leadCardHeadNode = CardHeadNode.create(this._leadCard);
                this._leadCardHeadNode.setPosition(cc.p(137, 670));
                this.addChild(this._leadCardHeadNode);
            }

            this._nameLabel.setString(this._leadCard.get("name"));
            this._nameLabel.setVisible(true);

            this._lvLabel.setString("LV: " + this._leadCard.get("lv"));
            this._lvLabel.setVisible(true);

            var passiveSkillCount = 0;
            var lockNum = 0;
            var passiveSkill = this._leadCard.get("passiveSkill");

            this._afreshIdList = [];
            for (var key in passiveSkill) {
                var passiveSkillLabel = this._passiveSkillList[passiveSkillCount++];

                if (!passiveSkillLabel.isLock) {
                    this._afreshIdList.push(passiveSkill[key].id);
                }

                var value = passiveSkill[key].value.toFixed(1);
                passiveSkillLabel.valueLabel.setString("+ " + value + "%");

                if (value >= 8.0) {
                    passiveSkillLabel.valueLabel.setColor(cc.c3b(255, 248, 69));
                } else if (value >= 5.0) {
                    passiveSkillLabel.valueLabel.setColor(cc.c3b(105, 218, 255));
                } else {
                    passiveSkillLabel.valueLabel.setColor(cc.c3b(118, 238, 60));
                }

                passiveSkillLabel.nameLabel.setString(passiveSkill[key].description);

                passiveSkillLabel.nameLabel.setVisible(true);
                passiveSkillLabel.valueLabel.setVisible(true);
                passiveSkillLabel.lockItem.setVisible(true);

                if (passiveSkillLabel.isLock) {
                    lockNum += 1;
                } else {
                    if (isAfresh) {
                        var valueLabel = passiveSkillLabel.valueLabel;

                        valueLabel.runAction(
                            cc.Sequence.create(
                                cc.FadeIn.create(1),
                                cc.MoveBy.create(0.1, cc.p(5, 0)),
                                cc.MoveBy.create(0.1, cc.p(-5, 0)),
                                cc.MoveBy.create(0.1, cc.p(5, 0)),
                                cc.MoveBy.create(0.1, cc.p(-5, 0))
                            )
                        );
                    }
                }
            }

            for (var i = 0; i < passiveSkillCount; ++i) {
                var passiveSkillLabel = this._passiveSkillList[i];

                if (!passiveSkillLabel.isLock) {
                    if (lockNum < passiveSkillCount - 1) {
                        passiveSkillLabel.lockItem.setVisible(true);
                    } else {
                        passiveSkillLabel.lockItem.setVisible(false);
                    }
                }
            }
        }

        var isEnabled = (this._leadCard && this._useType != USE_NULL);
        this._afreshItem.setEnabled(isEnabled);
        this._repeatAfreshItem.setEnabled(isEnabled);
        this._startItem.setEnabled(this._stopType != STOP_UNTIL_NULL);
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

        for (var i = 0; i < 3; ++i) {
            var passiveSkillLabel = this._passiveSkillList[i];

            passiveSkillLabel.nameLabel.setVisible(false);
            passiveSkillLabel.valueLabel.setVisible(false);
            passiveSkillLabel.hookLabel.setVisible(false);
            passiveSkillLabel.lockItem.setVisible(false);
            passiveSkillLabel.lockIcon.setVisible(false);
            passiveSkillLabel.isLock = false;
            passiveSkillLabel.id = 0;
        }

        this._afreshIdList = [];
    },

    _afresh: function (isRepeatAfresh) {
        cc.log("PassiveSkillAfreshLabel _afresh");

        var that = this;
        this._leadCard.afreshPassiveSkill(function (data) {
            if (isRepeatAfresh) {
                that._afreshCallBack();
            }

            that.update(true);
        }, this._afreshIdList, this._useType);
    },

    _repeatAfresh: function () {
        cc.log("PassiveSkillAfreshLabel _repeatAfresh");

        this._afresh(true);
    },

    _afreshCallBack: function () {
        cc.log("PassiveSkillAfreshLabel _afreshCallBack: " + this._stopType);

        var passiveSkill = this._leadCard.get("passiveSkill");
        var maxValue = 0;
        var len = this._afreshIdList.length;
        for (var i = 0; i < len; ++i) {
            maxValue = Math.max(maxValue, passiveSkill[this._afreshIdList[i]].value);
        }

        cc.log(maxValue);

        if (this._stopType == STOP_UNTIL_BLUE) {
            if (maxValue >= 5.0) {
                TipLayer.tip("人品爆发，出现蓝色属性，洗炼完毕");
                this._onClickStop();
            }
        } else if (this._stopType == STOP_UNTIL_YELLOW) {
            if (maxValue >= 8.0) {
                TipLayer.tip("人品爆发，惊现蓝色属性，洗炼完毕");
                this._onClickStop();
            }
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

        var that = this;
        var cardListLayer = CardListLayer.create(SELECT_TYPE_PASSIVE_SKILL_AFRESH_MASTER, function (data) {
            cc.log(data);

            if (data) {
                var leadCard = data[0] || null;

                if (leadCard !== that._leadCard) {
                    that._reset();
                    that._leadCard = leadCard;
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

    _onClickLock: function (index) {
        return function () {
            cc.log("PassiveSkillAfreshLabel _onClickLock: " + index);

            var passiveSkill = this._passiveSkillList[index];
            passiveSkill.isLock = !passiveSkill.isLock;
            passiveSkill.hookLabel.setVisible(passiveSkill.isLock);
            passiveSkill.lockIcon.setVisible(passiveSkill.isLock);

            this.update();
        }
    },

    _onClickUseMoney: function () {
        cc.log("PassiveSkillAfreshLabel _onClickUseMoney");

        this._useType = USE_MONEY;
        this._useMoneyItem.setEnabled(false);
        this._useGoldItem.setEnabled(true);

        this.update();
    },

    _onClickUseGold: function () {
        cc.log("PassiveSkillAfreshLabel _onClickUseGold");

        this._useType = USE_GOLD;
        this._useMoneyItem.setEnabled(true);
        this._useGoldItem.setEnabled(false);

        this.update();
    },

    _onClickStopUntilBlue: function () {
        cc.log("PassiveSkillAfreshLabel _onClickStopUntilBlue");

        this._stopType = STOP_UNTIL_BLUE;
        this._stopUntilBlueItem.setEnabled(false);
        this._stopUntilYellowItem.setEnabled(true);

        this.update();
    },

    _onClickStopUntilYellow: function () {
        cc.log("PassiveSkillAfreshLabel _onClickStopUntilYellow");

        this._stopType = STOP_UNTIL_YELLOW;
        this._stopUntilBlueItem.setEnabled(true);
        this._stopUntilYellowItem.setEnabled(false);

        this.update();
    },

    _onClickAfresh: function () {
        cc.log("PassiveSkillAfreshLabel _onClickAfresh");

        this._afresh();
    },

    _onClickRepeatAfresh: function () {
        cc.log("PassiveSkillAfreshLabel _onClickRepeatAfresh");

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

        this._resLabel.setVisible(true);
        this._afreshItem.setVisible(false);
        this._repeatAfreshItem.setVisible(false);
        this._stopTypeLabel.setVisible(false);
        this._startItem.setVisible(false);
        this._cancelItem.setVisible(false);
        this._shyLayer.setVisible(true);

        this._tipLabel.setFontSize(22);
        this._setTip();

        this.schedule(this._repeatAfresh, 2, null, 0);
        this.schedule(this._setTip, 1, null, 0);
    },

    _onClickCancel: function () {
        cc.log("PassiveSkillAfreshLabel _onClickCancel");

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

        this._resLabel.setVisible(true);
        this._afreshItem.setVisible(true);
        this._repeatAfreshItem.setVisible(true);
        this._stopTypeLabel.setVisible(false);
        this._startItem.setVisible(false);
        this._cancelItem.setVisible(false);
        this._shyLayer.setVisible(false);

        this.unschedule(this._repeatAfresh);
        this.unschedule(this._setTip);

        this._tipLabel.setFontSize(18);
        this._tipLabel.setString("魔石洗炼获得金色属性概率提升10倍");
    }
});


PassiveSkillAfreshLabel.create = function () {
    var ret = new PassiveSkillAfreshLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};