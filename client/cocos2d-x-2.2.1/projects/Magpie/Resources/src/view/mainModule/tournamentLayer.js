/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-20
 * Time: 下午4:54
 * To change this template use File | Settings | File Templates.
 */


/*
 * tournament layer
 * */


var TournamentLayer = cc.Layer.extend({
    _tournamentLayerFit: null,

    _rankList: [],
    _selectId: 0,
    _scrollView: null,
    _rewardLabel: null,
    _rewardItem: null,
    _rewardEffect: null,
    _expProgress: null,
    _lvLabel: null,
    _rankingLabel: null,
    _countLabel: null,
    _selectRect: null,
    _isTouch: false,
    _rankItemMark: false,

    onEnter: function () {
        cc.log("TournamentLayer onEnter");

        this._super();
        this.update();

        lz.um.beginLogPageView("竞技界面");
    },

    onExit: function () {
        cc.log("TournamentLayer onExit");

        this._super();

        lz.um.endLogPageView("竞技界面");
    },

    init: function () {
        cc.log("TournamentLayer init");

        if (!this._super()) return false;

        this.setTouchMode(cc.TOUCHES_ONE_BY_ONE);
        this.setTouchEnabled(true);

        this._tournamentLayerFit = gameFit.mainScene.tournamentLayer;

        this._rankList = [];
        this._selectRect = this._tournamentLayerFit.selectRect;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._tournamentLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var playerLabel = cc.Sprite.create(main_scene_image.icon31);
        playerLabel.setAnchorPoint(cc.p(0, 0));
        playerLabel.setPosition(this._tournamentLayerFit.playerLabelPoint);
        this.addChild(playerLabel);

        var nameLabel = StrokeLabel.create(gameData.player.get("name"), "STHeitiTC-Medium", 28);
        nameLabel.setColor(cc.c3b(255, 239, 131));
        nameLabel.setAnchorPoint(cc.p(0, 0.5));
        nameLabel.setPosition(this._tournamentLayerFit.nameLabelPoint);
        this.addChild(nameLabel);

        var expBg = cc.Sprite.create(main_scene_image.exp_bg);
        expBg.setPosition(this._tournamentLayerFit.expBgPoint);
        this.addChild(expBg);
        expBg.setScale(0.8);

        var url = main_scene_image.exp;
        if (gameData.player.isFullLv()) {
            url = main_scene_image.exp_full;
        }

        this._expProgress = Progress.create(null, url, 0, 0, true);
        this._expProgress.setPosition(this._tournamentLayerFit.expProgressPoint);
        this.addChild(this._expProgress);
        this._expProgress.setScale(0.8);

        var lvBg = cc.Sprite.create(main_scene_image.lv_bg);
        lvBg.setPosition(this._tournamentLayerFit.lvBgPoint);
        this.addChild(lvBg);
        lvBg.setScale(0.8);

        this._lvLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 36);
        this._lvLabel.setPosition(this._tournamentLayerFit.lvLabelPoint);
        this.addChild(this._lvLabel);

        this._countLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 22);
        this._countLabel.setPosition(this._tournamentLayerFit.countLabelPoint);
        this.addChild(this._countLabel);

        this._rankingLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 22);
        this._rankingLabel.setPosition(this._tournamentLayerFit.rankingLabelPoint);
        this.addChild(this._rankingLabel);

        this._elixirLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 22);
        this._elixirLabel.setPosition(this._tournamentLayerFit.elixirLabelPoint);
        this.addChild(this._elixirLabel);

        var rewardIcon = cc.Sprite.create(main_scene_image.icon412);
        rewardIcon.setPosition(this._tournamentLayerFit.rewardIconPoint);
        this.addChild(rewardIcon);

        this._rewardLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 22);
        this._rewardLabel.setPosition(this._tournamentLayerFit.rewardLabelPoint);
        this.addChild(this._rewardLabel);

        var buyCountItem = cc.MenuItemImage.create(
            main_scene_image.button16,
            main_scene_image.button16s,
            this._onClickBuyCount,
            this
        );
        buyCountItem.setPosition(this._tournamentLayerFit.buyCountItemPoint);

        var sprite = cc.Sprite.create(main_scene_image.icon281);
        this._rewardItem = cc.MenuItemLabel.create(
            sprite,
            this._onClickRankReward,
            this
        );

        this._rewardItem.setScale(0.55);
        this._rewardItem.setPosition(this._tournamentLayerFit.rewardItemPoint);

        var rankItemEffect = cc.BuilderReader.load(main_scene_image.uiEffect95, this);
        rankItemEffect.setPosition(this._tournamentLayerFit.rankItemPoint);
        this.addChild(rankItemEffect);

        this._rankItemMark = cc.BuilderReader.load(main_scene_image.uiEffect34, this);
        this._rankItemMark.setPosition(cc.p(30, 30));
        rankItemEffect.addChild(this._rankItemMark);

        var menu = cc.Menu.create(buyCountItem, this._rewardItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 2);

        var tipLabel = cc.LabelTTF.create("排名和等级越高，奖励越多", "STHeitiTC-Medium", 18);
        tipLabel.setPosition(this._tournamentLayerFit.tipLabelPoint);
        this.addChild(tipLabel);

        this._skyDialog = SkyDialog.create();
        this.addChild(this._skyDialog, 10);

        var label = cc.Scale9Sprite.create(main_scene_image.bg16);
        label.setContentSize(this._tournamentLayerFit.labelContentSize);

        var detailItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon120,
            this._onClickDetail,
            this
        );
        detailItem.setPosition(this._tournamentLayerFit.detailItemPoint);

        var sendMessageItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon119,
            this._onClickSendMessage,
            this
        );
        sendMessageItem.setPosition(this._tournamentLayerFit.sendMessageItemPoint);

        var addFriendItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon41,
            this._onClickAddFriend,
            this
        );
        addFriendItem.setPosition(this._tournamentLayerFit.addFriendItemPoint);

        var menu = cc.Menu.create(detailItem, sendMessageItem, addFriendItem);
        menu.setPosition(cc.p(0, 0));
        label.addChild(menu);

        this._skyDialog.setLabel(label);
        this._skyDialog.setRect(this._tournamentLayerFit.skyDialogRect);

        this.updateGuide();

        return true;
    },

    update: function () {
        cc.log("TournamentLayer update");

        var that = this;

        var player = gameData.player;

        if (player.isFullLv()) {
            this._expProgress.setAllValue(0, 0);
        } else {
            this._expProgress.setAllValue(player.get("exp"), player.get("maxExp"));
        }

        this._lvLabel.setString(player.get("lv"));

        if (this._scrollView != null) {
            this._scrollView.removeFromParent();
        }

        gameData.tournament.updateRankList(function () {
            cc.log("TournamentLayer update callback");

            that._addRankScrollView();
            that._updateRankRewardItem();
        });
    },

    _update: function () {
        cc.log("TournamentLayer _update");

        var tournament = gameData.tournament;

        this._rankingLabel.setString(tournament.get("ranking"));
        this._countLabel.setString(tournament.get("count"));
    },

    updateMark: function () {
        cc.log("TournamentLayer updateMark");

        this._rankItemMark.setVisible(gameMark.getTournamentMark());
    },

    _updateRankRewardItem: function () {
        cc.log("TournamentLayer _updateRankRewardItem");

        this._elixirLabel.setString(gameData.player.get("elixir"));

        var reward = gameData.tournament.getLastRankReward();

        if (reward) {
            this._rewardLabel.setString("首次达到 " + reward.ranking + " 名  奖励 " + reward.elixir + " 仙丹");
            this._rewardLabel.setVisible(true);

            if (reward.canReceive) {
                if (!this._rewardEffect) {
                    this._rewardEffect = cc.BuilderReader.load(main_scene_image.uiEffect77, this);
                    this._rewardEffect.setScale(0.48);
                    this._rewardEffect.setPosition(this._tournamentLayerFit.rewardItemPoint);
                    this.addChild(this._rewardEffect, 1);
                }
            }
        } else {
            this._rewardLabel.setString("所有奖励已经领取完");
        }
    },

    _addRankScrollView: function () {
        cc.log("TournamentLayer _addRankScrollView");

        this._update();

        var tournament = gameData.tournament;

        this._rankList = tournament.get("rankList");
        var len = this._rankList.length;
        var playerId = gameData.player.get("id");
        var index = 0;

        var scrollViewHeight = len * 160 + 55;
        if (scrollViewHeight < this._tournamentLayerFit.scrollViewHeight) {
            scrollViewHeight = this._tournamentLayerFit.scrollViewHeight;
        }

        var scrollViewLayer = MarkLayer.create(this._tournamentLayerFit.scrollViewLayerRect);
        var slideLabel = [];

        for (var i = 0; i < len; ++i) {
            slideLabel[i] = cc.Node.create();
            slideLabel[i].setPosition(cc.p(0, 0));

            if (playerId == this._rankList[i].playerId) {
                index = Math.min(i + 1, len - 1);
            }

            if (i == 10) {
                var line = cc.Sprite.create(main_scene_image.icon296);
                line.setPosition(cc.p(310, scrollViewHeight - 160 * i - 34));
                slideLabel[i].addChild(line, 2);
            }

            var tournamentPlayerLabel = TournamentLabel.create(this, this._rankList[i]);
            slideLabel[i].addChild(tournamentPlayerLabel);

            if (i < 10) {
                tournamentPlayerLabel.setPosition(cc.p(0, scrollViewHeight - 160 * (i + 1)));
            } else {
                tournamentPlayerLabel.setPosition(cc.p(0, scrollViewHeight - 160 * (i + 1) - 55));
            }

            scrollViewLayer.addChild(slideLabel[i]);
        }

        this._scrollView = cc.ScrollView.create(this._tournamentLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setContentSize(cc.size(this._tournamentLayerFit.scrollViewContentSizeWidth, scrollViewHeight));
        this._scrollView.setPosition(this._tournamentLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();

        this.addChild(this._scrollView);

        var offsetY = 0 - (len - 1 - index) * 160;
        if (index < 10) offsetY -= 55;
        offsetY = Math.max(this._scrollView.minContainerOffset().y, offsetY);
        this._scrollView.setContentOffset(cc.p(0, offsetY));
    },

    _getPlayer: function (id) {
        var len = this._rankList.length;

        for (var i = 0; i < len; ++i) {
            if (this._rankList[i].playerId == id) {
                return this._rankList[i];
            }
        }

        return null;
    },

    defiance: function (data) {
        cc.log("TournamentLayer _setPlayerUpgradeReward");

        var battleLogId = data.battleLogId;
        var upgradeReward = data.upgradeReward;
        var level9Box = data.level9Box;
        var isFirstTournament = data.isFirstTournament;
        var next = function () {
            gameCombo.next();
        };

        gameCombo.push([
            function () {
                if (battleLogId) {
                    BattlePlayer.getInstance().play({
                        cb: next,
                        id: battleLogId
                    });
                } else {
                    next();
                }
            },
            function () {
                if (upgradeReward) {
                    PlayerUpgradeLayer.pop({
                        cb: next,
                        reward: upgradeReward
                    });
                } else {
                    next();
                }
            },
            function () {
                if (level9Box) {
                    Level9BoxLayer.pop({
                        cb: next,
                        reward: level9Box
                    });
                } else {
                    next();
                }
            },
            function () {
                if (isFirstTournament) {
                    MandatoryTeachingLayer.pop({
                        cb: next,
                        progress: FIRST_TOURNAMENT
                    });
                } else {
                    next();
                }
            },
            function () {
                if (upgradeReward) {
                    gameGuide.updateGuide();
                }
                next();
            }
        ]);
    },

    _onClickPlayer: function (id, point) {
        cc.log("TournamentLayer _onClickPlayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._selectId = id;
        this._skyDialog.show(point);
    },

    _onClickRankReward: function () {
        cc.log("TournamentLayer _onClickRankReward");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var reward = gameData.tournament.getLastRankReward();
        if (!reward || !reward.canReceive) {
            TipLayer.tip("当前没有可领奖励");
            return;
        }

        var that = this;

        gameData.tournament.receive(function (reward) {

            GiftBagLayer.pop({
                reward: reward,
                type: SHOW_GIFT_BAG_NO_CLOSE,
                titleType: TYPE_LOOK_REWARD,
                cb: function () {
                    lz.tipReward(reward);

                    if (that._rewardEffect) {
                        that._rewardEffect.removeFromParent();
                        that._rewardEffect = null;
                    }

                    that._updateRankRewardItem();
                }
            });

        });
    },

    ccbFnRank: function () {
        cc.log("TournamentLayer ccbFnRank");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        MainScene.getInstance().switchLayer(ElixirRankLayer);
    },

    _onClickDetail: function () {
        cc.log("TournamentLayer _onClickDetail: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var player = this._getPlayer(this._selectId);

        if (player) {
            gameData.player.playerDetail(function (data) {
                cc.log(data);

                LineUpDetail.pop(data);
            }, this._selectId);
        } else {
            TipLayer.tip("找不到该玩家");
        }
    },

    _onClickSendMessage: function () {
        cc.log("TournamentLayer _onClickSendMessage: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var player = this._getPlayer(this._selectId);

        if (player) {
            SendMessageLayer.pop(player.playerId, player.name);
        } else {
            TipLayer.tip("找不到该玩家");
        }
    },

    _onClickAddFriend: function () {
        cc.log("TournamentLayer _onClickAddFriend: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var player = this._getPlayer(this._selectId);

        if (player) {
            gameData.friend.addFriend(player.name);
        } else {
            TipLayer.tip("找不到该玩家");
        }
    },

    _onClickBuyCount: function () {
        cc.log("TournamentLayer _onClickBuyCount");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (gameData.shop.get("challengeBuyCount") <= 0) {
            var tipVip = gameData.player.get("vip") + 1;

            tipVip = Math.max(tipVip, 3);
            tipVip = Math.min(tipVip, 12);

            GoPaymentLayer.pop({
                title: "有奖竞技购买次数已用完",
                msg: "成为VIP" + tipVip + "，每日即可获得额外的有奖竞技购买次数"
            });

            return;
        }

        var id = 6;
        var product = gameData.shop.getProduct(id);

        cc.log(product);

        var that = this;
        AmountLayer.pop(
            function (count) {
                that._buyCount(id, count);
            },
            product
        );
    },

    _buyCount: function (id, count) {
        cc.log("TournamentLayer _buyCount");

        if (count > 0) {
            var that = this;
            gameData.shop.buyProduct(function (data) {
                that._update();

                lz.tipReward(data);
            }, id, count);
        }
    },

    showTip: function (cb) {
        cc.log("TournamentLayer showTip");
        var that = this;
        TournamentTipLayer.pop(function () {
            that._onClickBuyCount();
        }, cb);
    },

    updateGuide: function () {
        cc.log("TournamentLayer updateGuide");

        if (gameGuide.get("rankExplain")) {
            gameGuide.set("rankExplain", false);
            var url = gameGuide.getExplainEffect("rank");
            var effect = cc.BuilderReader.load(main_scene_image[url], this);
            effect.setPosition(gameFit.gameGuide.effectPoint);
            effect.animationManager.setCompletedAnimationCallback(this, function () {
                effect.removeFromParent();
            });
            this.addChild(effect, 10);
        }
    },

    _onClickTournamentDetails: function () {
        cc.log("TournamentLayer _onClickRankDetails");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        TournamentDetails.pop();
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchBegan: function (touch, event) {
        cc.log("TournamentLayer onTouchBegan");

        var point = this.convertToNodeSpace(touch.getLocation());
        if (cc.rectContainsPoint(this._selectRect, point)) {
            this._isTouch = true;
        }

        return this._isTouch;
    },

    /**
     * callback when a touch event finished
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchEnded: function (touch, event) {
        cc.log("TournamentLayer onTouchEnded");

        if (this._isTouch && touch != undefined) {
            var point = this.convertToNodeSpace(touch.getLocation());
            cc.log("point: " + point);

            if (cc.rectContainsPoint(this._selectRect, point)) {
                cc.log("TournamentLayer _onClickTournamentDetails");
                this._isTouch = false;

                this._onClickTournamentDetails();
            }
        }
    },

    /**
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchCancelled: function (touch, event) {
        cc.log("TournamentLayer onTouchCancelled");

        this._isTouch = false;
    }
});


TournamentLayer.create = function () {
    var res = new TournamentLayer();

    if (res && res.init()) {
        return res;
    }

    return null;
};

TournamentLayer.canEnter = function () {
    var limitLv = outputTables.function_limit.rows[1].rank;
    var lv = gameData.player.get("lv");

    if (lv >= limitLv) {
        return true;
    }

    TipLayer.tip("竞技场" + limitLv + "级开放");

    return false;
};