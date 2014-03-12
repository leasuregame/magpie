/**
 * Created by lujunyu on 14-2-26.
 */

var STOP_TIME = -1000 * 3600 * 8;

var BossListLayer = cc.Layer.extend({
    _bossListLayerFit: null,

    _cdTime: null,
    _cdTimeLabel: null,
    _removeTimeItem: null,
    _rewardItem: null,
    _exchangeItem: null,
    _scrollView: null,
    _timeLabel: null,

    onEnter: function () {
        cc.log("BossListLayer onEnter");

        this._super();
        this.update();

        lz.um.beginLogPageView("Boss界面");
    },

    onExit: function () {
        cc.log("BossListLayer onExit");

        this._super();

        lz.um.endLogPageView("Boss界面");
    },

    init: function () {
        cc.log("BossListLayer init");

        if (!this._super()) return false;

        this._bossListLayerFit = gameFit.mainScene.bossListLayer;

        this._cdTime = gameData.boss.get("cd");
        this._timeLabel = [];

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._bossListLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._bossListLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon394);
        titleIcon.setPosition(this._bossListLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var cdTimeIcon = cc.Sprite.create(main_scene_image.icon412);
        cdTimeIcon.setPosition(this._bossListLayerFit.cdTimeIconPoint);
        this.addChild(cdTimeIcon);

        var tipLabel = cc.LabelTTF.create("最后一次攻击，奖励翻倍", "STHeitiTC-Medium", 18);
        tipLabel.setPosition(this._bossListLayerFit.tipLabelPoint);
        this.addChild(tipLabel);

        var nextAttackLabel = cc.LabelTTF.create("下次攻击 ", "STHeitiTC-Medium", 22);
        nextAttackLabel.setPosition(this._bossListLayerFit.nextAttackLabelPoint);
        this.addChild(nextAttackLabel);

        this._cdTimeLabel = cc.LabelTTF.create(
            lz.getTimeStr({
                time: this._cdTime + STOP_TIME
            }),
            "STHeitiTC-Medium",
            22
        );

        this._cdTimeLabel.setPosition(this._bossListLayerFit.cdTimeLabelPoint);
        this.addChild(this._cdTimeLabel);

        var bottomIcon = cc.Sprite.create(main_scene_image.icon287);
        bottomIcon.setAnchorPoint(cc.p(0, 0));
        bottomIcon.setPosition(this._bossListLayerFit.bottomIconPoint);
        bottomIcon.setScaleY(1.1);
        this.addChild(bottomIcon);

        var goodsBgLabel = cc.Sprite.create(main_scene_image.icon392);
        goodsBgLabel.setAnchorPoint(cc.p(0, 0));
        goodsBgLabel.setPosition(this._bossListLayerFit.goodsBgLabelPoint);
        this.addChild(goodsBgLabel);

        this._honorLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._honorLabel.setAnchorPoint(cc.p(0, 0));
        this._honorLabel.setPosition(this._bossListLayerFit.honorLabelPoint);
        this.addChild(this._honorLabel);

        this._canExchangeLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._canExchangeLabel.setAnchorPoint(cc.p(0, 0));
        this._canExchangeLabel.setPosition(this._bossListLayerFit.canExchangeLabelPoint);
        this.addChild(this._canExchangeLabel);

        var superHonorIcon = cc.Sprite.create(main_scene_image.icon406);
        superHonorIcon.setAnchorPoint(cc.p(0, 0));
        superHonorIcon.setPosition(this._bossListLayerFit.superHonorIconPoint);
        this.addChild(superHonorIcon);

        this._superHonorLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._superHonorLabel.setAnchorPoint(cc.p(0, 0));
        this._superHonorLabel.setPosition(this._bossListLayerFit.superHonorLabelPoint);
        this.addChild(this._superHonorLabel);

        this._removeTimeItem = cc.MenuItemImage.create(
            main_scene_image.button33,
            main_scene_image.button33s,
            this._onClickRemoveTime,
            this
        );

        this._removeTimeItem.setPosition(this._bossListLayerFit.removeTimeItemPoint);
        this._removeTimeItem.setVisible(this._cdTime > 0);

        var sprite = cc.Sprite.create(main_scene_image.icon281);
        this._rewardItem = cc.MenuItemLabel.create(
            sprite,
            this._onClickReward,
            this
        );

        this._rewardItem.setScale(0.55);
        this._rewardItem.setPosition(this._bossListLayerFit.rewardItemPoint);

        this._effect = cc.BuilderReader.load(main_scene_image.uiEffect77, this);
        this._effect.setScale(0.48);
        this._effect.setPosition(this._bossListLayerFit.rewardItemPoint);
        this.addChild(this._effect);

        var rankItem = cc.MenuItemImage.create(
            main_scene_image.button7,
            main_scene_image.button7s,
            this._onClickRank,
            this
        );

        rankItem.setPosition(this._bossListLayerFit.rankItemPoint);

        this._exchangeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon252,
            this._onClickExchange,
            this
        );

        this._exchangeItem.setAnchorPoint(cc.p(0, 0));
        this._exchangeItem.setPosition(this._bossListLayerFit.exchangeItemPoint);

        var helpItem = cc.MenuItemImage.create(
            main_scene_image.button41,
            main_scene_image.button41s,
            this._onClickHelp,
            this
        );

        helpItem.setPosition(this._bossListLayerFit.helpItemPoint);

        var menu = cc.Menu.create(this._removeTimeItem, this._rewardItem, rankItem, this._exchangeItem, helpItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 2);

        this._tipIcon = cc.Sprite.create(main_scene_image.icon413);
        this._tipIcon.setPosition(this._bossListLayerFit.tipIconPoint);
        this._tipIcon.setVisible(false);
        this.addChild(this._tipIcon);

        this.schedule(this._updateCdTime, UPDATE_CD_TIME_INTERVAL);

        return true;
    },

    update: function () {
        cc.log("BossListLayer update");

        this._update();

        var that = this;
        gameData.boss.updateBossList(function () {
            that._addScrollView();
        });
    },

    _update: function () {
        cc.log("BossListLayer _update");

        var honor = gameData.player.get("honor");
        this._honorLabel.setString(honor);
        this._canExchangeLabel.setString(parseInt(honor / 6000));
        this._superHonorLabel.setString(gameData.player.get("superHonor"));

        var isCanReceive = gameData.boss.get("canReceive");
        this._effect.setVisible(isCanReceive);
    },

    _addScrollView: function () {
        cc.log("BossListLayer _addScrollView");

        if (this._scrollView) {
            this._scrollView.removeFromParent();
            this._scrollView = null;
        }

        this._timeLabel = [];

        var scrollViewLayer = MarkLayer.create(this._bossListLayerFit.scrollViewLayerRect);

        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        var bossList = gameData.boss.get("bossList");
        var len = bossList.length;
        var scrollViewHeight = len * 135;

        if (scrollViewHeight < this._bossListLayerFit.scrollViewHeight) {
            scrollViewHeight = this._bossListLayerFit.scrollViewHeight;
        }

        this._tipIcon.setVisible(len == 0);

        for (var i = 0; i < len; i++) {
            var y = scrollViewHeight - 78 - 136 * i;
            var boss = bossList[i];
            var bossItem = null;

            if (boss.finder == gameData.player.get("name")) {
                bossItem = cc.MenuItemImage.create(
                    main_scene_image.button45,
                    main_scene_image.button45s,
                    main_scene_image.button15d,
                    this._onClickBoss(boss.bossId),
                    this
                );
            } else {
                bossItem = cc.MenuItemImage.create(
                    main_scene_image.button15,
                    main_scene_image.button15s,
                    main_scene_image.button15d,
                    this._onClickBoss(boss.bossId),
                    this
                );
            }

            if (bossItem) {
                bossItem.setAnchorPoint(cc.p(0, 0.5));
                bossItem.setPosition(cc.p(25, y));
                menu.addChild(bossItem);
            }

            var bossIcon = CardHeadNode.create(Card.create({
                tableId: 194,
                lv: 1,
                skillLv: 1
            }));

            bossIcon.setAnchorPoint(cc.p(0, 0.5));
            bossIcon.setPosition(cc.p(45, y));
            scrollViewLayer.addChild(bossIcon);

            var msgBgIcon = cc.Sprite.create(main_scene_image.icon393);
            msgBgIcon.setAnchorPoint(cc.p(0, 0.5));
            msgBgIcon.setPosition(cc.p(155, y));
            scrollViewLayer.addChild(msgBgIcon);

            var bossId = outputTables.boss.rows[boss.tableId].boss_id;
            var card = outputTables.cards.rows[bossId];
            var bossTypeLabel = cc.LabelTTF.create(card.name, "STHeitiTC-Medium", 24);
            bossTypeLabel.setAnchorPoint(cc.p(0, 0.5));
            bossTypeLabel.setPosition(cc.p(200, y + 32));
            scrollViewLayer.addChild(bossTypeLabel);

            var runAwayTimeLabel = cc.LabelTTF.create(
                lz.getTimeStr({
                    time: boss.timeLeft + STOP_TIME
                }),
                "STHeitiTC-Medium",
                20
            );
            runAwayTimeLabel.setAnchorPoint(cc.p(0, 0.5));
            runAwayTimeLabel.setPosition(cc.p(260, y - 3));
            runAwayTimeLabel.setColor(cc.c3b(121, 60, 56));
            scrollViewLayer.addChild(runAwayTimeLabel);

            this._timeLabel[i] = runAwayTimeLabel;

            var finderLabel = cc.LabelTTF.create(boss.finder, "STHeitiTC-Medium", 20);
            finderLabel.setAnchorPoint(cc.p(0, 0.5));
            finderLabel.setPosition(cc.p(240, y - 33));
            finderLabel.setColor(cc.c3b(121, 60, 56));
            scrollViewLayer.addChild(finderLabel);

            var attackIcon = cc.Sprite.create(main_scene_image.icon391);
            attackIcon.setAnchorPoint(cc.p(0, 0.5));
            attackIcon.setPosition(cc.p(480, y + 15));
            scrollViewLayer.addChild(attackIcon);

            var bossStatusIcon = null;

            if (boss.status == BOSS_STATUS_FLEE) {
                bossStatusIcon = cc.Sprite.create(main_scene_image["icon396"]);
            }

            if (boss.status == BOSS_STATUS_DIE) {
                bossStatusIcon = cc.Sprite.create(main_scene_image["icon397"]);
            }

            if (bossStatusIcon) {
                bossStatusIcon.setAnchorPoint(cc.p(0, 0.5));
                bossStatusIcon.setPosition(cc.p(455, y + 30));
                scrollViewLayer.addChild(bossStatusIcon);
            }

            if (boss.status != BOSS_STATUS_DIE) {
                var countLeftLabel = cc.LabelTTF.create("剩余攻击次数: " + boss.countLeft + "次", "STHeitiTC-Medium", 20);
                countLeftLabel.setAnchorPoint(cc.p(0, 0.5));
                countLeftLabel.setPosition(cc.p(420, y - 33));
                countLeftLabel.setColor(cc.c3b(167, 28, 0));
                scrollViewLayer.addChild(countLeftLabel);
            } else {
                var killerIcon = cc.Sprite.create(main_scene_image.icon395);
                killerIcon.setAnchorPoint(cc.p(0, 0.5));
                killerIcon.setPosition(cc.p(390, y - 33));
                scrollViewLayer.addChild(killerIcon);

                var killerLabel = cc.LabelTTF.create(boss.killer, "STHeitiTC-Medium", 20);
                killerLabel.setAnchorPoint(cc.p(0, 0.5));
                killerLabel.setPosition(cc.p(470, y - 33));
                killerLabel.setColor(cc.c3b(121, 60, 56));
                scrollViewLayer.addChild(killerLabel);
            }

        }

        this._scrollView = cc.ScrollView.create(this._bossListLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setPosition(this._bossListLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());

    },

    _updateCdTime: function () {

        this._cdTime = gameData.boss.get("cd");
        this._cdTimeLabel.setString(lz.getTimeStr({
            time: this._cdTime + STOP_TIME
        }));

        this._removeTimeItem.setVisible(this._cdTime > 0);

        var bossList = gameData.boss.get("bossList");
        var len = bossList.length;
        for (var i = 0; i < len; i++) {
            var time = bossList[i].timeLeft;
            this._timeLabel[i].setString(lz.getTimeStr({
                time: time + STOP_TIME
            }));

        }
    },

    _onClickRemoveTime: function () {
        cc.log("BossListLayer _onClickRemoveTime");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;
        var cb = function () {
            gameData.boss.removeTimer(function () {
                that.update();
            });
        };

        RemoveCdTipLabel.pop({cb: cb});
    },

    _onClickReward: function () {
        cc.log("BossListLayer _onClickReward");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var isCanReceive = gameData.boss.get("canReceive");
        if (!isCanReceive) {
            TipLayer.tip("当前没有可领奖励");
            return;
        }

        var that = this;

        var cb = function () {
            gameData.boss.getFriendHelpReward(function (reward) {
                lz.tipReward(reward);
                that.update();
            })
        };

        gameData.boss.showFriendHelpRewardList(function (data) {
            BossRewardLabel.pop({
                data: data,
                cb: cb
            });
        });
    },

    _onClickRank: function () {
        cc.log("BossListLayer _onClickRank");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        DamageRankLayer.pop();
    },

    _onClickExchange: function () {
        cc.log("BossListLayer _onClickExchange");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var product = gameData.boss.exchangeSuperHonor();

        var that = this;
        AmountLayer.pop(
            function (count) {
                if (count > 0) {
                    gameData.boss.convertHonor(function () {
                        lz.tipReward({superHonor: count});
                        that._update();
                    }, count);
                }
            },
            product
        );

    },

    _onClickBoss: function (id) {
        var that = this;
        return function () {
            cc.log("BossListLayer _onClickBoss: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var bossLayer = BossLayer.create(id);
            MainScene.getInstance().switchTo(bossLayer);
        }
    },

    _onClickHelp: function () {
        cc.log("BossListLayer _onClickHelp");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        BossHelpLabel.pop();
    }

});

BossListLayer.create = function () {
    cc.log("BossListLayer create");

    var ref = new BossListLayer();

    if (ref && ref.init()) {
        return ref;
    }
    return null;
};