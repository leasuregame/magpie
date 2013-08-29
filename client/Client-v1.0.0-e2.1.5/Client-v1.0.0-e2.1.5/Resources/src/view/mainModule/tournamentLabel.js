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
    _turnLeftSprite: null,
    _turnRightSprite: null,

    onEnter: function () {
        cc.log("TournamentLabel onEnter");

        this._super();
        this.update();
    },

    init: function (data) {
        cc.log("TournamentLabel init");

        if (!this._super())return false;

        this._player = data;

        var playerItem = cc.MenuItemImage.create(
            main_scene_image.button19,
            main_scene_image.button19s,
            this._onClickPlayer,
            this
        );
        playerItem.setAnchorPoint(cc.p(0, 0));
        playerItem.setPosition(cc.p(0, 0));

        var playerItemMenu = LazyMenu.create(playerItem);
        playerItemMenu.setPosition(cc.p(0, 0));
        this.addChild(playerItemMenu);

        var playerNameLabel = cc.LabelTTF.create(this._player.name, '黑体', 25);
        playerNameLabel.setPosition(cc.p(95, 99));
        this.addChild(playerNameLabel);

        var playerRankLabel = cc.LabelTTF.create(this._player.rank, '黑体', 35);
        playerRankLabel.setPosition(cc.p(95, 48));
        this.addChild(playerRankLabel);

        if (this._player.playerId != gameData.player.get("id")) {
            var functionItem = null;
            var functionLabel = null;

            if (this._player.type == CAN_ADD_FRIEND) {
                functionItem = cc.MenuItemImage.create(
                    main_scene_image.button20,
                    main_scene_image.button20s,
                    this._onClickFunction,
                    this
                );
                functionLabel = cc.Sprite.create(main_scene_image.icon41);
            } else if (this._player.type == CAN_DEFIANCE) {
                functionItem = cc.MenuItemImage.create(
                    main_scene_image.button20,
                    main_scene_image.button20s,
                    this._onClickFunction,
                    this
                );
                functionLabel = cc.Sprite.create(main_scene_image.icon43);
            } else if (this._player.type == CAN_COUNTER_ATTACK) {
                functionItem = cc.MenuItemImage.create(
                    main_scene_image.button21,
                    main_scene_image.button21s,
                    this._onClickFunction,
                    this
                );
                functionLabel = cc.Sprite.create(main_scene_image.icon40);
            }

            if (functionItem) {
                functionItem.setPosition(cc.p(530, 67));

                var functionItemMenu = LazyMenu.create(functionItem);
                functionItemMenu.setPosition(cc.p(0, 0));
                this.addChild(functionItemMenu);
            }

            if (functionLabel) {
                functionLabel.setPosition(cc.p(530, 67));
                this.addChild(functionLabel);
            }
        }

        var tableView = cc.TableView.create(this, cc.size(226.8, 75.6));
        tableView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        tableView.setPosition(cc.p(200, 15));
        tableView.setDelegate(this);
        this.addChild(tableView);
        tableView.reloadData();

        this._turnLeftSprite = cc.Sprite.create(main_scene_image.icon37);
        this._turnLeftSprite.setRotation(180);
        this._turnLeftSprite.setScale(0.5);
        this._turnLeftSprite.setPosition(cc.p(183, 53));
//        this._turnLeftSprite.setVisible(false);
        this.addChild(this._turnLeftSprite, 1);

        this._turnRightSprite = cc.Sprite.create(main_scene_image.icon37);
        this._turnRightSprite.setScale(0.5);
        this._turnRightSprite.setPosition(cc.p(440, 53));
//        this._turnRightSprite.setVisible(false);
        this.addChild(this._turnRightSprite, 1);

        return true;
    },

    update: function () {
        cc.log("TournamentLabel update");
    },

    scrollViewDidScroll: function (view) {
        cc.log("TournamentLabel update");
    },

    scrollViewDidZoom: function (view) {
        cc.log("TournamentLabel update");
    },

    tableCellTouched: function (table, cell) {
        cc.log("cell touched at index: " + cell.getIdx());

        var index = cell.getIdx();
        var cardDetails = CardDetails.create(this._player.cardList[index]);
        MainScene.getInstance().addChild(cardDetails, 1);
    },

    cellSizeForTable: function (table) {
        return cc.size(75.6, 75.6);
    },

    tableCellAtIndex: function (table, idx) {
        cell = new cc.TableViewCell();

        if (this._player.cardList[idx]) {
            var cardHeadNode = CardHeadNode.create(this._player.cardList[idx]);
            cardHeadNode.setScale(0.7);
            cell.addChild(cardHeadNode);
        }

        return cell;
    },

    numberOfCellsInTableView: function (table) {
        return this._player.cardList.length;
    },

    _onClickPlayer: function () {
        cc.log("TournamentLabel _onClickPlayer");


    },

    _onClickFunction: function () {
        cc.log("TournamentLabel _onClickFunction " + this._player.type);

        if (this._player.playerId != gameData.player.get("id")) {
            if (this._player.type == CAN_ADD_FRIEND) {
                gameData.tournament.addFriend(this._player.playerId);
            } else {
                gameData.tournament.defiance(function (id) {
                    BattlePlayer.getInstance().play(id);
                }, this._player.playerId);

            }
        }
    }
});


TournamentLabel.create = function (data) {
    var ret = new TournamentLabel();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
};