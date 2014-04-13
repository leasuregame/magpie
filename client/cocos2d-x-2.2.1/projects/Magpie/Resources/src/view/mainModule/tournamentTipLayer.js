/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-11-27
 * Time: 下午4:20
 * To change this template use File | Settings | File Templates.
 */

var TournamentTipLayer = LazyLayer.extend({
    _tournamentTipLayerFit: null,

    _cb1: null,
    _cb2: null,

    onEnter: function () {
        cc.log("TournamentTipLayer onEnter");

        this._super();

        lz.um.beginLogPageView("竞技提示界面");
    },

    onExit: function () {
        cc.log("TournamentTipLayer onExit");

        this._super();

        lz.um.endLogPageView("竞技提示界面");
    },

    init: function (cb1, cb2) {
        cc.log("TournamentTipLayer init");

        if (!this._super()) return false;

        this._tournamentTipLayerFit = gameFit.mainScene.tournamentTipLayer;
        this._cb1 = cb1;
        this._cb2 = cb2;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(550, 250));
        bgSprite.setPosition(this._tournamentTipLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var y = this._tournamentTipLayerFit.offsetPointY;

        var description = lz.format("每日有奖竞技次数用完之后，可以继续挑战，但不能再获得奖励。你可以购买额外的有奖竞技次数。", 21);
        for (var i = 0; i < description.length; i++) {
            var itemText = cc.LabelTTF.create(description[i], "STHeitiTC-Medium", 22);
            itemText.setAnchorPoint(cc.p(0, 0));
            itemText.setPosition(cc.p(this._tournamentTipLayerFit.offsetPointX, y - i * 30));
            this.addChild(itemText);
        }

        var buyItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button21,
            main_scene_image.button21s,
            main_scene_image.icon302,
            this._onClickBuy,
            this
        );
        buyItem.setPosition(this._tournamentTipLayerFit.buyItemPoint);

        var closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon67,
            this._onClickClose,
            this
        );
        closeItem.setPosition(this._tournamentTipLayerFit.closeItemPoint);

        var menu = cc.Menu.create(buyItem, closeItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;

    },

    _onClickBuy: function () {
        cc.log("TournamentTipLayer _onClickBuy");

        this.removeFromParent();
        this._cb1();
    },

    _onClickClose: function () {
        cc.log("TournamentTipLayer _onClickClose");


        this.removeFromParent();
        this._cb2();
    }
});


TournamentTipLayer.create = function (cb1, cb2) {
    var ret = new TournamentTipLayer();

    if (ret && ret.init(cb1, cb2)) {
        return ret;
    }

    return null;
};


TournamentTipLayer.pop = function (cb1, cb2) {
    var tournamentTipLayer = TournamentTipLayer.create(cb1, cb2);

    MainScene.getInstance().getLayer().addChild(tournamentTipLayer, 10);

    return tournamentTipLayer;
};
