/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-11-27
 * Time: 下午4:20
 * To change this template use File | Settings | File Templates.
 */

var TournamentTipLayer = LazyLayer.extend({

    onEnter: function () {
        cc.log("TournamentTipLayer onEnter");

        this._super();

        lz.dc.beginLogPageView("竞技提示界面");
    },

    onExit: function () {
        cc.log("TournamentTipLayer onExit");

        this._super();

        lz.dc.endLogPageView("竞技提示界面");
    },

    init: function () {
        cc.log("TournamentTipLayer init");

        if (!this._super()) return false;

        var lazyLayer = LazyLayer.create();
        this.addChild(lazyLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(550, 250));
        bgSprite.setPosition(cc.p(320, 492));
        lazyLayer.addChild(bgSprite);

        var y = 552;

        var description = lz.format('每日有奖竞技次数用完之后，你可以继续挑战，但不能再获得奖励。你可以购买额外的有奖竞技次数。', 21);
        for (var i = 0; i < description.length; i++) {
            var itemText = cc.LabelTTF.create(description[i], "STHeitiTC-Medium", 22);
            itemText.setAnchorPoint(cc.p(0, 0));
            itemText.setPosition(cc.p(95, y - i * 30));
            lazyLayer.addChild(itemText);
        }

        var closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon36,
            this._onClickClose,
            this
        );
        closeItem.setPosition(cc.p(320, 432));

        var menu = cc.Menu.create(closeItem);
        menu.setPosition(cc.p(0, 0));
        lazyLayer.addChild(menu);

        return true;

    },

    _onClickClose: function () {
        cc.log("TournamentTipLayer _onClickClose");
        this.removeFromParent();
    }

});

TournamentTipLayer.create = function () {
    var ret = new TournamentTipLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};

TournamentTipLayer.pop = function () {
    var tournamentTipLayer = TournamentTipLayer.create();

    MainScene.getInstance().getLayer().addChild(tournamentTipLayer, 10);

    return tournamentTipLayer;
};
