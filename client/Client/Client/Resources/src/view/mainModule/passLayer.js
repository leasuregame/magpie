/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-20
 * Time: 下午4:21
 * To change this template use File | Settings | File Templates.
 */


/*
 * pass layer
 * */


var PassLayer = cc.Layer.extend({
    _ladderList: [],

    init: function () {
        cc.log("PassLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.bg5);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        var scrollViewLayer = cc.Layer.create();
        scrollViewLayer.setAnchorPoint(cc.p(0, 0));

        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        for (var i = 1; i <= MAX_PASS_COUNT; ++i) {
            var passLabel = PassLabel.create(i);
            passLabel.setPosition(cc.p(20 + (i - 1) % 2 * 125, 20 + 185 * (i - 1)));
            scrollViewLayer.addChild(passLabel);

            if (i > 1) {
                var ladderSprite = cc.Sprite.create(main_scene_image["ladder" + ((i) % 2 + 1)]);
                ladderSprite.setAnchorPoint(cc.p(0, 0));
                ladderSprite.setPosition(cc.p(80, 110 + 185 * (i - 2)));
                scrollViewLayer.addChild(ladderSprite);
                this._ladderList[i] = ladderSprite;
            }

            var numLabel = cc.LabelTTF.create("第" + i + "关", "Marker Felt", 25);
            numLabel.setAnchorPoint(cc.p(0, 0));
            numLabel.setPosition(cc.p((i - 1) % 2 * 240, 20 + 185 * (i - 1)));
            scrollViewLayer.addChild(numLabel);
        }

        var view = cc.ScrollView.create(cc.size(310, 749), scrollViewLayer);
        view.setContentSize(cc.size(300, 18590));
        view.setPosition(cc.p(100, 200));
        view.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        view.updateInset();
        this.addChild(view);

        var tipLabel = cc.Sprite.create(main_scene_image.bg6);
        tipLabel.setAnchorPoint(cc.p(0, 0));
        tipLabel.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, 868));
        this.addChild(tipLabel);

        var wipeOutItem = cc.MenuItemImage.create(main_scene_image.button9, main_scene_image.button9s, this._onClickWipeOut, this);
        wipeOutItem.setPosition(cc.p(543, 34));
        var wipeOutMenu = cc.Menu.create(wipeOutItem);
        wipeOutMenu.setPosition(cc.p(0, 0));
        tipLabel.addChild(wipeOutMenu);

        var iconSprite = cc.Sprite.create(main_scene_image.icon15);
        iconSprite.setPosition(cc.p(543, 34));
        tipLabel.addChild(iconSprite);

        return true;
    },

    _onClickWipeOut: function () {
        cc.log("PassLayer _onClickWipeOut");

        gameData.pass.wipeOut(function (data) {
            cc.log(data);
        });
    }
})

PassLayer.create = function () {
    var ret = new PassLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}