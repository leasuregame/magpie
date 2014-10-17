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
        var scrollViewHeight = len * 160;

        for (var i = 0; i < len; i++) {
            var union = unionList[i];
            var y = scrollViewHeight - 80 - i * 160;
            var bgLabel = cc.Sprite.create(main_scene_image.button20);
            bgLabel.setAnchorPoint(cc.p(0, 0.5));
            bgLabel.setPosition(cc.p(20, y));
            scrollViewLayer.addChild(bgLabel);

            var unionIdLabel = cc.LabelTTF.create("公会id：" + union.id, "STHeitiTC-Medium", 25);
            unionIdLabel.setAnchorPoint(cc.p(0, 0.5));
            unionIdLabel.setPosition(cc.p(20, 130));
            bgLabel.addChild(unionIdLabel);

            var info = union.name + "（" + union.count + "人）";
            var unionInfoLabel = cc.LabelTTF.create(info, "STHeitiTC-Medium", 25);
            unionInfoLabel.setAnchorPoint(cc.p(0, 0.5));
            unionInfoLabel.setPosition(cc.p(30, 70));
            bgLabel.addChild(unionInfoLabel);

            var detailItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.icon120,
                this._onClickDetail(union),
                this
            );
            detailItem.setPosition(cc.p(380, y - 10));
            menu.addChild(detailItem);

            var requestItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.icon311,
                this._onClickRequest(union.id),
                this
            );
            requestItem.setPosition(cc.p(530, y - 10));
            menu.addChild(requestItem);
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

        this.removeFromParent();
    }
});

RequestUnionLayer.create = function (unionList) {
    var ret = new RequestUnionLayer();

    if (ret && ret.init(unionList)) {
        return ret;
    }

    return null;
};
