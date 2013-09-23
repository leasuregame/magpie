/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-8
 * Time: 下午8:40
 * To change this template use File | Settings | File Templates.
 */


/*
 * lv rank layer
 * */


var LvRankLayer = cc.Layer.extend({
    init: function () {
        cc.log("LvRankLayer init");

        if (!this._super()) return false;

        var lvRankList = gameData.rank.get("lvRankList");
        var len = lvRankList.length;

        var scrollViewHeight = len * 100;
        if (scrollViewHeight < 700) {
            scrollViewHeight = 700;
        }

        var scrollViewLayer = MarkLayer.create(cc.rect(54, 228, 609, 700));
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        for (var i = 0; i < len; ++i) {
            var y = scrollViewHeight - 100 - 100 * i;

            var playerItem = cc.MenuItemImage.create(
                main_scene_image.button42,
                main_scene_image.button42,
                this._onClickPlayer(lvRankList[i].id),
                this
            );
            playerItem.setAnchorPoint(cc.p(0, 0));
            playerItem.setPosition(cc.p(0, y));
            menu.addChild(playerItem);

            if (i < 3) {
                var rankIcon = cc.Sprite.create(main_scene_image["icon" + (201 + i)]);
                rankIcon.setPosition(cc.p(60, y + 53));
                scrollViewLayer.addChild(rankIcon);
            }

            var rankLabel = cc.LabelTTF.create(i + 1, "Arial", 55);
            rankLabel.setColor(cc.c3b(255, 252, 175));
            rankLabel.setPosition(cc.p(60, y + 55));
            scrollViewLayer.addChild(rankLabel);

            var nameIcon = cc.Sprite.create(main_scene_image.icon209);
            nameIcon.setPosition(cc.p(180, y + 70));
            scrollViewLayer.addChild(nameIcon);

            var nameLabel = cc.LabelTTF.create(lvRankList[i].name, "STHeitiTC-Medium", 22);
            nameLabel.setAnchorPoint(cc.p(0, 0.5));
            nameLabel.setPosition(cc.p(115, y + 70));
            scrollViewLayer.addChild(nameLabel);

            var lvIcon = cc.Sprite.create(main_scene_image.icon205);
            lvIcon.setPosition(cc.p(420, y + 60));
            scrollViewLayer.addChild(lvIcon);

            var lvLabel = cc.LabelTTF.create(lvRankList[i].lv, "Arial", 35);
            lvLabel.setColor(cc.c3b(255, 252, 175));
            lvLabel.setAnchorPoint(cc.p(0, 0.5));
            lvLabel.setPosition(cc.p(465, y + 57));
            scrollViewLayer.addChild(lvLabel);

            var abilityIcon = cc.Sprite.create(main_scene_image.icon207);
            abilityIcon.setPosition(cc.p(140, y + 35));
            scrollViewLayer.addChild(abilityIcon);

            var abilityLabel = cc.LabelTTF.create(lvRankList[i].ability, "Arial", 22);
            abilityLabel.setAnchorPoint(cc.p(0, 0.5));
            abilityLabel.setPosition(cc.p(175, y + 34));
            scrollViewLayer.addChild(abilityLabel);
        }

        var scrollView = cc.ScrollView.create(cc.size(609, 700), scrollViewLayer);
        scrollView.setPosition(cc.p(54, 228));
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        scrollView.setContentSize(cc.size(609, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());

        return true;
    },

    _onClickPlayer: function (id) {
        return function () {
            cc.log("AbilityRankLayer _onClickPlayer: " + id);


        }
    }
});


LvRankLayer.create = function () {
    var ret = new LvRankLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};