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
    _leadCard: null,
    _leadCardHalfNode: null,
    _tipLabel: null,
    _helpLabel: null,
    _skillPointLabel: null,
    _needSkillPointLabel: null,
    _resLabel: null,
    _arrowLabel1: null,
    _arrowLabel2: null,
    _skillNameLabel: null,
    _skillLvLabel: null,
    _nextSkillLvLabel: null,
    _skillHarmLabel: null,
    _nextSkillHarmLabel: null,
    _upgradeItem: null,


    onEnter: function () {
        cc.log("SkillUpgradeLabel onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("SkillUpgradeLabel init");

        if (!this._super()) return false;

        var cardItemBgSprite = cc.Sprite.create(main_scene_image.icon61);
        cardItemBgSprite.setPosition(cc.p(360, 632));
        this.addChild(cardItemBgSprite);

        var helpBgSprite = cc.Sprite.create(main_scene_image.icon50);
        helpBgSprite.setPosition(cc.p(360, 380));
        this.addChild(helpBgSprite);

        this._resLabel = cc.Node.create();
        this._resLabel.setPosition(cc.p(202, 445));
        this.addChild(this._resLabel, 1);

        var resLabelBgSprite = cc.Sprite.create(main_scene_image.icon49);
        resLabelBgSprite.setAnchorPoint(cc.p(0, 0));
        this._resLabel.addChild(resLabelBgSprite);

        var resLabelIcon = cc.Sprite.create(main_scene_image.icon62);
        resLabelIcon.setPosition(cc.p(130, 70));
        this._resLabel.addChild(resLabelIcon);

        this._skillNameLabel = cc.LabelTTF.create("xxxx", '黑体', 40);
        this._skillNameLabel.setPosition(cc.p(158, 118));
        this._resLabel.addChild(this._skillNameLabel);

        this._skillLvLabel = cc.LabelTTF.create("0", '黑体', 22);
        this._skillLvLabel.setPosition(cc.p(125, 85));
        this._resLabel.addChild(this._skillLvLabel);

        this._nextSkillLvLabel = cc.LabelTTF.create("0", '黑体', 22);
        this._nextSkillLvLabel.setColor(cc.c3b(118, 238, 60));
        this._nextSkillLvLabel.setPosition(cc.p(190, 85));
        this._resLabel.addChild(this._nextSkillLvLabel);

        this._skillHarmLabel = cc.LabelTTF.create("0%", '黑体', 22);
        this._skillHarmLabel.setPosition(cc.p(115, 30));
        this._resLabel.addChild(this._skillHarmLabel);

        this._nextSkillHarmLabel = cc.LabelTTF.create("0%", '黑体', 22);
        this._nextSkillHarmLabel.setColor(cc.c3b(118, 238, 60));
        this._nextSkillHarmLabel.setPosition(cc.p(200, 30));
        this._resLabel.addChild(this._nextSkillHarmLabel);

        this._arrowLabel1 = cc.Sprite.create(main_scene_image.icon63);
        this._arrowLabel1.setPosition(cc.p(158, 85));
        this._resLabel.addChild(this._arrowLabel1);

        this._arrowLabel2 = cc.Sprite.create(main_scene_image.icon63);
        this._arrowLabel2.setPosition(cc.p(158, 30));
        this._resLabel.addChild(this._arrowLabel2);

        this._tipLabel = cc.Sprite.create(main_scene_image.icon65);
        this._tipLabel.setPosition(cc.p(360, 380));
        this.addChild(this._tipLabel);

        this._helpLabel = cc.Sprite.create(main_scene_image.icon64);
        this._helpLabel.setPosition(cc.p(320, 380));
        this.addChild(this._helpLabel);

        var selectLeadCardItem = cc.MenuItemImage.create(
            main_scene_image.card_frame1,
            main_scene_image.card_frame_s,
            this._onClickSelectLeadCard,
            this
        );
        selectLeadCardItem.setPosition(cc.p(354, 685));

        this._upgradeItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            this._onClickUpgrade,
            this
        );
        this._upgradeItem.setPosition(cc.p(360, 270));


        var menu = cc.Menu.create(selectLeadCardItem, this._upgradeItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._skillPointLabel = cc.LabelTTF.create("0", '黑体', 25);
        this._skillPointLabel.setAnchorPoint(cc.p(0, 0.5));
        this._skillPointLabel.setPosition(cc.p(243, 382));
        this.addChild(this._skillPointLabel);

        this._needSkillPointLabel = cc.LabelTTF.create("0", '黑体', 25);
        this._needSkillPointLabel.setAnchorPoint(cc.p(0, 0.5));
        this._needSkillPointLabel.setPosition(cc.p(512, 382));
        this.addChild(this._needSkillPointLabel);

        var selectLeadCardIcon = cc.Sprite.create(main_scene_image.icon51);
        selectLeadCardIcon.setPosition(cc.p(354, 685));
        this.addChild(selectLeadCardIcon);

        var selectLeadCardIconAction = cc.Sequence.create(
            cc.FadeOut.create(1),
            cc.FadeIn.create(1)
        );

        selectLeadCardIcon.runAction(cc.RepeatForever.create(selectLeadCardIconAction));

        var upgradeIcon = cc.Sprite.create(main_scene_image.icon52);
        upgradeIcon.setPosition(cc.p(360, 270));
        this.addChild(upgradeIcon);

        return true;
    },

    update: function () {
        cc.log("SkillUpgradeLabel update");

        if (this._leadCardHalfNode != null) {
            this._leadCardHalfNode.removeFromParent();
            this._leadCardHalfNode = null;
        }

        if (this._leadCard == null) {
            this._resLabel.setVisible(false);
            this._tipLabel.setVisible(true);
            this._helpLabel.setVisible(false);
            this._skillPointLabel.setVisible(false);
            this._needSkillPointLabel.setVisible(false);

            this._upgradeItem.setEnabled(false);
        } else {
            this._leadCardHalfNode = CardHalfNode.create(this._leadCard);
            this._leadCardHalfNode.setPosition(cc.p(354, 685));
            this.addChild(this._leadCardHalfNode, 1);

            var skillPoint = gameData.player.get("skillPoint");
            var upgradeNeedSkillPoint = this._leadCard.getUpgradeNeedSKillPoint();

            this._skillPointLabel.setString(skillPoint);
            this._skillPointLabel.setVisible(true);
            if (upgradeNeedSkillPoint > skillPoint) {
                this._skillPointLabel.setColor(cc.RED);
            } else {
                this._skillPointLabel.setColor(cc.WHITE);
            }

            this._needSkillPointLabel.setString(upgradeNeedSkillPoint);
            this._needSkillPointLabel.setVisible(true);

            this._skillLvLabel.setString(this._leadCard.get("skillLv"));
            this._skillLvLabel.setVisible(true);

            this._skillHarmLabel.setString(this._leadCard.get("skillHarm") + "%");
            this._skillHarmLabel.setVisible(true);

            this._skillNameLabel.setString(this._leadCard.get("skillName"));
            this._skillHarmLabel.setVisible(true);

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

            this._nextSkillLvLabel.setVisible(true);
            this._nextSkillHarmLabel.setVisible(true);

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

            that.getParent()._backToThisLayer();

            cc.log("this._leadCard :");
            cc.log(that._leadCard);
        }, {
            leadCard: this._leadCard
        });

        this.getParent()._switchToCardListLayer(cardListLayer);
    },

    _onClickUpgrade: function () {
        cc.log("SkillUpgradeLabel _onClickUpgrade");

        var that = this;
        this._leadCard.upgradeSkill(function (data) {
            that.update();
        });
    }
})


SkillUpgradeLabel.create = function () {
    var ret = new SkillUpgradeLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}