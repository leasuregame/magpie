/**
 * Created by lujunyu on 14-3-3.
 */
var TYPE_THIS_WEEK = 1;
var TYPE_LAST_WEEK = 0;

var DamageRankLayer = LazyLayer.extend({

    _scrollView: null,
    _thisWeekItem: null,
    _lastWeekItem: null,
    _selectType: TYPE_THIS_WEEK,
    _thisWeekRank: null,
    _thisWeekDamage: null,
    _lastWeekRank: null,
    _lastWeekDamage: null,
    _rankList: [],

    onEnter: function () {
        cc.log("DamageRankLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("DamageRankLayer init");

        if (!this._super()) return false;

        this._selectType = TYPE_THIS_WEEK;
        this._rankList = [];

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        this._frameLayer = cc.Layer.create();
        this._frameLayer.setPosition(gameFit.GAME_BOTTOM_LEFT_POINT);
        this.addChild(this._frameLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(650, 809));
        bgSprite.setAnchorPoint(cc.p(0.5, 0));
        bgSprite.setPosition(cc.p(323, 100));
        this._frameLayer.addChild(bgSprite);

        var titleBgIcon = cc.Sprite.create(main_scene_image.icon371);
        titleBgIcon.setPosition(cc.p(320, 904));
        this._frameLayer.addChild(titleBgIcon);

        this._kneelLabel = cc.LabelTTF.create("每天可膜拜3次", "STHeitiTC-Medium", 20);
        this._kneelLabel.setPosition(cc.p(320, 860));
        this._kneelLabel.setColor(cc.c3b(255, 239, 182));
        this._frameLayer.addChild(this._kneelLabel);

        var titleIcon = cc.Sprite.create(main_scene_image.icon404);
        titleIcon.setPosition(cc.p(320, 912));
        this._frameLayer.addChild(titleIcon);

        this._thisWeekItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button29,
            main_scene_image.button29s,
            main_scene_image.button9,
            main_scene_image.icon379,
            this._onClickThisWeek,
            this
        );

        this._thisWeekItem.setPosition(cc.p(120, 804));

        this._lastWeekItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button29,
            main_scene_image.button29s,
            main_scene_image.button9,
            main_scene_image.icon380,
            this._onClickLastWeek,
            this
        );
        this._lastWeekItem.setPosition(cc.p(270, 804));

        this._showRewardItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button28,
            main_scene_image.button28s,
            main_scene_image.icon387,
            this._onClickShowReward,
            this
        );
        this._showRewardItem.setAnchorPoint(cc.p(0, 0));
        this._showRewardItem.setPosition(cc.p(480, 140));

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button37,
            main_scene_image.button37s,
            this._onClickClose,
            this
        );
        closeItem.setPosition(cc.p(610, 879));

        var helpItem = cc.MenuItemImage.create(
            main_scene_image.button41,
            main_scene_image.button41s,
            this._onClickHelp,
            this
        );

        helpItem.setPosition(cc.p(580, 809));

        var menu = cc.Menu.create(this._thisWeekItem, this._lastWeekItem, this._showRewardItem, closeItem, helpItem);
        menu.setPosition(cc.p(0, 0));
        this._frameLayer.addChild(menu);

        this._rewardNode = cc.Node.create();
        this._rewardNode.setPosition(cc.p(0, 0));
        this._rewardNode.setVisible(false);
        this._frameLayer.addChild(this._rewardNode, 2);

        var effect = cc.BuilderReader.load(main_scene_image.uiEffect77, this);
        effect.setScale(0.7);
        effect.setPosition(cc.p(547, 202));
        this._rewardNode.addChild(effect);

        var rewardMenu = cc.Menu.create();
        rewardMenu.setPosition(cc.p(0, 0));
        this._rewardNode.addChild(rewardMenu);

        var sprite = cc.Sprite.create(main_scene_image.icon281);
        var getRewardItem = cc.MenuItemLabel.create(
            sprite,
            this._onClickGetReward,
            this
        );

        getRewardItem.setScale(0.88);
        getRewardItem.setAnchorPoint(cc.p(0, 0));
        getRewardItem.setPosition(cc.p(485, 150));
        rewardMenu.addChild(getRewardItem);

        var rankBgIcon = cc.Scale9Sprite.create(main_scene_image.icon169);
        rankBgIcon.setPosition(cc.p(320, 550));
        rankBgIcon.setContentSize(cc.size(600, 470));
        this._frameLayer.addChild(rankBgIcon);

        var thisWeekIcon = cc.Sprite.create(main_scene_image.icon385);
        thisWeekIcon.setAnchorPoint(cc.p(0, 0));
        thisWeekIcon.setPosition(cc.p(30, 280));
        this._frameLayer.addChild(thisWeekIcon);

        var lastWeekIcon = cc.Sprite.create(main_scene_image.icon386);
        lastWeekIcon.setAnchorPoint(cc.p(0, 0));
        lastWeekIcon.setPosition(cc.p(30, 195));
        this._frameLayer.addChild(lastWeekIcon);

        var text = ["排名: ", "伤害: "];
        this._thisWeekRank = cc.LabelTTF.create("--", "STHeitiTC-Medium", 26);
        this._thisWeekDamage = cc.LabelTTF.create("0", "STHeitiTC-Medium", 26);
        this._lastWeekRank = cc.LabelTTF.create("--", "STHeitiTC-Medium", 26);
        this._lastWeekDamage = cc.LabelTTF.create("0", "STHeitiTC-Medium", 26);

        var label = [this._thisWeekRank, this._thisWeekDamage, this._lastWeekRank, this._lastWeekDamage];
        var point = cc.p(30, 230);
        for (var i = 0; i < 4; i++) {
            var x = point.x + 240 * (i % 2);
            var y = point.y - 85 * parseInt(i / 2);
            var bgLabel = cc.Sprite.create(main_scene_image.icon175);
            bgLabel.setScaleX(0.4);
            bgLabel.setScaleY(0.4);
            bgLabel.setAnchorPoint(cc.p(0, 0));
            bgLabel.setPosition(cc.p(x, y));
            this._frameLayer.addChild(bgLabel);

            var textLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 26);
            textLabel.setAnchorPoint(cc.p(0, 0));
            textLabel.setColor(cc.c3b(219, 166, 103));
            textLabel.setString(text[i % 2]);
            textLabel.setPosition(cc.p(x + 5, y + 5));
            this._frameLayer.addChild(textLabel);

            label[i].setAnchorPoint(cc.p(0, 0));
            label[i].setPosition(cc.p(x + 70, y + 4));
            this._frameLayer.addChild(label[i]);
        }

        this._skyDialog = SkyDialog.create()
        this.addChild(this._skyDialog, 10);

        var skyLabel = cc.Scale9Sprite.create(main_scene_image.bg16);
        skyLabel.setContentSize(cc.size(216, 300));

        var detailItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon120,
            this._onClickDetail,
            this
        );
        detailItem.setPosition(cc.p(108, 240));

        var sendMessageItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon119,
            this._onClickSendMessage,
            this
        );
        sendMessageItem.setPosition(cc.p(108, 150));

        var addFriendItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon41,
            this._onClickAddFriend,
            this
        );
        addFriendItem.setPosition(cc.p(108, 60));

        var skyMenu = cc.Menu.create(detailItem, sendMessageItem, addFriendItem);
        skyMenu.setPosition(cc.p(0, 0));
        skyMenu.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY - 1);
        skyLabel.addChild(skyMenu);

        this._skyDialog.setLabel(skyLabel);
        this._skyDialog.setRect(cc.rect(40, 198, 640, 750));

        this._tipLabel = StrokeLabel.create("当前没有排名信息", "STHeitiTC-Medium", 25);
        this._tipLabel.setColor(cc.c3b(255, 243, 163));
        this._tipLabel.setBgColor(cc.c3b(120, 12, 42));
        this._tipLabel.setPosition(cc.p(320, 620));
        this._tipLabel.setVisible(false);
        this._frameLayer.addChild(this._tipLabel);

        return true;
    },

    update: function () {
        cc.log("DamageRankLayer update");

        var lastWeek = gameData.boss.get("lastWeek");
        var isGet = gameData.boss.isCanGetRankReward();
        this._showRewardItem.setEnabled(!isGet);
        this._rewardNode.setVisible(isGet);

        this._kneelLabel.setVisible(this._selectType == TYPE_THIS_WEEK);

        this._rankList = [];

        if (lastWeek) {
            this._lastWeekRank.setString(lastWeek["rank"]);
            this._lastWeekDamage.setString(lastWeek["damage"]);
        }

        var point = cc.p(120, 804);
        var point1 = cc.p(270, 804);

        if (this._selectType == TYPE_THIS_WEEK) {
            this._thisWeekItem.setPosition(cc.p(point.x, point.y + 3));
            this._lastWeekItem.setPosition(point1);
            this._thisWeekItem.setEnabled(false);
            this._lastWeekItem.setEnabled(true);

            var that = this;
            gameData.boss.updateRank(function () {
                var thisWeekRank = gameData.boss.get("thisWeekRank");
                var thisWeek = gameData.boss.get("thisWeek");
                if (thisWeek) {
                    that._thisWeekRank.setString(thisWeek["rank"]);
                    that._thisWeekDamage.setString(thisWeek["damage"]);
                }
                if (thisWeekRank) {
                    that._rankList = thisWeekRank;
                }
                that._addRankView();
            });
        } else {
            this._thisWeekItem.setPosition(point);
            this._lastWeekItem.setPosition(cc.p(point1.x, point1.y + 3));
            this._thisWeekItem.setEnabled(true);
            this._lastWeekItem.setEnabled(false);
            this._rankList = gameData.boss.get("lastWeekRank");
            this._addRankView();
        }
    },

    _addRankView: function () {
        cc.log("DamageRankLayer _addRankView");

        if (this._rankView) {
            this._rankView.removeFromParent();
            this._rankView = null;
        }

        this._rankView = cc.Layer.create();
        this._rankView.setPosition(cc.p(20, 325));
        this._frameLayer.addChild(this._rankView);

        var menu = cc.Menu.create();
        menu.setPosition(cc.p(0, 0));
        this._rankView.addChild(menu);

        var kneelMenu = cc.Menu.create();
        kneelMenu.setPosition(cc.p(0, 0));
        this._rankView.addChild(kneelMenu, 2);

        this._playerItem = [];

        var len = this._rankList.length;

        this._tipLabel.setVisible(len == 0);

        for (var i = 0; i < len; i++) {
            var y = 360 - 90 * i;
            var player = this._rankList[i];

            if (player.playerId == gameData.player.get("id")) {
                var bgIcon = cc.Sprite.create(main_scene_image.button18);
                bgIcon.setAnchorPoint(cc.p(0, 0));
                bgIcon.setPosition(cc.p(5, y));
                bgIcon.setScaleY(0.7);
                this._rankView.addChild(bgIcon);

            } else {
                var playerItem = cc.MenuItemImage.create(
                    main_scene_image.button15,
                    main_scene_image.button15s,
                    this._onClickPlayer(i),
                    this
                );
                playerItem.setAnchorPoint(cc.p(0, 0));
                playerItem.setPosition(cc.p(5, y));
                playerItem.setScaleY(0.7);
                menu.addChild(playerItem);
                this._playerItem[i] = playerItem;
            }

            if (i < 3) {
                var rankIcon = cc.Sprite.create(main_scene_image["icon" + (201 + i)]);
                rankIcon.setPosition(cc.p(62, y + 45));
                this._rankView.addChild(rankIcon);
            } else {
                var rankLabel = StrokeLabel.create(i + 1, "Arial", 55);
                rankLabel.setColor(cc.c3b(255, 255, 255));
                rankLabel.setBgColor(cc.c3b(133, 60, 31));
                rankLabel.setPosition(cc.p(62, y + 47));
                this._rankView.addChild(rankLabel);
            }

            var nameIcon = cc.Scale9Sprite.create(main_scene_image.icon29);
            nameIcon.setContentSize(cc.size(160, 30));
            nameIcon.setAnchorPoint(cc.p(0, 0.5));
            nameIcon.setPosition(cc.p(105, y + 60));
            this._rankView.addChild(nameIcon);

            var nameLabel = cc.LabelTTF.create(player.name, "STHeitiTC-Medium", 22);
            nameLabel.setAnchorPoint(cc.p(0, 0.5));
            nameLabel.setPosition(cc.p(125, y + 58));
            this._rankView.addChild(nameLabel);

            var kneelLabel = cc.LabelTTF.create("被膜拜次数: ", "STHeitiTC-Medium", 20);
            kneelLabel.setAnchorPoint(cc.p(0, 0.5));
            kneelLabel.setPosition(cc.p(105, y + 25));
            kneelLabel.setColor(cc.c3b(123, 76, 65));
            this._rankView.addChild(kneelLabel);

            var kneelCountLabel = cc.LabelTTF.create(player.kneelCount + "", "STHeitiTC-Medium", 20);
            kneelCountLabel.setAnchorPoint(cc.p(0, 0.5));
            kneelCountLabel.setPosition(cc.p(225, y + 24));
            kneelCountLabel.setColor(cc.c3b(123, 76, 65));
            this._rankView.addChild(kneelCountLabel);

            var damageLabel = StrokeLabel.create("伤害: ", "Arial", 25);
            damageLabel.setColor(cc.c3b(255, 255, 255));
            damageLabel.setBgColor(cc.c3b(133, 60, 31));
            damageLabel.setAnchorPoint(cc.p(0, 0.5));
            damageLabel.setPosition(cc.p(310, y + 45));
            this._rankView.addChild(damageLabel);

            var damageCountLabel = cc.LabelTTF.create(player.damage, "STHeitiTC-Medium", 22);
            damageCountLabel.setColor(cc.c3b(108, 41, 41));
            damageCountLabel.setAnchorPoint(cc.p(0, 0.5));
            damageCountLabel.setPosition(cc.p(380, y + 42));
            this._rankView.addChild(damageCountLabel);

            if (this._selectType == TYPE_THIS_WEEK) {
                var kneelItem = cc.MenuItemImage.create(
                    main_scene_image.button42,
                    main_scene_image.button42s,
                    main_scene_image.button42d,
                    this._onClickKneel(player.playerId),
                    this
                );

                kneelItem.setAnchorPoint(cc.p(0, 0.5));
                kneelItem.setPosition(cc.p(480, y + 48));
                kneelItem.setScale(0.9);
                kneelItem.setEnabled(gameData.boss.isCanKneel(player.playerId));
                kneelMenu.addChild(kneelItem);
            }
        }
    },

    _onClickThisWeek: function () {
        cc.log("DamageRankLayer _onClickThisWeek");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        this._selectType = TYPE_THIS_WEEK;
        this.update();
    },

    _onClickLastWeek: function () {
        cc.log("DamageRankLayer _onClickLastWeek");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        this._selectType = TYPE_LAST_WEEK;
        this.update();
    },

    _onClickPlayer: function (index) {
        var that = this;
        return function () {
            cc.log("DamageRankLayer _onClickPlayer: " + index);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);
            var point = that._playerItem[index].convertToWorldSpace(cc.p(260, 60));

            that._selectId = index;
            that._skyDialog.show(point);
        }
    },

    _onClickShowReward: function () {
        cc.log("DamageRankLayer _onClickShowReward");
        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var reward = gameData.boss.getThisWeekReward();

        GiftBagLayer.pop({
            reward: reward,
            titleType: TYPE_LOOK_REWARD,
            tip: "亲，你的伤害值为0，无法获得奖励哟。"
        });

    },

    _onClickGetReward: function () {
        cc.log("DamageRankLayer _onClickGetReward");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (!gameData.boss.isCanGetRankReward()) {
            TipLayer.tip("当前没有可领奖励");
            return;
        }

        var that = this;
        gameData.boss.getLastWeekReward(function (data) {
            cc.log(data);
            GiftBagLayer.pop({
                reward: data,
                type: SHOW_GIFT_BAG_NO_CLOSE,
                titleType: TYPE_LOOK_REWARD,
                cb: function () {
                    lz.tipReward(data);
                    that.update();
                }
            });
        });
    },

    _onClickClose: function () {
        cc.log("DamageRankLayer _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();
    },

    _onClickHelp: function () {
        cc.log("DamageRankLayer _onClickHelp");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        DamageRankHelpLabel.pop();
    },

    _onClickDetail: function () {
        cc.log("DamageRankLayer _onClickDetail: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var player = this._rankList[this._selectId];

        if (player) {
            gameData.player.playerDetail(function (data) {
                cc.log(data);

                LineUpDetail.pop(data);
            }, player.playerId);
        } else {
            TipLayer.tip("找不到该玩家");
        }
    },

    _onClickSendMessage: function () {
        cc.log("DamageRankLayer _onClickSendMessage: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var player = this._rankList[this._selectId];

        if (player) {
            SendMessageLayer.pop(player.playerId, player.name);
        } else {
            TipLayer.tip("找不到该玩家");
        }
    },

    _onClickAddFriend: function () {
        cc.log("DamageRankLayer _onClickAddFriend: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var player = this._rankList[this._selectId];

        if (player) {
            gameData.friend.addFriend(player.name);
        } else {
            TipLayer.tip("找不到该玩家");
        }
    },

    _onClickKneel: function (id) {
        var that = this;
        return function () {
            cc.log("DamageRankLayer _onClickKneel: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            gameData.boss.kneel(function (reward) {
                lz.tipReward(reward);
                that.update();
            }, id);
        }
    }

});

DamageRankLayer.create = function () {
    cc.log("DamageRankLayer create");

    var ref = new DamageRankLayer();

    if (ref && ref.init()) {
        return ref;
    }

    return null;
};

DamageRankLayer.pop = function () {
    cc.log("DamageRankLayer pop");

    var damageRankLayer = DamageRankLayer.create();

    MainScene.getInstance().getLayer().addChild(damageRankLayer, 10);
};