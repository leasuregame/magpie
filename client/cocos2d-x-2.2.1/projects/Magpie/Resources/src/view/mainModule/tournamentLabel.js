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
var CAN_DISPLAY = 3;

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
        var player = gameData.player;

        if (this._player.playerId != player.get("id")) {
            var playerItem = cc.MenuItemImage.create(
                main_scene_image.button19,
                main_scene_image.button19s,
                this._onClickPlayer,
                this
            );
            playerItem.setAnchorPoint(cc.p(0, 0));
            playerItem.setPosition(cc.p(0, 0));
            playerItem.setScaleX(1.017);

            var playerItemMenu = LazyMenu.create(playerItem);
            playerItemMenu.setPosition(cc.p(0, 0));
            this.addChild(playerItemMenu);
        } else {
            var myselfSprite = cc.Sprite.create(main_scene_image.button20);
            myselfSprite.setScaleX(1.017);
            myselfSprite.setAnchorPoint(cc.p(0, 0));
            myselfSprite.setPosition(cc.p(0, 0));
            this.addChild(myselfSprite);
        }

        var nameIcon = cc.Scale9Sprite.create(main_scene_image.icon29);
        nameIcon.setContentSize(cc.size(155, 35));
        nameIcon.setAnchorPoint(cc.p(0, 0.5));
        nameIcon.setPosition(cc.p(20, 89));
        this.addChild(nameIcon);

        var nameLabel = cc.LabelTTF.create(this._player.name, "STHeitiTC-Medium", 22);
        nameLabel.setColor(cc.c3b(255, 242, 206));
        nameLabel.setAnchorPoint(cc.p(0, 0.5));
        nameLabel.setPosition(cc.p(30, 89));
        this.addChild(nameLabel);

        var ranking = this._player.ranking;
        if (ranking <= 3) {
            var rankingIcon = cc.Sprite.create(main_scene_image["icon" + (200 + ranking)]);
            rankingIcon.setPosition(cc.p(95, 34));
            this.addChild(rankingIcon);
        } else {
            var rankingLabel = StrokeLabel.create(ranking, "STHeitiTC-Medium", 38);
            rankingLabel.setColor(cc.c3b(255, 242, 206));
            rankingLabel.setPosition(cc.p(95, 32));
            this.addChild(rankingLabel);
        }

        var ability = this._player.ability;
        var functionItem = null;

        if (this._player.playerId != player.get("id")) {
            if (this._player.type != CAN_DISPLAY) {
                if (this._player.type == CAN_ADD_FRIEND) {
                    functionItem = cc.MenuItemImage.createWithIcon(
                        main_scene_image.button10,
                        main_scene_image.button10s,
                        main_scene_image.icon359,
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
                    var tipIcon = cc.Sprite.create(main_scene_image.icon288);
                    tipIcon.setScale(0.85);
                    tipIcon.setPosition(cc.p(530, 24));
                    this.addChild(tipIcon);
                }
            }

        } else {
            ability = player.get("ability");

            functionItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button10,
                main_scene_image.button10s,
                main_scene_image.icon358,
                this._onClickLineUp,
                this
            );
        }

        if (functionItem) {
            functionItem.setPosition(cc.p(530, 62));
            var functionItemMenu = LazyMenu.create(functionItem);
            functionItemMenu.setPosition(cc.p(0, 0));
            this.addChild(functionItemMenu);
        }

        var abilityIcon = cc.Sprite.create(main_scene_image.icon341);
        abilityIcon.setPosition(cc.p(60, 130));
        this.addChild(abilityIcon);

        var abilityLabel = cc.LabelTTF.create(ability, "STHeitiTC-Medium", 22);
        abilityLabel.setPosition(cc.p(130, 128));
        this.addChild(abilityLabel);

        var cardList = this._player.cardList;
        var scrollViewLayer = cc.Layer.create();

        for (var i = 0; i < MAX_LINE_UP_SIZE - 1; ++i) {
            var cardHeadNode = CardHeadNode.create(cardList[i] || -1);
            cardHeadNode.setScale(0.7);
            cardHeadNode.setPosition(cc.p(i * 75.6, 0));
            scrollViewLayer.addChild(cardHeadNode);
        }

        var scrollView = cc.ScrollView.create(cc.size(226.8, 76), scrollViewLayer);
        scrollView.setContentSize(cc.size(378, 76));
        scrollView.setPosition(cc.p(206, 20));
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        var turnLeftSprite = cc.Sprite.create(main_scene_image.icon37);
        turnLeftSprite.setRotation(180);
        turnLeftSprite.setScale(0.5);
        turnLeftSprite.setPosition(cc.p(192, 57));
        this.addChild(turnLeftSprite, 1);

        var turnRightSprite = cc.Sprite.create(main_scene_image.icon37);
        turnRightSprite.setScale(0.5);
        turnRightSprite.setPosition(cc.p(443, 57));
        this.addChild(turnRightSprite, 1);

        return true;
    },

    _onClickLineUp: function () {
        cc.log("TournamentLabel _onClickLineUp");
        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        LineUpLayer.pop();
    },

    _onClickPlayer: function () {
        cc.log("TournamentLabel _onClickPlayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var point = this.convertToWorldSpace(cc.p(185, 95));

        this._target._onClickPlayer(this._player.playerId, point);
    },

    _onClickFunction: function () {
        cc.log("TournamentLabel _onClickFunction " + this._player.type);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._player.playerId != gameData.player.get("id")) {
            var that = this;

            if (this._player.type == CAN_ADD_FRIEND) {
                gameData.player.playerDetail(function (data) {
                    cc.log(data);

                    LineUpDetail.pop(data);
                }, this._player.playerId);
            } else {
                var tournament = gameData.tournament;
                var count = tournament.get("count");

                var isFirstCountUsed = lz.load(gameData.player.get("uid") + "_firstCountUsed") || 1;

                var cb = function () {
                    gameData.tournament.defiance(function (data) {
                        cc.log(data);

                        that._target.defiance(data);
                    }, that._player.playerId, that._player.ranking);
                };

                if (count == 0 && isFirstCountUsed == 1) {
                    lz.save(gameData.player.get("uid") + "_firstCountUsed", 0);
                    this._target.showTip(cb);
                } else {
                    if (count != 0) {
                        lz.save(gameData.player.get("uid") + "_firstCountUsed", 1);
                    }

                    cb();
                }
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