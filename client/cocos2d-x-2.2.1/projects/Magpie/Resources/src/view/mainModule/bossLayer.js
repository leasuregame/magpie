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

        var cardFrame = cc.Sprite.create(main_scene_image.card_frame1);
        cardFrame.setAnchorPoint(cc.p(0.5, 0));
        cardFrame.setScale(1.5);
        cardFrame.setPosition(this._bossLayerFit.cardFramePoint);
        this.addChild(cardFrame);

        var bossCard = cc.Sprite.create(main_scene_image.boss_half);
        bossCard.setAnchorPoint(cc.p(0.5, 0));
        bossCard.setPosition(this._bossLayerFit.bossCardPoint);
        this.addChild(bossCard);

        var bossId = outputTables.boss.rows[boss.tableId].boss_id;
        var card = outputTables.cards.rows[bossId];
        var bossNameLabel = StrokeLabel.create(card.name, "STHeitiTC-Medium", 30);
        bossNameLabel.setAnchorPoint(cc.p(0.5, 0));
        bossNameLabel.setPosition(this._bossLayerFit.bossNameLabelPoint);
        bossNameLabel.setColor(cc.c3b(252, 254, 143));
        bossNameLabel.setBgColor(cc.c3b(54, 7, 14));
        this.addChild(bossNameLabel);

        var runAwayTimeLabel = cc.LabelTTF.create("逃跑时间: ", "STHeitiTC-Medium", 22);
        runAwayTimeLabel.setAnchorPoint(cc.p(0.5, 0));
        runAwayTimeLabel.setPosition(this._bossLayerFit.runAwayLabelPoint);
        this.addChild(runAwayTimeLabel);

        this._bossCdTimeLabel = cc.LabelTTF.create(
            lz.getTimeStr({
                time: boss.timeLeft + STOP_TIME
            }),
            "STHeitiTC-Medium",
            22
        );
        this._bossCdTimeLabel.setAnchorPoint(cc.p(0.5, 0));
        this._bossCdTimeLabel.setPosition(this._bossLayerFit.bossCdTimeLabelPoint);
        this.addChild(this._bossCdTimeLabel);

        this._countLeftLabel = StrokeLabel.create("剩余攻击次数: " + boss.countLeft + "次", "STHeitiTC-Medium", 25);
        this._countLeftLabel.setAnchorPoint(cc.p(0.5, 0));
        this._countLeftLabel.setPosition(this._bossLayerFit.countLeftLabelPoint);
        this._countLeftLabel.setColor(cc.c3b(237, 69, 69));
        this._countLeftLabel.setBgColor(cc.c3b(54, 7, 14));
        this.addChild(this._countLeftLabel);

        var inspireIcon = cc.Sprite.create(main_scene_image.icon399);
        inspireIcon.setAnchorPoint(cc.p(0.5, 0));
        inspireIcon.setPosition(this._bossLayerFit.inspireIconPoint);
        this.addChild(inspireIcon);

        var additionBgLabel = cc.Sprite.create(main_scene_image.icon401);
        additionBgLabel.setAnchorPoint(cc.p(0.5, 0));
        additionBgLabel.setPosition(this._bossLayerFit.additionBgLabelPoint);
        this.addChild(additionBgLabel);

        this._additionLabel = cc.LabelTTF.create("攻击加成: 0%", "STHeitiTC-Medium", 20);
        this._additionLabel.setAnchorPoint(cc.p(0.5, 0));
        this._additionLabel.setPosition(this._bossLayerFit.additionLabelPoint);
        this.addChild(this._additionLabel);

        var attackCdTimeLabel = cc.LabelTTF.create("攻击冷却时间: ", "STHeitiTC-Medium", 22);
        attackCdTimeLabel.setAnchorPoint(cc.p(0.5, 0));
        attackCdTimeLabel.setPosition(this._bossLayerFit.attackCdTimeLabelPoint);
        this.addChild(attackCdTimeLabel);

        this._cdTimeLabel = cc.LabelTTF.create(
            lz.getTimeStr({
                time: this._cdTime + STOP_TIME
            }),
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
        attackIcon.setScale(0.8);
        attackIcon.setAnchorPoint(cc.p(0.5, 0));
        attackIcon.setPosition(this._bossLayerFit.attackIconPoint);
        this._attackNode.addChild(attackIcon);
        this._attackNode.setVisible(false);

        var goldIcon2 = cc.Sprite.create(main_scene_image.icon148);
        goldIcon2.setScale(0.5);
        goldIcon2.setAnchorPoint(cc.p(0.5, 0));
        goldIcon2.setPosition(this._bossLayerFit.goldIcon2Point);
        this._attackNode.addChild(goldIcon2);

        this._expendGoldLabel = StrokeLabel.create("0", "STHeitiTC-Medium", 16);
        this._expendGoldLabel.setColor(cc.c3b(255, 255, 255));
        this._expendGoldLabel.setBgColor(cc.c3b(54, 7, 14));
        this._expendGoldLabel.setAnchorPoint(cc.p(0, 0));
        this._expendGoldLabel.setPosition(this._bossLayerFit.goldLabel2Point);
        this._attackNode.addChild(this._expendGoldLabel);

        this._attackIcon = cc.Sprite.create(main_scene_image.icon402);
        this._attackIcon.setAnchorPoint(cc.p(0.5, 0));
        this._attackIcon.setPosition(this._bossLayerFit.attackIcon2Point);
        this.addChild(this._attackIcon, 2);

        var addItem = cc.MenuItemImage.create(
            main_scene_image.button16,
            main_scene_image.button16s,
            this._onClickAdd,
            this
        );

        addItem.setAnchorPoint(cc.p(0.5, 0));
        addItem.setScale(1.2);
        addItem.setPosition(this._bossLayerFit.addItemPoint);

        var subItem = cc.MenuItemImage.create(
            main_scene_image.button35,
            main_scene_image.button35s,
            this._onClickSub,
            this
        );

        subItem.setAnchorPoint(cc.p(0.5, 0));
        subItem.setScale(1.2);
        subItem.setPosition(this._bossLayerFit.subItemPoint);

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

        var menu = cc.Menu.create(addItem, subItem, this._attackItem, this._removeCdTimeItem, backItem, attackRecordItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this.schedule(this._updateCdTime, UPDATE_CD_TIME_INTERVAL);

        return true;
    },

    update: function () {
        cc.log("BossLayer update");

        this._goldLabel.setString(gameData.player.get("gold"));
        this._additionLabel.setString("攻击加成: " + this._addition * 20 + "%");

        this._attackIcon.setVisible(this._addition == 0);
        this._attackNode.setVisible(this._addition != 0);
        this._expendGoldLabel.setString(gameData.boss.needGold(this._addition));

        var boss = gameData.boss.getBoss(this._bossId);
        this._countLeftLabel.setString("剩余攻击次数: " + boss.countLeft + "次");
        this._attackItem.setEnabled(boss.countLeft > 0 && boss.status != BOSS_STATUS_DIE);

    },

    _updateCdTime: function () {

        this._cdTime = gameData.boss.get("cd");
        this._cdTimeLabel.setString(lz.getTimeStr({
            time: this._cdTime + STOP_TIME
        }));

        this._removeCdTimeItem.setVisible(this._cdTime > 0);

        var boss = gameData.boss.getBoss(this._bossId);
        this._bossCdTimeLabel.setString(
            lz.getTimeStr({
                time: boss.timeLeft + STOP_TIME
            })
        );
    },

    _onClickAdd: function () {
        cc.log("BossLayer _onClickAdd");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (gameData.boss.canAddition(this._addition + 1)) {
            this._addition++;
            this.update();
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

        var next = function () {

            var cb = function () {
                that._addition = 0;
                that.update();
            };

            gameData.boss.attack(function (battleLogId) {
                BattlePlayer.getInstance().play({
                    cb: cb,
                    id: battleLogId
                });
            }, that._bossId, that._addition);
        };

        if (this._cdTime > 0) {
            var cb = function () {
                gameData.boss.removeTimer(function () {
                    that.update();
                    next();
                });
            };
            RemoveCdTipLabel.pop({cb: cb});
        } else {
            next();
        }
    },

    _onClickRemoveCdTime: function () {
        cc.log("BossLayer _onClickRemoveCdTime");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;
        var cb = function () {
            gameData.boss.removeTimer(function () {
                that.update();
            });
        };

        RemoveCdTipLabel.pop({cb: cb});
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