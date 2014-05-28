/**
 * Created by lujunyu on 14-5-22.
 */

var UsePillLabel = cc.Layer.extend({
    _usePillLabelFit: null,

    _awakenEffect: null,
    _leadCard: null,
    _effect: null,
    _showUpgrade: false,

    onEnter: function () {
        cc.log("UsePillLabel onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("UsePillLabel init");

        if (!this._super())  return false;

        this._usePillLabelFit = gameFit.mainScene.usePillLabel;

        this._leadCard = null;
        this._effect= null;
        this._showUpgrade = false;

        this._awakenEffect = cc.BuilderReader.load(main_scene_image.uiEffect115, this);
        this._awakenEffect.setPosition(this._usePillLabelFit.awakenEffectPoint);
        this.addChild(this._awakenEffect);

        var pillIcon = cc.Sprite.create(main_scene_image.icon459);
        pillIcon.setPosition(this._usePillLabelFit.pillIconPoint);
        this.addChild(pillIcon);

        var pillIconLabel = cc.LabelTTF.create("觉醒玉:", "STHeitiTC-Medium", 22);
        pillIconLabel.setColor(cc.c3b(255, 239, 131));
        pillIconLabel.setPosition(this._usePillLabelFit.pillIconLabelPoint);
        this.addChild(pillIconLabel);

        this._pillLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._pillLabel.setAnchorPoint(cc.p(0, 0.5));
        this._pillLabel.setPosition(this._usePillLabelFit.pillLabelPoint);
        this.addChild(this._pillLabel);

        var helpBgSprite = cc.Sprite.create(main_scene_image.icon50);
        helpBgSprite.setPosition(this._usePillLabelFit.helpBgSpritePoint);
        this.addChild(helpBgSprite);

        this._tipLabel = cc.LabelTTF.create("神仙一旦觉醒，基础属性大量加成", "STHeitiTC-Medium", 22);
        this._tipLabel.setPosition(this._usePillLabelFit.tipLabelPoint);
        this.addChild(this._tipLabel);

        this._helpLabel = cc.Node.create();
        this._helpLabel.setPosition(this._usePillLabelFit.helpLabelPoint);
        this.addChild(this._helpLabel);

        var needPillLabel = cc.LabelTTF.create("觉醒需要觉醒玉:", "STHeitiTC-Medium", 22);
        needPillLabel.setPosition(cc.p(-44, 0));
        this._helpLabel.addChild(needPillLabel);

        this._needPillLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._needPillLabel.setAnchorPoint(cc.p(0, 0.5));
        this._needPillLabel.setPosition(cc.p(44, -2));
        this._helpLabel.addChild(this._needPillLabel);

        this._resLabel = cc.Node.create();
        this._resLabel.setPosition(this._usePillLabelFit.resLabelPoint);
        this.addChild(this._resLabel);

        var resLabelBgSprite = cc.Sprite.create(main_scene_image.icon49);
        this._resLabel.addChild(resLabelBgSprite);

        this._nameLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 25);
        this._nameLabel.setColor(cc.c3b(255, 239, 131));
        this._nameLabel.setPosition(cc.p(0, 40));
        this._resLabel.addChild(this._nameLabel);

        var skillLvIcon = cc.LabelTTF.create("觉醒等级:", "STHeitiTC-Medium", 22);
        skillLvIcon.setColor(cc.c3b(255, 239, 131));
        skillLvIcon.setPosition(cc.p(-85, 2));
        this._resLabel.addChild(skillLvIcon);

        this._awakenLvLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._awakenLvLabel.setPosition(cc.p(0, 0));
        this._resLabel.addChild(this._awakenLvLabel);

        this._nextAwakenLvLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._nextAwakenLvLabel.setColor(cc.c3b(118, 238, 60));
        this._nextAwakenLvLabel.setPosition(cc.p(100, 0));
        this._resLabel.addChild(this._nextAwakenLvLabel);

        var skillHarmIcon = cc.LabelTTF.create("觉醒加成:", "STHeitiTC-Medium", 22);
        skillHarmIcon.setColor(cc.c3b(255, 239, 131));
        skillHarmIcon.setPosition(cc.p(-85, -33));
        this._resLabel.addChild(skillHarmIcon);

        this._awakenAdditionLabel = cc.LabelTTF.create("0%", "STHeitiTC-Medium", 22);
        this._awakenAdditionLabel.setPosition(cc.p(0, -35));
        this._resLabel.addChild(this._awakenAdditionLabel);

        this._nextAwakenAdditionLabel = cc.LabelTTF.create("0%", "STHeitiTC-Medium", 22);
        this._nextAwakenAdditionLabel.setColor(cc.c3b(118, 238, 60));
        this._nextAwakenAdditionLabel.setPosition(cc.p(100, -35));
        this._resLabel.addChild(this._nextAwakenAdditionLabel);

        this._arrowLabel1 = cc.Sprite.create(main_scene_image.icon63);
        this._arrowLabel1.setPosition(cc.p(50, 0));
        this._resLabel.addChild(this._arrowLabel1);

        this._arrowLabel2 = cc.Sprite.create(main_scene_image.icon63);
        this._arrowLabel2.setPosition(cc.p(50, -35));
        this._resLabel.addChild(this._arrowLabel2);

        this._awakenItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon463,
            this._onClickAwaken,
            this
        );
        this._awakenItem.setPosition(this._usePillLabelFit.awakenItemPoint);

        var helpItem = cc.MenuItemImage.create(
            main_scene_image.button41,
            main_scene_image.button41s,
            this._onClickHelp,
            this
        );

        helpItem.setPosition(this._usePillLabelFit.helpItemPoint);

        var menu = cc.Menu.create(
            helpItem,
            this._awakenItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    update: function () {
        cc.log("UsePillLabel update");

        var pill = gameData.player.get("pill");
        this._pillLabel.setString(pill);

        if (this._leadCardHalfNode != null) {
            this._leadCardHalfNode.removeFromParent();
            this._leadCardHalfNode = null;
        }

        if (this._leadCard == null) {
            this._awakenItem.setEnabled(false);
            this._resLabel.setVisible(false);
            this._tipLabel.setVisible(true);
            this._helpLabel.setVisible(false);

        } else {
            this._leadCardHalfNode = CardHalfNode.create(this._leadCard);
            this._leadCardHalfNode.setScale(1.1);
            this._leadCardHalfNode.setPosition(this._usePillLabelFit.leadCardHalfNodePoint);
            this.addChild(this._leadCardHalfNode, 1);

            this._nameLabel.setString(this._leadCard.get("name"));

            var upgradeNeedPill = this._leadCard.getUpgradeNeedPill();

            if (upgradeNeedPill > pill) {
                this._needPillLabel.setColor(cc.c3b(255, 40, 40));
            } else {
                this._needPillLabel.setColor(cc.c3b(255, 255, 255));
            }

            this._needPillLabel.setString(upgradeNeedPill);

            this._awakenLvLabel.setString(this._leadCard.get("potentialLv"));
            this._awakenAdditionLabel.setString(this._leadCard.getPotentialLvAddition() + "%");

            if (this._showUpgrade) {
                this._showUpgrade = false;

                var moveByAction = cc.Sequence.create(
                    cc.MoveBy.create(0.1, cc.p(5, 0)),
                    cc.MoveBy.create(0.1, cc.p(-5, 0)),
                    cc.MoveBy.create(0.1, cc.p(5, 0)),
                    cc.MoveBy.create(0.1, cc.p(-5, 0))
                );
                var scaleToAction = cc.Sequence.create(
                    cc.ScaleTo.create(0.1, 1.5),
                    cc.ScaleTo.create(0.1, 1),
                    cc.ScaleTo.create(0.1, 1.5),
                    cc.ScaleTo.create(0.1, 1)

                );
                var spawnAction = cc.Spawn.create(moveByAction, scaleToAction);

                this._awakenLvLabel.runAction(spawnAction.clone());
                this._awakenAdditionLabel.runAction(spawnAction.clone());
            }

            if (this._leadCard.canUpgradePotentialLv()) {
                this._arrowLabel1.setVisible(true);
                this._arrowLabel2.setVisible(true);

                this._nextAwakenLvLabel.setString(this._leadCard.get("potentialLv") + 1);
                this._nextAwakenAdditionLabel.setString(this._leadCard.getNextPotentialLvAddition() + "%");
            } else {
                this._arrowLabel1.setVisible(false);
                this._arrowLabel2.setVisible(false);

                this._nextSkillLvLabel.setString("已满级");
                this._nextSkillHarmLabel.setString("已满级");
            }

            this._resLabel.setVisible(true);
            this._tipLabel.setVisible(false);
            this._helpLabel.setVisible(true);

            this._awakenItem.setEnabled(this._leadCard.canUpgradePotentialLv());
        }

    },

    ccbFnCallback: function () {
        cc.log("UsePillLabel ccbFnCallback");

        this._onClickSelectLeadCard();
    },

    _onClickSelectLeadCard: function () {
        cc.log("UsePillLabel _onClickSelectLeadCard");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._effect != null) {
            this._effect.removeFromParent();
            this._effect = null;
        }

        var that = this;
        var cardListLayer = CardListLayer.create(SELECT_TYPE_CARD_USE_PILL_MASTER, function (data) {
            cc.log(data);

            if (data) {
                that._leadCard = data[0] || null;
            }

            that.getParent().backToThisLayer();

            cc.log("this._leadCard :");
            cc.log(that._leadCard);
        }, {
            leadCard: this._leadCard
        });

        this.getParent().switchToCardListLayer(cardListLayer);
    },

    _onClickAwaken: function () {
        cc.log("UsePillLabel _onClickAwaken");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var card = this._leadCard;

        if (!card.canUpgradePotentialLv()) {
            TipLayer.tip("已达到满级");
            return;
        }

        if (card.get("star") <= card.get("potentialLv")) {
            TipLayer.tip("升星开启下一级");
            return;
        }

        if (gameData.player.get("pill") < card.getUpgradeNeedPill()) {
            TipLayer.tip("觉醒玉不足");
            return;
        }

        var that = this;
        this._leadCard.usePill(function () {
            if (that._effect != null) {
                that._effect.removeFromParent();
                that._effect = null;
            }

            that._effect = cc.BuilderReader.load(main_scene_image.uiEffect116, this);
            that._effect.setPosition(that._usePillLabelFit.leadCardHalfNodePoint);
            that._effect.animationManager.setCompletedAnimationCallback(this, function () {
                that._effect.removeFromParent();
                that._effect = null;
            });
            that.addChild(that._effect, 10);
            that._showUpgrade = true;
            that.update();
        });

    },

    _onClickHelp: function () {
        cc.log("UsePillLabel _onClickHelp");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        GameHelpLabel.pop(gameHelp["usePill"]);
    }

});

UsePillLabel.create = function () {
    cc.log("UsePillLabel create");

    var ret = new UsePillLabel();
    if (ret && ret.init()) {
        return ret;
    }
    return null;
};

UsePillLabel.canEnter = function () {

    var limitLv = outputTables.function_limit.rows[1].use_pill;
    var lv = gameData.player.get("lv");

    if (lv >= limitLv) {
        return true;
    }

    TipLayer.tip("觉醒" + limitLv + "级开放");

    return false;
};