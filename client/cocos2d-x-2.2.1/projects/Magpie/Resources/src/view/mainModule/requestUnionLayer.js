/**
 * Created by xiaoyu on 2014/10/16.
 */

var RequestUnionLayer = cc.Layer.extend({
    _requestUnionLayerFit: null,

    init: function (unionList) {
        if (!this._super()) return false;

        this._requestUnionLayerFit = gameFit.mainScene.requestUnionLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._requestUnionLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._requestUnionLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon16);
        titleIcon.setPosition(this._requestUnionLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var scrollViewLayer = MarkLayer.create(this._requestUnionLayerFit.scrollViewLayerRect);

        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 2);

        var len = unionList.length;
        var scrollViewHeight = len * 150;

        for (var i = 0; i < len; i++) {
            var union = unionList[i];
            var y = scrollViewHeight - 75 - i * 150;
            var bgLabel = cc.Sprite.create(main_scene_image.button15);
            bgLabel.setAnchorPoint(cc.p(0, 0.5));
            bgLabel.setPosition(cc.p(20, y));
            scrollViewLayer.addChild(bgLabel);

            var unionIdIcon = cc.Scale9Sprite.create(main_scene_image.icon29);
            unionIdIcon.setContentSize(cc.size(190, 30));
            unionIdIcon.setAnchorPoint(cc.p(0, 0.5));
            unionIdIcon.setPosition(cc.p(20, 100));
            bgLabel.addChild(unionIdIcon);

            var unionIdLabel = cc.LabelTTF.create("公会id：" + union.id, "STHeitiTC-Medium", 25);
            unionIdLabel.setAnchorPoint(cc.p(0, 0.5));
            unionIdLabel.setPosition(cc.p(25, 100));
            bgLabel.addChild(unionIdLabel);

            var info = union.name + "（" + union.count + "人）";
            var unionInfoLabel = cc.LabelTTF.create(info, "STHeitiTC-Medium", 25);
            unionInfoLabel.setAnchorPoint(cc.p(0, 0.5));
            unionInfoLabel.setPosition(cc.p(30, 50));
            bgLabel.addChild(unionInfoLabel);

            var detailItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.icon120,
                this._onClickDetail(union),
                this
            );
            detailItem.setPosition(cc.p(360, y));
            menu.addChild(detailItem);

            var requestItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.icon311,
                this._onClickRequest(union.id),
                this
            );
            requestItem.setPosition(cc.p(510, y));
            requestItem.setVisible(!union.isRequest);
            menu.addChild(requestItem);

            var requestedItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.button9d,
                main_scene_image.icon496,
                this._onClickRequest(union.id),
                this
            );
            requestedItem.setPosition(cc.p(510, y));
            requestedItem.setEnabled(false);
            requestedItem.setVisible(union.isRequest);
            menu.addChild(requestedItem);
        }

        this._scrollView = cc.ScrollView.create(this._requestUnionLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setPosition(this._requestUnionLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(this._requestUnionLayerFit.backItemPoint);

        var menu = cc.Menu.create(backItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    _onClickDetail: function (union) {

        return function () {
            cc.log("RequestUnionLayer _onClickDetail");

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var members = [];
            for(var i = 0;i < 10;i++) {
                members.push({
                    id: i + 1,
                    name: "哈哈哈哈哈",
                    lv: 80,
                    vip: 3,
                    role: i % 3 + 1,
                    ability: 123456
                })
            }

            var showUnionLayer = ShowUnionLayer.create(members);
            MainScene.getInstance().switchTo(showUnionLayer);

        }
    },

    _onClickRequest: function (id) {

        return function () {
            cc.log("RequestUnionLayer _onClickRequest");
            gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        }
    },

    _onClickBack: function () {
        cc.log("RequestUnionLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        MainScene.getInstance().switchLayer(UnionLayer);
    }
});

RequestUnionLayer.create = function (unionList) {
    var ret = new RequestUnionLayer();

    if (ret && ret.init(unionList)) {
        return ret;
    }

    return null;
};
