/**
 * Created by lujunyu on 14-2-27.
 */

var BossLayer = cc.Layer.extend({
    _bossLayerFit: null,

    _addition: 0,
    _cdTIme: 0,
    _bossId: null,

    onEnter: function () {
        cc.log("BossLayer onEnter");

        this._super();
        this.update();
    },

    init: function (id) {
        cc.log("BossLayer init");

        if (!this._super()) return false;

        this._bossLayerFit = gameFit.mainScene.bossLayer;

        this._addition = 0;
        this._bossId = id;
        this._cdTime = gameData.boss.get("cd");

        var boss = gameData.boss.getBoss(id);

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._bossLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._bossLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon394);
        titleIcon.setPosition(this._bossLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var bgEffect = cc.BuilderReader.load(main_scene_image.uiEffect3, this);
        bgEffect.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(bgEffect);

        var headLabel = cc.Sprite.create(main_scene_image.icon147);
        headLabel.setAnchorPoint(cc.p(0, 0));
        headLabel.setPosition(this._bossLayerFit.headLabelPoint);
        this.addChild(headLabel);

        var goldIcon = cc.Sprite.create(main_scene_image.icon148);
        goldIcon.setPosition(this._bossLayerFit.goldIconPoint);
        this.addChild(goldIcon);

        this._goldLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 20);
        this._goldLabel.setAnchorPoint(cc.p(0, 0.5));
        this._goldLabel.setPosition(this._bossLayerFit.goldLabelPoint);
        this.addChild(this._goldLabel);

        var bossTable = outputTables.boss.rows[boss.tableId];
        var bossCard = Card.create({
            tableId: bossTable.boss_id,
            lv: 1,
            skillLv: 1
        });

        var bossCardHalfNode = CardHalfNode.create(bossCard);
        bossCardHalfNode.setPosition(this._bossLayerFit.bossCardPoint);
        this.addChild(bossCardHalfNode);

        var addition = outputTables.boss_type_rate.rows[bossTable.type].reward_inc;
        var point = this._bossLayerFit.bossNameLabelPoint;

        if (addition > 0) {
            var rewardAdditionLabel = ColorLabelTTF.create(
                {
                    string: "（奖励加成",
                    fontName: "STHeitiTC-Medium",
                    fontSize: 22,
                    isStroke: true
                },
                {
                    string: addition + "%",
                    fontName: "STHeitiTC-Medium",
                    fontSize: 22,
                    isStroke: true,
                    color: cc.c3b(117, 255, 57)
                },
                {
                    string: "）",
                    fontName: "STHeitiTC-Medium",
                    fontSize: 22,
                    isStroke: true
                }
            );
            rewardAdditionLabel.setAnchorPoint(cc.p(0, 0));
            rewardAdditionLabel.setPosition(cc.p(gameFit.GAME_MIDPOINT.x, point.y + 15));
            this.addChild(rewardAdditionLabel);
        }

        var card = outputTables.cards.rows[bossTable.boss_id];

        var bossNameLabel = StrokeLabel.create(card.name, "STHeitiTC-Medium", 35);
        if (addition > 0) {
            bossNameLabel.setAnchorPoint(cc.p(1, 0));
        } else {
            bossNameLabel.setAnchorPoint(cc.p(0.5, 0));
        }

        bossNameLabel.setPosition(point);
        bossNameLabel.setColor(cc.c3b(252, 254, 143));
        bossNameLabel.setBgColor(cc.c3b(54, 7, 14));
        this.addChild(bossNameLabel);

        var runAwayTimeLabel = StrokeLabel.create("逃跑时间: ", "STHeitiTC-Medium", 22);
        runAwayTimeLabel.setAnchorPoint(cc.p(0.5, 0));
        runAwayTimeLabel.setPosition(this._bossLayerFit.runAwayLabelPoint);
        this.addChild(runAwayTimeLabel);

        this._bossCdTimeLabel = StrokeLabel.create(
            lz.getCountdownStr(boss.timeLeft),
            "STHeitiTC-Medium",
            22
        );
        this._bossCdTimeLabel.setAnchorPoint(cc.p(0.5, 0));
        this._bossCdTimeLabel.setPosition(this._bossLayerFit.bossCdTimeLabelPoint);
        this.addChild(this._bossCdTimeLabel);

        this._countLeftLabel = StrokeLabel.create("剩余攻击次数: " + boss.countLeft + "次", "STHeitiTC-Medium", 25);
        this._countLeftLabel.setAnchorPoint(cc.p(0.5, 0));
        this._countLeftLabel.setPosition(this._bossLayerFit.countLeftLabelPoint);
        this._countLeftLabel.setColor(cc.c3b(255, 255, 255));
        this._countLeftLabel.setBgColor(cc.c3b(94, 11, 11));
        this.addChild(this._countLeftLabel);

        var additionBgLabel = cc.Sprite.create(main_scene_image.icon401);
        additionBgLabel.setAnchorPoint(cc.p(0.5, 0));
        additionBgLabel.setScaleX(1.2);
        additionBgLabel.setPosition(this._bossLayerFit.additionBgLabelPoint);
        this.addChild(additionBgLabel);

        this._additionLabel = cc.LabelTTF.create("攻击及生命加成: 0%", "STHeitiTC-Medium", 20);
        this._additionLabel.setAnchorPoint(cc.p(0.5, 0));
        this._additionLabel.setPosition(this._bossLayerFit.additionLabelPoint);
        this.addChild(this._additionLabel);

        var attackCdTimeLabel = StrokeLabel.create("攻击冷却时间: ", "STHeitiTC-Medium", 22);
        attackCdTimeLabel.setAnchorPoint(cc.p(0.5, 0));
        attackCdTimeLabel.setPosition(this._bossLayerFit.attackCdTimeLabelPoint);
        this.addChild(attackCdTimeLabel);

        this._cdTimeLabel = StrokeLabel.create(
            lz.getCountdownStr(this._cdTime),
            "STHeitiTC-Medium",
            22
        );

        this._cdTimeLabel.setAnchorPoint(cc.p(0.5, 0));
        this._cdTimeLabel.setPosition(this._bossLayerFit.cdTimeLabelPoint);
        this.addChild(this._cdTimeLabel);

        this._attackNode = cc.Node.create();
        this._attackNode.setPosition(cc.p(0, 0));
        this.addChild(this._attackNode, 2);

        var attackIcon = cc.Sprite.create(main_scene_image.icon400);
        attackIcon.setAnchorPoint(cc.p(0.5, 0));
        attackIcon.setPosition(this._bossLayerFit.attackIconPoint);
        this._attackNode.addChild(attackIcon);
        this._attackNode.setVisible(false);

        var goldIcon2 = cc.Sprite.create(main_scene_image.icon148);
        goldIcon2.setScale(0.8);
        goldIcon2.setAnchorPoint(cc.p(0.5, 0));
        goldIcon2.setPosition(this._bossLayerFit.goldIcon2Point);
        this._attackNode.addChild(goldIcon2);

        this._expendGoldLabel = StrokeLabel.create("0", "STHeitiTC-Medium", 20);
        this._expendGoldLabel.setColor(cc.c3b(255, 255, 255));
        this._expendGoldLabel.setBgColor(cc.c3b(54, 7, 14));
        this._expendGoldLabel.setAnchorPoint(cc.p(0, 0));
        this._expendGoldLabel.setPosition(this._bossLayerFit.goldLabel2Point);
        this._attackNode.addChild(this._expendGoldLabel);

        this._attackIcon = cc.Sprite.create(main_scene_image.icon402);
        this._attackIcon.setAnchorPoint(cc.p(0.5, 0));
        this._attackIcon.setPosition(this._bossLayerFit.attackIcon2Point);
        this.addChild(this._attackIcon, 2);

        this._addItem = cc.MenuItemImage.create(
            main_scene_image.button16,
            main_scene_image.button16s,
            this._onClickAdd,
            this
        );

        this._addItem.setAnchorPoint(cc.p(0.5, 0));
        this._addItem.setScale(1.2);
        this._addItem.setPosition(this._bossLayerFit.addItemPoint);

        this._subItem = cc.MenuItemImage.create(
            main_scene_image.button35,
            main_scene_image.button35s,
            this._onClickSub,
            this
        );

        this._subItem.setAnchorPoint(cc.p(0.5, 0));
        this._subItem.setScale(1.2);
        this._subItem.setPosition(this._bossLayerFit.subItemPoint);

        this._attackItem = cc.MenuItemImage.create(
            main_scene_image.button1,
            main_scene_image.button1s,
            main_scene_image.button1d,
            this._onClickAttack,
            this
        );

        this._attackItem.setAnchorPoint(cc.p(0.5, 0));
        this._attackItem.setScale(0.8);
        this._attackItem.setPosition(this._bossLayerFit.attackItemPoint);

        this._removeCdTimeItem = cc.MenuItemImage.create(
            main_scene_image.button33,
            main_scene_image.button33s,
            this._onClickRemoveCdTime,
            this
        );

        this._removeCdTimeItem.setAnchorPoint(cc.p(0.5, 0));
        this._removeCdTimeItem.setPosition(this._bossLayerFit.removeCdTimeItemPoint);
        this._removeCdTimeItem.setVisible(this._cdTime > 0);

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );

        backItem.setPosition(this._bossLayerFit.backItemPoint);

        var attackRecordItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon398,
            this._onClickAttackRecord,
            this
        );

        attackRecordItem.setPosition(this._bossLayerFit.attackRecordItemPoint);

        var helpItem = cc.MenuItemImage.create(
            main_scene_image.button41,
            main_scene_image.button41s,
            this._onClickHelp,
            this
        );

        helpItem.setPosition(this._bossLayerFit.helpItemPoint);

        var menu = cc.Menu.create(this._addItem, this._subItem, this._attackItem, this._removeCdTimeItem, backItem, attackRecordItem, helpItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this.schedule(this._updateCdTime, UPDATE_CD_TIME_INTERVAL);

        return true;
    },

    update: function () {
        cc.log("BossLayer update");

        this._goldLabel.setString(gameData.player.get("gold"));
        this._additionLabel.setString("攻击及生命加成: " + this._addition * 20 + "%");

        this._attackIcon.setVisible(this._addition == 0);
        this._attackNode.setVisible(this._addition != 0);
        this._expendGoldLabel.setString(gameData.boss.additionNeedGold(this._addition));

        var boss = gameData.boss.getBoss(this._bossId);
        this._countLeftLabel.setString("剩余攻击次数: " + boss.countLeft + "次");

        var isEnabled = boss.countLeft > 0 && boss.status != BOSS_STATUS_DIE;
        this._attackItem.setEnabled(isEnabled);
        this._addItem.setEnabled(isEnabled);
        this._subItem.setEnabled(isEnabled);

    },

    _updateCdTime: function () {

        this._cdTime = gameData.boss.get("cd");

        this._cdTimeLabel.setString(lz.getCountdownStr(this._cdTime));

        this._removeCdTimeItem.setVisible(this._cdTime > 0);

        var boss = gameData.boss.getBoss(this._bossId);
        this._bossCdTimeLabel.setString(lz.getCountdownStr(boss.timeLeft));
    },

    _onClickAdd: function () {
        cc.log("BossLayer _onClickAdd");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (gameData.boss.canAddition(this._addition + 1)) {
            this._addition++;
            this.update();

            var effect = cc.BuilderReader.load(main_scene_image.uiEffect92, this);
            effect.setScale(0.8);
            effect.setPosition(this._bossLayerFit.effectPoint);
            this.addChild(effect);

            effect.animationManager.setCompletedAnimationCallback(this, function () {
                effect.removeFromParent();
            });
        }
    },

    _onClickSub: function () {
        cc.log("BossLayer _onClickSub");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (gameData.boss.canAddition(this._addition - 1)) {
            this._addition--;
            this.update();
        }
    },

    _onClickAttack: function () {
        cc.log("BossLayer _onClickAttack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;

        if (this._cdTime > 0) {
            TipLayer.tip("冷却时间未到");
            return;
        }

        var cb = function () {
            that._addition = 0;
            that.update();
        };

        gameData.boss.attack(function (battleLogId) {
            BattlePlayer.getInstance().play({
                cb: cb,
                id: battleLogId
            });
        }, this._bossId, this._addition);

    },

    _onClickRemoveCdTime: function () {
        cc.log("BossLayer _onClickRemoveCdTime");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;

        AdvancedTipsLabel.pop(TYPE_REMOVE_CD_TIPS, function () {
            gameData.boss.removeTimer(function () {
                that.update();
            });
        });
    },

    _onClickBack: function () {
        cc.log("BossLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        MainScene.getInstance().switchLayer(BossListLayer);
    },

    _onClickAttackRecord: function () {
        cc.log("BossLayer _onClickAttackRecord");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        AttackDetailsLayer.pop(this._bossId);
    },

    _onClickHelp: function () {
        cc.log("BossLayer _onClickHelp");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        BossHelpLabel.pop();
    }

});

BossLayer.create = function (id) {
    cc.log("BossLayer create: " + id);

    var ref = new BossLayer();
    if (ref && ref.init(id)) {
        return ref;
    }
    return null;
};