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
    _player: null,

    onEnter: function () {
        cc.log("TournamentPlayerLabel onEnter");

        this._super();
        this.update();
    },

    init: function (data) {
        cc.log("TournamentPlayerLabel init");

        if (!this._super()) return false;

        this._player = data;

        var playerItem = cc.MenuItemImage.create(main_scene_image.button19, main_scene_image.button19s9, this._onClickPlayer, this);
        playerItem.setAnchorPoint(cc.p(0, 0));
        playerItem.setPosition(cc.p(0, 0));

        var playerItemMenu = LazyMenu.create(playerItem);
        playerItemMenu.setPosition(cc.p(0, 0));
        this.addChild(playerItemMenu);

        var playerNameLabel = cc.LabelTTF.create(data.name, '黑体', 25);
        playerNameLabel.setPosition(cc.p(90, 60));
        this.addChild(playerNameLabel);

        var playerRankLabel = cc.LabelTTF.create(data.rank, '黑体', 25);
        playerRankLabel.setPosition(cc.p(90, 100));
        this.addChild(playerRankLabel);

        if (data.playerId != gameData.player.get("id")) {
            var functionItem = null;
            var functionLabel = null;

            if (data.type == CAN_ADD_FRIEND) {
                functionItem = cc.MenuItemImage.create(main_scene_image.button20, main_scene_image.button20s, this._onClickFunction, this);
                functionLabel = cc.Sprite.create(main_scene_image.icon41);
            } else if (data.type == CAN_DEFIANCE) {
                functionItem = cc.MenuItemImage.create(main_scene_image.button20, main_scene_image.button20s, this._onClickFunction, this);
                functionLabel = cc.Sprite.create(main_scene_image.icon43);
            } else if (data.type == CAN_COUNTER_ATTACK) {
                functionItem = cc.MenuItemImage.create(main_scene_image.button21, main_scene_image.button21s, this._onClickFunction, this);
                functionLabel = cc.Sprite.create(main_scene_image.icon40);
            }

            if (functionItem) {
                functionItem.setPosition(cc.p(500, 67));

                var functionItemMenu = LazyMenu.create(functionItem);
                functionItemMenu.setPosition(cc.p(0, 0));
                this.addChild(functionItemMenu);
            }

            if (functionLabel) {
                functionLabel.setPosition(cc.p(500, 67));
                this.addChild(functionLabel);
            }
        }

        var lineUpCardList = data.cardList;
        var len = lineUpCardList.length;
        var width = len * (63 + 5) - 5;
        width = width > 214 ? width : 214;

        var scrollViewLayer = cc.Layer.create();
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        for (var i = 0; i < len; ++i) {
            var cardHeadItem = CardHeadNode.getCardHeadItem(lineUpCardList[i]);
            cardHeadItem.setScale(0.6);
            cardHeadItem.setPosition(cc.p(32 + i * (63 + 5), 32));
            menu.addChild(cardHeadItem);
        }

        var view = cc.ScrollView.create(cc.size(214, 64), scrollViewLayer);
        view.setContentSize(cc.size(width, 64));
        view.setPosition(cc.p(180, 30));
        view.setBounceable(false);
        view.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        view.updateInset();

        this.addChild(view);

        return true;
    },

    update: function () {
        cc.log("TournamentPlayerLabel update");

    },

    _onClickPlayer: function () {
        cc.log("TournamentPlayerLabel _onClickPlayer");


    },

    _onClickFunction: function () {
        cc.log("TournamentPlayerLabel _onClickFunction " + this._player.type);

        if (this._player.playerId != gameData.player.get("id")) {
            if (this._player.type == CAN_ADD_FRIEND) {
                gameData.tournament.addFriend(this._player.playerId);
            } else {
                gameData.tournament.defiance(function (id) {
                    var scene = BattleScene.create(BattleLogNote.getInstance().getBattleByBattleLogId(id));
                    cc.Director.getInstance().replaceScene(scene);
//                    cc.Director.getInstance().replaceScene(cc.TransitionPageTurn.create(1, scene, true));
                }, this._player.playerId);

            }
        }
    }
})


TournamentLabel.create = function (data) {
    var ret = new TournamentLabel();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
}