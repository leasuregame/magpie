/**
 * Created by lujunyu on 14-2-26.
 */

var STOP_TIME = 0;//(new Date().getTimezoneOffset() - 8) * 60 * 1000;//-1000 * 3600 * 8;

var BossListLayer = cc.Layer.extend({
    _bossListLayerFit: null,

    _cdTime: null,
    _cdTimeLabel: null,
    _removeTimeItem: null,
    _rewardItem: null,
    _exchangeItem: null,
    _scrollView: null,
    _timeLabel: null,
    _rankItemMark: null,

    onEnter: function () {
        cc.log("BossListLayer onEnter");

        this._super();
        this.update();
        this.updateGuide();
        this.updateMark();
        this._updateMark();

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
            lz.getCountdownStr(this._cdTime),
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

        var rankItemEffect = cc.BuilderReader.load(main_scene_image.uiEffect95, this);
        rankItemEffect.setPosition(this._bossListLayerFit.rankItemPoint);
        this.addChild(rankItemEffect);

        this._rankItemMark = cc.BuilderReader.load(main_scene_image.uiEffect34, this);
        this._rankItemMark.setPosition(cc.p(30, 30));
        rankItemEffect.addChild(this._rankItemMark);

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

        var menu = cc.Menu.create(this._removeTimeItem, this._rewardItem, this._exchangeItem, helpItem);
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

    _updateMark: function () {
        cc.log("BossListLayer _updateMark");

        gameMark.updateBossMark(false);
    },

    updateMark: function () {
        cc.log("BossListLayer updateMark");

        this._rankItemMark.setVisible(gameMark.getBossListMark());
    },

    _update: function () {
        cc.log("BossListLayer _update");

        var honor = gameData.player.get("honor");
        this._honorLabel.setString(honor);
        this._canExchangeLabel.setString(parseInt(honor / 6000));
        this._superHonorLabel.setString(gameData.player.get("superHonor"));

        this.updateEffect();
    },

    updateEffect: function () {
        cc.log("BossListLayer updateEffect");

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
        this._bossFleeIcons = [];

        var scrollViewLayer = MarkLayer.create(this._bossListLayerFit.scrollViewLayerRect);

        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        var bossList = gameData.boss.get("bossList");
        var len = bossList.length;
        var scrollViewHeight = len * 136;

        if (scrollViewHeight < this._bossListLayerFit.scrollViewHeight) {
            scrollViewHeight = this._bossListLayerFit.scrollViewHeight;
        }

        this._tipIcon.setVisible(len == 0);

        for (var i = 0; i < len; i++) {
            var y = scrollViewHeight - 68 - 136 * i;
            var boss = bossList[i];
            var bossItem = null;
            var bossTable = outputTables.boss.rows[boss.tableId];
            var bossCard = Card.create({
                tableId: bossTable.boss_id,
                lv: 1,
                skillLv: 1
            });

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

            var bossHeadNode = CardHeadNode.create(bossCard);
            bossHeadNode.setAnchorPoint(cc.p(0, 0.5));
            bossHeadNode.setPosition(cc.p(45, y));
            scrollViewLayer.addChild(bossHeadNode);

            var msgBgIcon = cc.Sprite.create(main_scene_image.icon393);
            msgBgIcon.setAnchorPoint(cc.p(0, 0.5));
            msgBgIcon.setPosition(cc.p(155, y));
            scrollViewLayer.addChild(msgBgIcon);

            var bossNameLabel = cc.LabelTTF.create(bossCard.get("name"), "STHeitiTC-Medium", 24);
            bossNameLabel.setAnchorPoint(cc.p(0, 0.5));
            bossNameLabel.setPosition(cc.p(197, y + 32));
            scrollViewLayer.addChild(bossNameLabel);

            var addition = outputTables.boss_type_rate.rows[bossTable.type].reward_inc;

            if (addition > 0) {
                var rewardAdditionLabel = ColorLabelTTF.create(
                    {
                        string: "奖励加成",
                        fontName: "STHeitiTC-Medium",
                        fontSize: 18,
                        isStroke: true
                    },
                    {
                        string: addition + "%",
                        fontName: "STHeitiTC-Medium",
                        fontSize: 18,
                        isStroke: true,
                        color: cc.c3b(117, 255, 57)
                    }
                );
                rewardAdditionLabel.setAnchorPoint(cc.p(0, 0));
                rewardAdditionLabel.setPosition(cc.p(330, y + 32));
                scrollViewLayer.addChild(rewardAdditionLabel);
            }

            var runAwayTimeLabel = cc.LabelTTF.create(
                lz.getCountdownStr(boss.timeLeft),
                "STHeitiTC-Medium",
                20
            );
            runAwayTimeLabel.setAnchorPoint(cc.p(0, 0.5));
            runAwayTimeLabel.setPosition(cc.p(260, y - 3));
            runAwayTimeLabel.setColor(cc.c3b(155, 31, 24));
            scrollViewLayer.addChild(runAwayTimeLabel);

            this._timeLabel[i] = runAwayTimeLabel;

            var finderLabel = cc.LabelTTF.create(boss.finder, "STHeitiTC-Medium", 20);
            finderLabel.setAnchorPoint(cc.p(0, 0.5));
            finderLabel.setPosition(cc.p(240, y - 33));
            finderLabel.setColor(cc.c3b(155, 31, 24));
            scrollViewLayer.addChild(finderLabel);

            var attackIcon = cc.Sprite.create(main_scene_image.icon391);
            attackIcon.setAnchorPoint(cc.p(0, 0.5));
            attackIcon.setPosition(cc.p(480, y + 15));
            scrollViewLayer.addChild(attackIcon);

            this._bossFleeIcons[i] = cc.Sprite.create(main_scene_image["icon396"]);
            this._bossFleeIcons[i].setAnchorPoint(cc.p(0, 0.5));
            this._bossFleeIcons[i].setPosition(cc.p(455, y + 30));
            scrollViewLayer.addChild(this._bossFleeIcons[i]);

            if (boss.status != BOSS_STATUS_FLEE && boss.status != BOSS_STATUS_TIMEOUT) {
                this._bossFleeIcons[i].setVisible(false);
            }

            if (boss.status == BOSS_STATUS_DIE) {
                var bossDieIcon = cc.Sprite.create(main_scene_image["icon397"]);
                bossDieIcon.setAnchorPoint(cc.p(0, 0.5));
                bossDieIcon.setPosition(cc.p(455, y + 30));
                scrollViewLayer.addChild(bossDieIcon);
            }

            if (boss.killer) {
                var killerLabel = StrokeLabel.create("最后攻击：" + boss.killer, "STHeitiTC-Medium", 20);
                killerLabel.setAnchorPoint(cc.p(0.5, 0.5));
                killerLabel.setPosition(cc.p(500, y - 33));
                killerLabel.setColor(cc.c3b(255, 255, 255));
                killerLabel.setBgColor(cc.c3b(155, 31, 24));
                scrollViewLayer.addChild(killerLabel);
            } else {
                var countLeftLabel = cc.LabelTTF.create("剩余攻击次数: " + boss.countLeft + "次", "STHeitiTC-Medium", 20);
                countLeftLabel.setAnchorPoint(cc.p(0, 0.5));
                countLeftLabel.setPosition(cc.p(420, y - 33));
                countLeftLabel.setColor(cc.c3b(167, 28, 0));
                scrollViewLayer.addChild(countLeftLabel);
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
        this._cdTimeLabel.setString(lz.getCountdownStr(this._cdTime));

        this._removeTimeItem.setVisible(this._cdTime > 0);

        var bossList = gameData.boss.get("bossList");
        var len = bossList.length;
        for (var i = 0; i < len; i++) {
            var time = bossList[i].timeLeft;
            this._timeLabel[i].setString(lz.getCountdownStr(time));

            if (time <= 0 && bossList[i].status != BOSS_STATUS_DIE) {
                this._bossFleeIcons[i].setVisible(true);
            }
        }
    },

    _onClickRemoveTime: function () {
        cc.log("BossListLayer _onClickRemoveTime");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;

        AdvancedTipsLabel.pop(TYPE_REMOVE_CD_TIPS, function () {
            gameData.boss.removeTimer(function () {
                that.update();
            });
        });
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

    ccbFnRank: function () {
        cc.log("BossListLayer ccbFnRank");

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
    },

    updateGuide: function () {
        cc.log("BossListLayer updateGuide");

        if (gameGuide.get("bossExplain")) {
            gameGuide.set("bossExplain", false);
            var url = gameGuide.getExplainEffect("boss");
            var effect = cc.BuilderReader.load(main_scene_image[url], this);
            effect.setPosition(gameFit.gameGuide.effectPoint);
            effect.animationManager.setCompletedAnimationCallback(this, function () {
                effect.removeFromParent();
            });
            this.addChild(effect, 10);
        }
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

BossListLayer.canEnter = function () {
    var limitLv = outputTables.function_limit.rows[1].boss;
    var lv = gameData.player.get("lv");

    if (lv >= limitLv) {
        return true;
    }

    TipLayer.tip("降魔" + limitLv + "级开放");

    return false;
};