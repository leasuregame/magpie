/**
 * Created by lujunyu on 14-6-11.
 */

var WorldCupLayer = cc.Layer.extend({
    _worldCupLayerFit: null,

    _answers: null,
    _teamLen: null,
    _reward: null,

    onEnter: function () {
        cc.log("WorldCupLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("WorldCupLayer init");

        if (!this._super()) return false;

        this._worldCupLayerFit = gameFit.mainScene.worldCupLayer;
        this._answers = {};
        this._reward = null;
        this._teamLen = 0;

        var bgSprite = cc.Sprite.create(main_scene_image.worldCupIcon2);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._worldCupLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var tipLabel = cc.LabelTTF.create("结果将在次日十二点揭晓", "STHeitiTC-Medium", 22);
        tipLabel.setPosition(this._worldCupLayerFit.tipLabelPoint);
        this.addChild(tipLabel);

        this._timeLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 22);
        this._timeLabel.setPosition(this._worldCupLayerFit.timeLabelPoint);
        this.addChild(this._timeLabel);

        this._rewardEffect = cc.BuilderReader.load(main_scene_image.uiEffect77, this);
        this._rewardEffect.setScale(0.6);
        this._rewardEffect.setPosition(this._worldCupLayerFit.rewardEffectPoint);
        this.addChild(this._rewardEffect);
        this._rewardEffect.setVisible(false);

        var menu = cc.Menu.create();
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 2);

        var sprite = cc.Sprite.create(main_scene_image.icon281);
        var showRewardItem = cc.MenuItemLabel.create(
            sprite,
            this._onClickShowReward,
            this
        );

        showRewardItem.setScale(0.6);
        showRewardItem.setPosition(this._worldCupLayerFit.showRewardItemPoint);
        menu.addChild(showRewardItem);

        var historyItem = cc.MenuItemImage.create(
            main_scene_image.worldCupButton1,
            main_scene_image.worldCupButton1s,
            this._onClickHistory,
            this
        );
        historyItem.setPosition(this._worldCupLayerFit.historyItemPoint);
        menu.addChild(historyItem);

        this._submitItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.worldCupIcon10,
            this._onClickSubmit,
            this
        );
        this._submitItem.setPosition(this._worldCupLayerFit.submitItemPoint);
        menu.addChild(this._submitItem);

        this._submittedItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9d,
            main_scene_image.button9d,
            main_scene_image.button9d,
            main_scene_image.worldCupIcon11,
            null,
            this
        );
        this._submittedItem.setPosition(this._worldCupLayerFit.submitItemPoint);
        menu.addChild(this._submittedItem);

        return true;
    },

    update: function () {
        cc.log("WorldCupLayer update");

        var that = this;
        gameData.activity.todayGames(function (data) {

            if (data.reward && Object.keys(data.reward).length > 0) {
                that._reward = data.reward;
                that._rewardEffect.setVisible(true);
            } else {
                that._rewardEffect.setVisible(false);
            }

            if (data.gameDate) {
                that._timeLabel.setString(data.gameDate);
            }

            that._submitItem.setVisible(data.isCanAnswer);
            that._submittedItem.setVisible(!data.isCanAnswer);
            that._addScrollView(data.games);
        });

    },

    _addScrollView: function (games) {
        cc.log("WorldCupLayer _addScrollView");

        if (this._scrollView) {
            this._scrollView.removeFromParent();
            this._scrollView = null;
        }

        var scrollViewLayer = MarkLayer.create(this._worldCupLayerFit.scrollViewLayerRect);
        var answerMenu = LazyMenu.create();
        answerMenu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(answerMenu);

        this._teamLen = games.length;
        var scrollViewHeight = this._teamLen * 240;
        var table = outputTables.country_list.rows;

        this._selectIcons = [];

        for (var i = 0; i < this._teamLen; i++) {
            var y = scrollViewHeight - 240 - 240 * i;
            var game = games[i];
            var guessLabel = cc.Sprite.create(main_scene_image.worldCupIcon3);
            guessLabel.setAnchorPoint(cc.p(0.5, 0));
            guessLabel.setPosition(cc.p(320, y + 80));
            scrollViewLayer.addChild(guessLabel);

            var tipsLabel = ColorLabelTTF.create(
                {
                    string: "猜中可得:" + game.gold,
                    fontName: "STHeitiTC-Medium",
                    fontSize: 18
                },
                {
                    iconName: "gold",
                    scale: 0.7
                }
            );
            tipsLabel.setAnchorPoint(cc.p(0.5, 0));
            tipsLabel.setPosition(cc.p(325, y + 215));
            scrollViewLayer.addChild(tipsLabel);

            var homeTeamIcon = cc.Sprite.create(main_scene_image[table[game.home_team].url]);
            homeTeamIcon.setAnchorPoint(cc.p(0.5, 0));
            homeTeamIcon.setPosition(cc.p(190, y + 84));
            scrollViewLayer.addChild(homeTeamIcon);

            var homeTeamName = cc.LabelTTF.create(table[game.home_team].country, "STHeitiTC-Medium", 20);
            homeTeamName.setAnchorPoint(cc.p(0.5, 0));
            homeTeamName.setPosition(cc.p(75, y + 130));
            scrollViewLayer.addChild(homeTeamName);

            var visitingTeamIcon = cc.Sprite.create(main_scene_image[table[game.visiting_team].url]);
            visitingTeamIcon.setAnchorPoint(cc.p(0.5, 0));
            visitingTeamIcon.setPosition(cc.p(450, y + 84));
            scrollViewLayer.addChild(visitingTeamIcon);

            var visitingTeamName = cc.LabelTTF.create(table[game.visiting_team].country, "STHeitiTC-Medium", 20);
            visitingTeamName.setAnchorPoint(cc.p(0.5, 0));
            visitingTeamName.setPosition(cc.p(560, y + 130));
            scrollViewLayer.addChild(visitingTeamName);

            for (var j = 1; j <= 3; j++) {
                var url = "worldCupIcon" + (3 + j);
                var answerItem = cc.MenuItemImage.create(
                    main_scene_image[url],
                    main_scene_image[url],
                    this._onClickChoose(game.id, j),
                    this
                );
                answerItem.setAnchorPoint(cc.p(0.5, 0));
                answerItem.setPosition(cc.p(160 * j + (j - 2) * 20, y));

                if (game.answer) {
                    answerItem.setEnabled(false);
                }

                answerMenu.addChild(answerItem);
            }

            var selectIcon = cc.Sprite.create(main_scene_image.worldCupIcon7);
            selectIcon.setAnchorPoint(cc.p(0.5, 0));

            if (game.answer) {
                selectIcon.setPosition(cc.p(110 + 180 * (game.answer - 1), y + 15));
            } else {
                selectIcon.setPosition(cc.p(-600, y + 15));
            }
            scrollViewLayer.addChild(selectIcon);

            this._selectIcons[game.id] = selectIcon;
        }

        this._scrollView = cc.ScrollView.create(this._worldCupLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setPosition(this._worldCupLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());

    },

    _onClickShowReward: function () {
        cc.log("WorldCupLayer _onClickShowReward");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;

        if (!that._reward) {
            TipLayer.tip("当前没有奖励");
            return;
        }

        GiftBagLayer.pop({
            reward: that._reward,
            type: GET_GIFT_BAG,
            titleType: TYPE_LOOK_REWARD,
            cb: function () {
                gameData.activity.getWorldCupReward(function () {
                    lz.tipReward(that._reward);
                    that._reward = null;
                    that.update();
                });
            }
        });


    },

    _onClickHistory: function () {
        cc.log("WorldCupLayer _onClickShowReward");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        WorldCupHistoryLabel.pop();
    },

    _onClickChoose: function (id, answer) {
        var that = this;
        return function () {
            cc.log("WorldCupLayer _onClickChoose: id = " + id + " answer = " + answer);
            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var point = that._selectIcons[id].getPosition();
            that._selectIcons[id].setPosition(cc.p(110 + 180 * (answer - 1), point.y));
            that._answers[id] = answer;
        }
    },

    _onClickSubmit: function () {
        cc.log("WorldCupLayer _onClickSubmit");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var len = Object.keys(this._answers).length;

        if (len < this._teamLen) {
            TipLayer.tip("请先选满结果");
            return;
        }

        var that = this;
        AdvancedTipsLabel.pop(TYPE_WORLD_CUP_TIPS, function () {
            gameData.activity.submitAnswer(that._answers, function (isSuccess) {
                that.update();
            });
        });

    }

});

WorldCupLayer.create = function () {
    cc.log("WorldCupLayer init");

    var ret = new WorldCupLayer();
    if (ret && ret.init()) {
        return ret;
    }
    return null;

};

WorldCupLayer.parentLayer = function () {
    cc.log("WorldCupLayer parentLayer");

    return ActivityLayer;
};