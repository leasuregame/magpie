/**
 * Created by xiaoyu on 2014/10/17.
 */

var SearchUnionLayer = cc.Layer.extend({
    _searchUnionLayerFit: null,

    _scrollView: null,
    _unionList: null,

    init: function () {
        if (!this._super()) return false;

        this._searchUnionLayerFit = gameFit.mainScene.searchUnionLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._searchUnionLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._searchUnionLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon16);
        titleIcon.setPosition(this._searchUnionLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var nameEditBoxIcon = cc.Sprite.create(main_scene_image.edit4);
        nameEditBoxIcon.setPosition(this._searchUnionLayerFit.nameEditBoxIconPoint);
        this.addChild(nameEditBoxIcon);

        this._nameEditBox = cc.EditBox.create(this._searchUnionLayerFit.nameEditBoxSize, cc.Scale9Sprite.create(main_scene_image.edit));
        this._nameEditBox.setPosition(this._searchUnionLayerFit.nameEditBoxPoint);
        this._nameEditBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._nameEditBox.setDelegate(this);
        this._nameEditBox.setFont("STHeitiTC-Medium", 35);
        this._nameEditBox.setPlaceHolder("输入公会ID");
        this.addChild(this._nameEditBox);

        var searchUnionItem = cc.MenuItemImage.create(
            main_scene_image.button68,
            main_scene_image.button68s,
            this._onClickSearchUnion,
            this
        );
        searchUnionItem.setPosition(this._searchUnionLayerFit.searchUnionItemPoint);

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(this._searchUnionLayerFit.backItemPoint);

        var menu = cc.Menu.create(searchUnionItem, backItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    update: function () {

        if (this._scrollView) {
            this._scrollView.removeFromParent();
            this._scrollView = null;
        }

        var scrollViewLayer = MarkLayer.create(this._searchUnionLayerFit.scrollViewLayerRect);

        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 2);

        var unionList = this._unionList;
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

        this._scrollView = cc.ScrollView.create(this._searchUnionLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setPosition(this._searchUnionLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());
    },

    _onClickDetail: function (union) {

        return function () {
            cc.log("SearchUnionLayer _onClickDetail");
            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        }
    },

    _onClickRequest: function (id) {

        return function () {
            cc.log("SearchUnionLayer _onClickRequest");
            gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        }
    },

    _onClickSearchUnion: function () {
        var text = this._nameEditBox.getText();
        cc.log("search union's id: " + text);

        if (text == null || text == "") {
            TipLayer.tip("请先输入公会ID");
            return;
        }

        var unions = [];
        for(var i = 0;i < 10;i++) {
            unions.push({
                id: i + 1,
                name: "公会" + (i + 1),
                lv: 5,
                notice: "哈哈哈哈哈哈",
                count: 30,
                maxCount: 50,
                created: "2014-10-10",
                ability: 123456,
                isRequest: ((i % 2 == 0) ? true : false)
            })
        }

        this._unionList = unions;
        this.update();
    },

    _onClickBack: function () {
        cc.log("SearchUnionLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        MainScene.getInstance().switchLayer(UnionLayer);
    }
});

SearchUnionLayer.create = function () {
    var ret = new SearchUnionLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};