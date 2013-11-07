/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-13
 * Time: 下午6:07
 * To change this template use File | Settings | File Templates.
 */


/*
 * skill upgrade label
 * */


var SkillUpgradeLabel = cc.Node.extend({
    _skillUpgradeLabelFit: null,

    _leadCard: null,
    _leadCardHalfNode: null,
    _tipLabel: null,
    _helpLabel: null,
    _skillPointLabel: null,
    _needSkillPointLabel: null,
    _resLabel: null,
    _arrowLabel1: null,
    _arrowLabel2: null,
    _nameLabel: null,
    _skillLvLabel: null,
    _nextSkillLvLabel: null,
    _skillHarmLabel: null,
    _nextSkillHarmLabel: null,
    _upgradeItem: null,
    _selectLeadCardIcon: null,

    onEnter: function () {
        cc.log("SkillUpgradeLabel onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("SkillUpgradeLabel init");

        if (!this._super()) return false;

        this._skillUpgradeLabelFit = gameFit.mainScene.skillUpgradeLabel;

        var cardItemBgSprite = cc.Sprite.create(main_scene_image.icon61);
        cardItemBgSprite.setPosition(this._skillUpgradeLabelFit.cardItemBgSpritePoint);
        this.addChild(cardItemBgSprite);

        var skillPointIcon = cc.LabelTTF.create("技能点:", "STHeitiTC-Medium", 22);
        skillPointIcon.setColor(cc.c3b(255, 239, 131));
        skillPointIcon.setPosition(this._skillUpgradeLabelFit.skillPointIconPoint);
        this.addChild(skillPointIcon);

        this._skillPointLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._skillPointLabel.setAnchorPoint(cc.p(0, 0.5));
        this._skillPointLabel.setPosition(this._skillUpgradeLabelFit.skillPointLabelPoint);
        this.addChild(this._skillPointLabel);

        this._resLabel = cc.Node.create();
        this._resLabel.setPosition(this._skillUpgradeLabelFit.resLabelPoint);
        this.addChild(this._resLabel);

        var resLabelBgSprite = cc.Sprite.create(main_scene_image.icon49);
        this._resLabel.addChild(resLabelBgSprite);

        this._nameLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 25);
        this._nameLabel.setColor(cc.c3b(255, 239, 131));
        this._nameLabel.setPosition(cc.p(0, 40));
        this._resLabel.addChild(this._nameLabel);

        var skillLvIcon = cc.LabelTTF.create("技能等级:", "STHeitiTC-Medium", 22);
        skillLvIcon.setColor(cc.c3b(255, 239, 131));
        skillLvIcon.setPosition(cc.p(-85, 2));
        this._resLabel.addChild(skillLvIcon);

        this._skillLvLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._skillLvLabel.setPosition(cc.p(0, 0));
        this._resLabel.addChild(this._skillLvLabel);

        this._nextSkillLvLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._nextSkillLvLabel.setColor(cc.c3b(118, 238, 60));
        this._nextSkillLvLabel.setPosition(cc.p(100, 0));
        this._resLabel.addChild(this._nextSkillLvLabel);

        var skillHarmIcon = cc.LabelTTF.create("技能效果:", "STHeitiTC-Medium", 22);
        skillHarmIcon.setColor(cc.c3b(255, 239, 131));
        skillHarmIcon.setPosition(cc.p(-85, -33));
        this._resLabel.addChild(skillHarmIcon);

        this._skillHarmLabel = cc.LabelTTF.create("0%", "STHeitiTC-Medium", 22);
        this._skillHarmLabel.setPosition(cc.p(0, -35));
        this._resLabel.addChild(this._skillHarmLabel);

        this._nextSkillHarmLabel = cc.LabelTTF.create("0%", "STHeitiTC-Medium", 22);
        this._nextSkillHarmLabel.setColor(cc.c3b(118, 238, 60));
        this._nextSkillHarmLabel.setPosition(cc.p(100, -35));
        this._resLabel.addChild(this._nextSkillHarmLabel);

        this._arrowLabel1 = cc.Sprite.create(main_scene_image.icon63);
        this._arrowLabel1.setPosition(cc.p(50, 0));
        this._resLabel.addChild(this._arrowLabel1);

        this._arrowLabel2 = cc.Sprite.create(main_scene_image.icon63);
        this._arrowLabel2.setPosition(cc.p(50, -35));
        this._resLabel.addChild(this._arrowLabel2);

        var helpBgSprite = cc.Sprite.create(main_scene_image.icon50);
        helpBgSprite.setPosition(this._skillUpgradeLabelFit.helpBgSpritePoint);
        this.addChild(helpBgSprite);

        this._tipLabel = cc.Node.create();
        this._tipLabel.setPosition(this._skillUpgradeLabelFit.tipLabelPoint);
        this.addChild(this._tipLabel);

        var tipLabel1 = cc.LabelTTF.create("技能通过消耗技能点提升等级", "STHeitiTC-Medium", 22);
        tipLabel1.setPosition(cc.p(0, 20));
        this._tipLabel.addChild(tipLabel1);

        var tipLabel2 = cc.LabelTTF.create("技能点通过天道产出", "STHeitiTC-Medium", 22);
        tipLabel2.setPosition(cc.p(0, -20));
        this._tipLabel.addChild(tipLabel2);

        this._helpLabel = cc.Node.create();
        this._helpLabel.setPosition(this._skillUpgradeLabelFit.helpLabelPoint);
        this.addChild(this._helpLabel);

        var needSkillPointIcon = cc.LabelTTF.create("升级还需技能点:", "STHeitiTC-Medium", 22);
        needSkillPointIcon.setPosition(cc.p(-44, 0));
        this._helpLabel.addChild(needSkillPointIcon);

        this._needSkillPointLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._needSkillPointLabel.setAnchorPoint(cc.p(0, 0.5));
        this._needSkillPointLabel.setPosition(cc.p(44, -2));
        this._helpLabel.addChild(this._needSkillPointLabel);

        var selectLeadCardItem = cc.MenuItemImage.create(
            main_scene_image.card_frame1,
            main_scene_image.card_frame_s,
            this._onClickSelectLeadCard,
            this
        );
        selectLeadCardItem.setScale(1.1);
        selectLeadCardItem.setPosition(this._skillUpgradeLabelFit.selectLeadCardItemPoint);

        this._upgradeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon52,
            this._onClickUpgrade,
            this
        );
        this._upgradeItem.setPosition(this._skillUpgradeLabelFit.upgradeItemPoint);

        var menu = cc.Menu.create(selectLeadCardItem, this._upgradeItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._selectLeadCardIcon = cc.Sprite.create(main_scene_image.icon51);
        this._selectLeadCardIcon.setPosition(this._skillUpgradeLabelFit.selectLeadCardIconPoint);
        this.addChild(this._selectLeadCardIcon);

        return true;
    },

    update: function () {
        cc.log("SkillUpgradeLabel update");

        var skillPoint = gameData.player.get("skillPoint");
        this._skillPointLabel.setString(skillPoint);

        if (this._leadCardHalfNode != null) {
            this._leadCardHalfNode.removeFromParent();
            this._leadCardHalfNode = null;
        }

        if (this._leadCard == null) {
            this._resLabel.setVisible(false);
            this._tipLabel.setVisible(true);
            this._helpLabel.setVisible(false);

            this._selectLeadCardIcon.stopAllActions();
            this._selectLeadCardIcon.setOpacity(254);

            this._selectLeadCardIcon.runAction(
                cc.RepeatForever.create(
                    cc.Sequence.create(
                        cc.FadeOut.create(1),
                        cc.FadeIn.create(1)
                    )
                )
            );

            this._upgradeItem.setEnabled(false);
        } else {
            this._leadCardHalfNode = CardHalfNode.create(this._leadCard);
            this._leadCardHalfNode.setScale(1.1);
            this._leadCardHalfNode.setPosition(this._skillUpgradeLabelFit.leadCardHalfNodePoint);
            this.addChild(this._leadCardHalfNode, 1);

            this._nameLabel.setString(this._leadCard.get("name"));

            var upgradeNeedSkillPoint = this._leadCard.getUpgradeNeedSKillPoint();

            if (upgradeNeedSkillPoint > skillPoint) {
                this._needSkillPointLabel.setColor(cc.c3b(255, 40, 40));
            } else {
                this._needSkillPointLabel.setColor(cc.c3b(255, 255, 255));
            }

            this._needSkillPointLabel.setString(upgradeNeedSkillPoint);

            this._skillLvLabel.setString(this._leadCard.get("skillLv"));
            this._skillHarmLabel.setString(this._leadCard.get("skillHarm") + "%");

            if (this._leadCard.canUpgradeSkill()) {
                this._arrowLabel1.setVisible(true);
                this._arrowLabel2.setVisible(true);

                this._nextSkillLvLabel.setString(this._leadCard.get("skillLv") + 1);
                this._nextSkillHarmLabel.setString(this._leadCard.getNextSkillLvHarm() + "%");
            } else {
                this._arrowLabel1.setVisible(false);
                this._arrowLabel2.setVisible(false);

                this._nextSkillLvLabel.setString("已满级");
                this._nextSkillHarmLabel.setString("已满级");
            }

            this._resLabel.setVisible(true);
            this._tipLabel.setVisible(false);
            this._helpLabel.setVisible(true);

            this._upgradeItem.setEnabled(true);
        }
    },

    _onClickSelectLeadCard: function () {
        cc.log("SkillUpgradeLabel _onClickSelectLeadCard");

        var that = this;
        var cardListLayer = CardListLayer.create(SELECT_TYPE_SKILL_UPGRADE_MASTER, function (data) {
            cc.log(data);

            if (data) {
                that._leadCard = data[0] || null;
                that._retinueCard = [];
            }

            that.getParent().backToThisLayer();

            cc.log("this._leadCard :");
            cc.log(that._leadCard);
        }, {
            leadCard: this._leadCard
        });

        this.getParent().switchToCardListLayer(cardListLayer);
    },

    _onClickUpgrade: function () {
        cc.log("SkillUpgradeLabel _onClickUpgrade");

        if (!this._leadCard.canUpgradeSkill()) {
            TipLayer.tip("技能不可升级");
            return;
        }

        if (gameData.player.get("skillPoint") < this._leadCard.getUpgradeNeedSKillPoint()) {
            TipLayer.tip("技能点不足");
            return;
        }

        var that = this;
        this._leadCard.upgradeSkill(function (data) {
            playEffect({
                effectId: 11,
                target: that,
                loops: 1,
                delay: 0.1,
                zOrder: 10,
                position: that._skillUpgradeLabelFit.effectPoint,
                clear: true
            });

            that.update();
        });
    }
});


SkillUpgradeLabel.create = function () {
    var ret = new SkillUpgradeLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};