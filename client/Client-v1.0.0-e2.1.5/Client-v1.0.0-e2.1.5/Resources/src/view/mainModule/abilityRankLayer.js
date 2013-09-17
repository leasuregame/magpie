/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-8
 * Time: 下午8:40
 * To change this template use File | Settings | File Templates.
 */


/*
 * ability rank layer
 * */


var AbilityRankLayer = cc.Layer.extend({
    _skyDialog: null,
    _abilityRankList: null,
    _selectId: 0,
    _nameLabel: null,

    init: function () {
        cc.log("AbilityRankLayer init");

        if (!this._super()) return false;

        this._abilityRankList = gameData.rank.get("abilityRankList");
        var len = this._abilityRankList.length;

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
                this._onClickPlayer(i),
                this
            );
            playerItem.setAnchorPoint(cc.p(0, 0));
            playerItem.setPosition(cc.p(0, y));
            menu.addChild(playerItem);

            if (i < 3) {
                var rankIcon = cc.Sprite.create(main_scene_image["icon" + (201 + i)]);
                rankIcon.setPosition(cc.p(60, y + 52));
                scrollViewLayer.addChild(rankIcon);
            }

            var rankLabel = cc.LabelTTF.create(i + 1, "Arial", 55);
            rankLabel.setColor(cc.c3b(255, 252, 175));
            rankLabel.setPosition(cc.p(60, y + 55));
            scrollViewLayer.addChild(rankLabel);

            var nameIcon = cc.Sprite.create(main_scene_image.icon209);
            nameIcon.setPosition(cc.p(180, y + 70));
            scrollViewLayer.addChild(nameIcon);

            var nameLabel = cc.LabelTTF.create(this._abilityRankList[i].name, "STHeitiTC-Medium", 22);
            nameLabel.setAnchorPoint(cc.p(0, 0.5));
            nameLabel.setPosition(cc.p(115, y + 70));
            scrollViewLayer.addChild(nameLabel);

            var abilityIcon = cc.Sprite.create(main_scene_image.icon204);
            abilityIcon.setPosition(cc.p(420, y + 60));
            scrollViewLayer.addChild(abilityIcon);

            var abilityLabel = cc.LabelTTF.create(this._abilityRankList[i].ability, "Arial", 35);
            abilityLabel.setColor(cc.c3b(255, 252, 175));
            abilityLabel.setAnchorPoint(cc.p(0, 0.5));
            abilityLabel.setPosition(cc.p(465, y + 57));
            scrollViewLayer.addChild(abilityLabel);

            var lvIcon = cc.Sprite.create(main_scene_image.icon208);
            lvIcon.setPosition(cc.p(140, y + 35));
            scrollViewLayer.addChild(lvIcon);

            var lvLabel = cc.LabelTTF.create(this._abilityRankList[i].lv, "Arial", 22);
            lvLabel.setAnchorPoint(cc.p(0, 0.5));
            lvLabel.setPosition(cc.p(175, y + 34));
            scrollViewLayer.addChild(lvLabel);
        }

        var scrollView = cc.ScrollView.create(cc.size(609, 700), scrollViewLayer);
        scrollView.setPosition(cc.p(54, 228));
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        scrollView.setContentSize(cc.size(609, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());

        this._skyDialog = SkyDialog.create();
        this.addChild(this._skyDialog);

        var label = cc.Scale9Sprite.create(main_scene_image.bg16);
        label.setContentSize(cc.size(200, 270));

        this._nameLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 22);
        this._nameLabel.setPosition(cc.p(98, 230));
        label.addChild(this._nameLabel);

        var sendMessageItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon119,
            this._onClickSendMessage,
            this
        );
        sendMessageItem.setPosition(cc.p(98, 180));

        var detailItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon120,
            this._onClickDetail,
            this
        );
        detailItem.setPosition(cc.p(98, 120));

        var battleItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon121,
            this._onClickBattle,
            this
        );
        battleItem.setPosition(cc.p(98, 60));

        var menu = cc.Menu.create(sendMessageItem, detailItem, battleItem);
        menu.setPosition(cc.p(0, 0));
        label.addChild(menu);

        this._skyDialog.setLabel(label);
        this._skyDialog.setRect(cc.rect(40, 194, 640, 768));

        return true;
    },

    _onClickPlayer: function (index) {
        return function () {
            cc.log("AbilityRankLayer _onClickPlayer");

            var player = this._abilityRankList[index];

            cc.log(player);

            this._selectId = player.id;

            this._nameLabel.setString(player.name);


            this._skyDialog.show();
        }
    },

    _onClickSendMessage: function () {
        cc.log("AbilityRankLayer _onClickSendMessage: " + this._selectId);

    },

    _onClickDetail: function () {
        cc.log("AbilityRankLayer _onClickDetail: " + this._selectId);

    },

    _onClickBattle: function () {
        cc.log("AbilityRankLayer _onClickBattle: " + this._selectId);

    }
});


AbilityRankLayer.create = function () {
    var ret = new AbilityRankLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};