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
    _useMoneyIcon: null,
    _useGoldIcon: null,
    _useType: USE_NULL,
    _stopTypeLabel: null,
    _stopUntilBlueIcon: null,
    _stopUntilYellowIcon: null,
    _stopType: STOP_UNTIL_NULL,
    _passiveSkillList: [],
    _afreshIdList: [],
    _passiveSkillNameTexture: {},
    _afreshItem: null,
    _repeatAfreshItem: null,
    _startItem: null,
    _cancelItem: null,
    _stopItem: null,
    _afreshIcon: null,
    _repeatAfreshIcon: null,
    _startIcon: null,
    _cancelIcon: null,
    _stopIcon: null,
    _selectLeadCardIcon: null,

    onEnter: function () {
        cc.log("PassiveSkillAfreshLabel onEnter");

        this._super();
        this.update();
    },


    init: function () {
        cc.log("PassiveSkillAfreshLabel init");

        if (!this._super()) return false;

        this._passiveSkillNameTexture = {
            atk_improve: cc.TextureCache.getInstance().addImage(main_scene_image.icon77),
            hp_improve: cc.TextureCache.getInstance().addImage(main_scene_image.icon76),
            crit: cc.TextureCache.getInstance().addImage(main_scene_image.icon78),
            dodge: cc.TextureCache.getInstance().addImage(main_scene_image.icon79),
            dmg_reduce: cc.TextureCache.getInstance().addImage(main_scene_image.icon80)
        };

        var cardItemBgSprite = cc.Sprite.create(main_scene_image.icon68);
        cardItemBgSprite.setPosition(cc.p(328, 725));
        this.addChild(cardItemBgSprite);

        this._nameLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 23);
        this._nameLabel.setAnchorPoint(cc.p(0, 0.5));
        this._nameLabel.setPosition(cc.p(243, 742));
        this.addChild(this._nameLabel);
        this._nameLabel.setVisible(false);

        this._lvLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 23);
        this._lvLabel.setAnchorPoint(cc.p(0, 0.5));
        this._lvLabel.setPosition(cc.p(245, 708));
        this.addChild(this._lvLabel);
        this._lvLabel.setVisible(false);

        this._resLabel = cc.Node.create();
        this._resLabel.setAnchorPoint(cc.p(0, 0));
        this._resLabel.setPosition(cc.p(133, 300));
        this.addChild(this._resLabel, 1);

        var resLabelBgSprite = cc.Sprite.create(main_scene_image.icon66);
        resLabelBgSprite.setAnchorPoint(cc.p(0, 0));
        this._resLabel.addChild(resLabelBgSprite);

        var resLabelIcon = cc.Sprite.create(main_scene_image.icon67);
        resLabelIcon.setAnchorPoint(cc.p(0, 0));
        this._resLabel.addChild(resLabelIcon);

        var resMenu = cc.Menu.create();
        resMenu.setPosition(cc.p(0, 0));
        this._resLabel.addChild(resMenu);

        for (var i = 0; i < 3; ++i) {
            var nameLabel = cc.Sprite.createWithTexture(this._passiveSkillNameTexture.atk_improve);
            nameLabel.setPosition(cc.p(80, 152 + 78 * (2 - i)));
            this._resLabel.addChild(nameLabel);
            nameLabel.setVisible(false);
//            nameLabel.setTexture(this._passiveSkillNameTexture.atk_reduce);

            var valueLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 28);
            valueLabel.setPosition(cc.p(190, 152 + 78 * (2 - i)));
            this._resLabel.addChild(valueLabel);
            valueLabel.setVisible(false);

            var lockItem = cc.MenuItemImage.create(
                main_scene_image.button24,
                main_scene_image.button24s,
                this._onClickLock(i),
                this
            );
            lockItem.setPosition(cc.p(370, 152 + 78 * (2 - i)));
            resMenu.addChild(lockItem);
            lockItem.setVisible(false);

            var hookLabel = cc.Sprite.create(main_scene_image.icon20);
            hookLabel.setPosition(cc.p(350, 152 + 78 * (2 - i)));
            this._resLabel.addChild(hookLabel);
            hookLabel.setVisible(false);

            this._passiveSkillList[i] = {
                nameLabel: nameLabel,
                valueLabel: valueLabel,
                hookLabel: hookLabel,
                lockItem: lockItem,
                isLock: false
            }
        }

        var useMoneyItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            this._onClickUseMoney,
            this
        );
        useMoneyItem.setPosition(cc.p(67, 92));
        resMenu.addChild(useMoneyItem);

        var useGoldItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            this._onClickUseGold,
            this
        );
        useGoldItem.setPosition(cc.p(291, 92));
        resMenu.addChild(useGoldItem);

        this._useMoneyIcon = cc.Sprite.create(main_scene_image.icon75);
        this._useMoneyIcon.setPosition(cc.p(67, 92));
        this._resLabel.addChild(this._useMoneyIcon);
        this._useMoneyIcon.setVisible(false);

        this._useGoldIcon = cc.Sprite.create(main_scene_image.icon75);
        this._useGoldIcon.setPosition(cc.p(291, 92));
        this._resLabel.addChild(this._useGoldIcon);
        this._useGoldIcon.setVisible(false);


        this._stopTypeLabel = cc.Node.create();
        this._stopTypeLabel.setAnchorPoint(cc.p(0, 0));
        this._stopTypeLabel.setPosition(cc.p(106, 380));
        this.addChild(this._stopTypeLabel, 2);
        this._stopTypeLabel.setVisible(false);

        var stopTypeBgSprite = cc.Sprite.create(main_scene_image.bg16);
        stopTypeBgSprite.setAnchorPoint(cc.p(0, 0));
        this._stopTypeLabel.addChild(stopTypeBgSprite);

        var stopTypeIcon = cc.Sprite.create(main_scene_image.icon74);
        stopTypeIcon.setPosition(cc.p(255, 137));
        this._stopTypeLabel.addChild(stopTypeIcon);

        var stopTypeMenu = cc.Menu.create();
        stopTypeMenu.setPosition(cc.p(0, 0));
        this._stopTypeLabel.addChild(stopTypeMenu);

        var stopUntilBlueItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            this._onClickStopUntilBlue,
            this
        );
        stopUntilBlueItem.setPosition(cc.p(80, 178));
        stopTypeMenu.addChild(stopUntilBlueItem);

        var stopUntilYellowItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            this._onClickStopUntilYellow,
            this
        );
        stopUntilYellowItem.setPosition(cc.p(80, 96));
        stopTypeMenu.addChild(stopUntilYellowItem);

        this._stopUntilBlueIcon = cc.Sprite.create(main_scene_image.icon75);
        this._stopUntilBlueIcon.setPosition(cc.p(80, 178));
        this._stopTypeLabel.addChild(this._stopUntilBlueIcon);
        this._stopUntilBlueIcon.setVisible(false);

        this._stopUntilYellowIcon = cc.Sprite.create(main_scene_image.icon75);
        this._stopUntilYellowIcon.setPosition(cc.p(80, 96));
        this._stopTypeLabel.addChild(this._stopUntilYellowIcon);
        this._stopUntilYellowIcon.setVisible(false);

        var selectLeadCardItem = cc.MenuItemImage.create(
            main_scene_image.card_item_bg1,
            main_scene_image.card_item_bg_s,
            this._onClickSelectLeadCard,
            this
        );
        selectLeadCardItem.setPosition(cc.p(191, 724));

        this._afreshItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            this._onClickAfresh,
            this
        );
        this._afreshItem.setPosition(cc.p(260, 270));

        this._repeatAfreshItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            this._onClickRepeatAfresh,
            this
        );
        this._repeatAfreshItem.setPosition(cc.p(460, 270));

        this._startItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            this._onClickStart,
            this
        );
        this._startItem.setPosition(cc.p(260, 270));
        this._startItem.setVisible(false);

        this._cancelItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            this._onClickCancel,
            this
        );
        this._cancelItem.setPosition(cc.p(460, 270));
        this._cancelItem.setVisible(false);

        this._stopItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            this._onClickStop,
            this
        );
        this._stopItem.setPosition(cc.p(360, 270));
        this._stopItem.setVisible(false);

        var menu = cc.Menu.create(
            selectLeadCardItem,
            this._afreshItem,
            this._repeatAfreshItem,
            this._startItem,
            this._cancelItem,
            this._stopItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._selectLeadCardIcon = cc.Sprite.create(main_scene_image.icon11);
        this._selectLeadCardIcon.setPosition(cc.p(188, 727));
        this.addChild(this._selectLeadCardIcon);

        this._afreshIcon = cc.Sprite.create(main_scene_image.icon69);
        this._afreshIcon.setPosition(cc.p(260, 270));
        this.addChild(this._afreshIcon);

        this._repeatAfreshIcon = cc.Sprite.create(main_scene_image.icon70);
        this._repeatAfreshIcon.setPosition(cc.p(460, 270));
        this.addChild(this._repeatAfreshIcon);

        this._startIcon = cc.Sprite.create(main_scene_image.icon71);
        this._startIcon.setPosition(cc.p(260, 270));
        this.addChild(this._startIcon);
        this._startIcon.setVisible(false);

        this._cancelIcon = cc.Sprite.create(main_scene_image.icon72);
        this._cancelIcon.setPosition(cc.p(460, 270));
        this.addChild(this._cancelIcon);
        this._cancelIcon.setVisible(false);

        this._stopIcon = cc.Sprite.create(main_scene_image.icon73);
        this._stopIcon.setPosition(cc.p(360, 270));
        this.addChild(this._stopIcon);
        this._stopIcon.setVisible(false);

        return true;
    },

    update: function () {
        cc.log("PassiveSkillAfreshLabel update");

        var isAllLock = true;
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

            var index = 0;
            var passiveSkill = this._leadCard.get("passiveSkill");

            this._afreshIdList = [];
            for (var key in passiveSkill) {
                var passiveSkillLabel = this._passiveSkillList[index++];

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

                passiveSkillLabel.nameLabel.setTexture(this._passiveSkillNameTexture[passiveSkill[key].name]);
                passiveSkillLabel.nameLabel.setVisible(true);
                passiveSkillLabel.valueLabel.setVisible(true);
                passiveSkillLabel.lockItem.setVisible(true);

                isAllLock = isAllLock && passiveSkillLabel.isLock;
            }
        }

        var isEnabled = (this._leadCard && this._useType != USE_NULL && !isAllLock);
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

        var selectLeadCardIconAction = cc.Sequence.create(
            cc.FadeOut.create(1),
            cc.FadeIn.create(1)
        );

        this._selectLeadCardIcon.runAction(cc.RepeatForever.create(selectLeadCardIconAction));

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

            that.update();
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

        if (maxValue < 0) {
            this.unschedule(this._repeatAfresh);
        } else if (this._stopType == STOP_UNTIL_BLUE) {
            if (maxValue >= 5.0) {
                this._onClickStop();
            }
        } else if (this._stopType == STOP_UNTIL_YELLOW) {
            if (maxValue >= 8.0) {
                this._onClickStop();
            }
        }
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

            that.getParent()._backToThisLayer();

            cc.log("this._leadCard :");
            cc.log(that._leadCard);
        }, {
            leadCard: this._leadCard
        });

        this.getParent()._switchToCardListLayer(cardListLayer);
    },

    _onClickLock: function (index) {
        return function () {
            cc.log("PassiveSkillAfreshLabel _onClickLock: " + index);

            var passiveSkill = this._passiveSkillList[index];
            passiveSkill.isLock = !passiveSkill.isLock;
            passiveSkill.hookLabel.setVisible(passiveSkill.isLock);

            this.update();
        }
    },

    _onClickUseMoney: function () {
        cc.log("PassiveSkillAfreshLabel _onClickUseMoney");

        if (this._useType == USE_NULL) {
            this._useType = USE_MONEY;
            this._useMoneyIcon.setVisible(true);
        } else if (this._useType == USE_MONEY) {
            this._useType = USE_NULL;
            this._useMoneyIcon.setVisible(false);
        } else if (this._useType == USE_GOLD) {
            this._useType = USE_MONEY;
            this._useMoneyIcon.setVisible(true);
            this._useGoldIcon.setVisible(false);
        }

        this.update();
    },

    _onClickUseGold: function () {
        cc.log("PassiveSkillAfreshLabel _onClickUseGold");

        if (this._useType == USE_NULL) {
            this._useType = USE_GOLD;
            this._useGoldIcon.setVisible(true);
        } else if (this._useType == USE_MONEY) {
            this._useType = USE_GOLD;
            this._useMoneyIcon.setVisible(false);
            this._useGoldIcon.setVisible(true);
        } else if (this._useType == USE_GOLD) {
            this._useType = USE_NULL;
            this._useGoldIcon.setVisible(false);
        }

        this.update();
    },

    _onClickStopUntilBlue: function () {
        cc.log("PassiveSkillAfreshLabel _onClickStopUntilBlue");

        if (this._stopType == STOP_UNTIL_NULL) {
            this._stopType = STOP_UNTIL_BLUE;
            this._stopUntilBlueIcon.setVisible(true);
        } else if (this._stopType == STOP_UNTIL_BLUE) {
            this._stopType = STOP_UNTIL_NULL;
            this._stopUntilBlueIcon.setVisible(false);
        } else if (this._stopType == STOP_UNTIL_YELLOW) {
            this._stopType = USE_MONEY;
            this._stopUntilBlueIcon.setVisible(true);
            this._stopUntilYellowIcon.setVisible(false);
        }

        this.update();
    },

    _onClickStopUntilYellow: function () {
        cc.log("PassiveSkillAfreshLabel _onClickStopUntilYellow");

        if (this._stopType == STOP_UNTIL_NULL) {
            this._stopType = STOP_UNTIL_YELLOW;
            this._stopUntilYellowIcon.setVisible(true);
        } else if (this._stopType == STOP_UNTIL_BLUE) {
            this._stopType = STOP_UNTIL_YELLOW;
            this._stopUntilBlueIcon.setVisible(false);
            this._stopUntilYellowIcon.setVisible(true);
        } else if (this._stopType == STOP_UNTIL_YELLOW) {
            this._stopType = STOP_UNTIL_NULL;
            this._stopUntilYellowIcon.setVisible(false);
        }

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
        this._afreshIcon.setVisible(false);

        this._repeatAfreshItem.setVisible(false);
        this._repeatAfreshIcon.setVisible(false);

        this._stopTypeLabel.setVisible(true);

        this._startItem.setVisible(true);
        this._startIcon.setVisible(true);

        this._cancelItem.setVisible(true);
        this._cancelIcon.setVisible(true);

        this._stopItem.setVisible(false);
        this._stopIcon.setVisible(false);
    },

    _onClickStart: function () {
        cc.log("PassiveSkillAfreshLabel _onClickStart");

        this._resLabel.setVisible(true);

        this._afreshItem.setVisible(false);
        this._afreshIcon.setVisible(false);

        this._repeatAfreshItem.setVisible(false);
        this._repeatAfreshIcon.setVisible(false);

        this._stopTypeLabel.setVisible(false);

        this._startItem.setVisible(false);
        this._startIcon.setVisible(false);

        this._cancelItem.setVisible(false);
        this._cancelIcon.setVisible(false);

        this._stopItem.setVisible(true);
        this._stopIcon.setVisible(true);

        this.schedule(this._repeatAfresh, 2, cc.REPEAT_FOREVER, 0);
    },

    _onClickCancel: function () {
        cc.log("PassiveSkillAfreshLabel _onClickCancel");

        this._resLabel.setVisible(true);

        this._afreshItem.setVisible(true);
        this._afreshIcon.setVisible(true);

        this._repeatAfreshItem.setVisible(true);
        this._repeatAfreshIcon.setVisible(true);

        this._stopTypeLabel.setVisible(false);

        this._startItem.setVisible(false);
        this._startIcon.setVisible(false);

        this._cancelItem.setVisible(false);
        this._cancelIcon.setVisible(false);

        this._stopItem.setVisible(false);
        this._stopIcon.setVisible(false);
    },

    _onClickStop: function () {
        cc.log("PassiveSkillAfreshLabel _onClickStop");

        this._resLabel.setVisible(true);

        this._afreshItem.setVisible(true);
        this._afreshIcon.setVisible(true);

        this._repeatAfreshItem.setVisible(true);
        this._repeatAfreshIcon.setVisible(true);

        this._stopTypeLabel.setVisible(false);

        this._startItem.setVisible(false);
        this._startIcon.setVisible(false);

        this._cancelItem.setVisible(false);
        this._cancelIcon.setVisible(false);

        this._stopItem.setVisible(false);
        this._stopIcon.setVisible(false);

        this.unschedule(this._repeatAfresh);
    }
});


PassiveSkillAfreshLabel.create = function () {
    var ret = new PassiveSkillAfreshLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};