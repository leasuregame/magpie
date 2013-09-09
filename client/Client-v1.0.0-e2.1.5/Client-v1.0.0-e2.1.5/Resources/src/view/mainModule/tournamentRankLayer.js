/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-8
 * Time: 下午8:41
 * To change this template use File | Settings | File Templates.
 */


/*
 * tournament rank layer
 * */


var TournamentRankLayer = cc.Layer.extend({
    init: function () {
        cc.log("TournamentRankLayer init");

        if (!this._super()) return false;

        var len = 10;

        var scrollViewHeight = len * 100;
        if (scrollViewHeight < 700) {
            scrollViewHeight = 700;
        }

        var scrollViewLayer = MarkLayer.create(cc.rect(54, 228, 609, 700));
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        for(var i = 0; i < len; ++i) {
            var y = scrollViewHeight - 100 - 100 * i;

            var playerItem = cc.MenuItemImage.create(
                main_scene_image.button42,
                main_scene_image.button42,
                this._onClickPlayer(i),
                this
            );
            playerItem.setAnchorPoint(cc.p(0, 0));
            playerItem.setPosition(cc.p(0, y));
            menu.addChild(playerItem);

            var rankLabel = cc.LabelTTF.create(i, "Arial", 58);
            rankLabel.setColor(cc.c3b(255, 252, 175));
            rankLabel.setPosition(cc.p(60, y + 55));
            scrollViewLayer.addChild(rankLabel);

            var nameLabel = cc.LabelTTF.create("天龙八部", "黑体", 22);
            nameLabel.setAnchorPoint(cc.p(0, 0.5));
            nameLabel.setPosition(cc.p(115, y + 70));
            scrollViewLayer.addChild(nameLabel);

            var abilityIcon = cc.Sprite.create(main_scene_image.icon204);
            abilityIcon.setPosition(cc.p(420, y + 60));
            scrollViewLayer.addChild(abilityIcon);

            var abilityLabel = cc.LabelTTF.create(20456, "Arial", 38);
            abilityLabel.setColor(cc.c3b(255, 252, 175));
            abilityLabel.setAnchorPoint(cc.p(0, 0.5));
            abilityLabel.setPosition(cc.p(465, y + 60));
            scrollViewLayer.addChild(abilityLabel);

            var lvIcon = cc.Sprite.create(main_scene_image.icon208);
            lvIcon.setPosition(cc.p(140, y + 35));
            scrollViewLayer.addChild(lvIcon);

            var lvLabel = cc.LabelTTF.create(135, "Arial", 22);
            lvLabel.setAnchorPoint(cc.p(0, 0.5));
            lvLabel.setPosition(cc.p(175, y + 35));
            scrollViewLayer.addChild(lvLabel);
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

    _onClickPlayer: function(id) {
        return function() {
            cc.log("AbilityRankLayer _onClickPlayer: " + id);


        }
    }
});


TournamentRankLayer.create = function () {
    var ret = new TournamentRankLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};