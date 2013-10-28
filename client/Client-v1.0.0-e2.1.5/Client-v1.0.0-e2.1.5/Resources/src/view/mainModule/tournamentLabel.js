/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-18
 * Time: 上午10:46
 * To change this template use File | Settings | File Templates.
 */


/*
 * tournament player label
 * */


var CAN_ADD_FRIEND = 0;
var CAN_DEFIANCE = 1;
var CAN_COUNTER_ATTACK = 2;

var TournamentLabel = cc.Node.extend({
    _target: null,
    _player: null,
    _turnLeftSprite: null,
    _turnRightSprite: null,

    onEnter: function () {
        cc.log("TournamentLabel onEnter");

        this._super();
    },

    init: function (target, data) {
        cc.log("TournamentLabel init");

        if (!this._super())return false;

        this._target = target;
        this._player = data;

        var playerItem = cc.MenuItemImage.create(
            main_scene_image.button15,
            main_scene_image.button15s,
            this._onClickPlayer,
            this
        );
        playerItem.setAnchorPoint(cc.p(0, 0));
        playerItem.setPosition(cc.p(0, 0));
        playerItem.setScaleX(1.05);

        var playerItemMenu = LazyMenu.create(playerItem);
        playerItemMenu.setPosition(cc.p(0, 0));
        this.addChild(playerItemMenu);

        var nameIcon = cc.Scale9Sprite.create(main_scene_image.icon29);
        nameIcon.setContentSize(cc.size(155, 35));
        nameIcon.setAnchorPoint(cc.p(0, 0.5));
        nameIcon.setPosition(cc.p(20, 99));
        this.addChild(nameIcon);

        var nameLabel = cc.LabelTTF.create(this._player.name, "STHeitiTC-Medium", 22);
        nameLabel.setColor(cc.c3b(255, 242, 206));
        nameLabel.setAnchorPoint(cc.p(0, 0.5));
        nameLabel.setPosition(cc.p(30, 99));
        this.addChild(nameLabel);

        var rankingLabel = StrokeLabel.create(this._player.ranking, "STHeitiTC-Medium", 38);
        rankingLabel.setColor(cc.c3b(255, 242, 206));
        rankingLabel.setPosition(cc.p(95, 42));
        this.addChild(rankingLabel);

        if (this._player.playerId != gameData.player.get("id")) {
            var functionItem = null;

            if (this._player.type == CAN_ADD_FRIEND) {
                functionItem = cc.MenuItemImage.createWithIcon(
                    main_scene_image.button9,
                    main_scene_image.button9s,
                    main_scene_image.icon120,
                    this._onClickFunction,
                    this
                );
            } else if (this._player.type == CAN_DEFIANCE) {
                functionItem = cc.MenuItemImage.createWithIcon(
                    main_scene_image.button9,
                    main_scene_image.button9s,
                    main_scene_image.icon43,
                    this._onClickFunction,
                    this
                );
            } else if (this._player.type == CAN_COUNTER_ATTACK) {
                functionItem = cc.MenuItemImage.createWithIcon(
                    main_scene_image.button11,
                    main_scene_image.button11s,
                    main_scene_image.icon40,
                    this._onClickFunction,
                    this
                );
            }

            functionItem.setPosition(cc.p(530, 67));

            var functionItemMenu = LazyMenu.create(functionItem);
            functionItemMenu.setPosition(cc.p(0, 0));
            this.addChild(functionItemMenu);
        } else {
            playerItem.setEnabled(false);

            var myselfSprite = cc.Sprite.create(main_scene_image.icon257);
            myselfSprite.setScaleX(1.05);
            myselfSprite.setAnchorPoint(cc.p(0, 0));
            myselfSprite.setPosition(cc.p(0, 0));
            this.addChild(myselfSprite);
        }

        var cardList = this._player.cardList;
        var scrollViewLayer = cc.Layer.create();

        for (var i = 0; i < MAX_LINE_UP_SIZE - 1; ++i) {
            var cardHeadNode = CardHeadNode.create(cardList[i] || -1);
            cardHeadNode.setScale(0.7);
            cardHeadNode.setPosition(cc.p(i * 75.6, 0));
            scrollViewLayer.addChild(cardHeadNode);
        }

        var scrollView = cc.ScrollView.create(cc.size(226.8, 75.6), scrollViewLayer);
        scrollView.setContentSize(cc.size(378, 75.6));
        scrollView.setPosition(cc.p(206, 30));
//        scrollView.setBounceable(false);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        var turnLeftSprite = cc.Sprite.create(main_scene_image.icon37);
        turnLeftSprite.setRotation(180);
        turnLeftSprite.setScale(0.5);
        turnLeftSprite.setPosition(cc.p(192, 67));
        this.addChild(turnLeftSprite, 1);

        var turnRightSprite = cc.Sprite.create(main_scene_image.icon37);
        turnRightSprite.setScale(0.5);
        turnRightSprite.setPosition(cc.p(443, 67));
        this.addChild(turnRightSprite, 1);

        return true;
    },

    _onClickPlayer: function () {
        cc.log("TournamentLabel _onClickPlayer");

        var point = this.convertToWorldSpace(cc.p(185, 95));

        this._target._onClickPlayer(this._player.playerId, point);
    },

    _onClickFunction: function () {
        cc.log("TournamentLabel _onClickFunction " + this._player.type);

        if (this._player.playerId != gameData.player.get("id")) {
            var that = this;

            if (this._player.type == CAN_ADD_FRIEND) {
                gameData.player.playerDetail(function (data) {
                    cc.log(data);

                    LineUpDetail.pop(data);
                }, this._player.playerId);
            } else {
                gameData.tournament.defiance(function (data) {
                    if (data) {
                        if (data.upgradeReward) {
                            that._target._setPlayerUpgradeReward(data.upgradeReward);
                        }

                        BattlePlayer.getInstance().play(data.battleLogId);
                    } else {
                        that._target.update();
                    }
                }, this._player.playerId);
            }
        }
    }
});


TournamentLabel.create = function (target, data) {
    var ret = new TournamentLabel();

    if (ret && ret.init(target, data)) {
        return ret;
    }

    return null;
};