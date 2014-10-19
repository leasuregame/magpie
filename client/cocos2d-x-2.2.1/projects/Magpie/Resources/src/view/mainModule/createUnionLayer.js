/**
 * Created by xiaoyu on 2014/10/16.
 */

var CreateUnionLayer = cc.Layer.extend({
    _createUnionLayerFit: null,

    init: function () {

        if (!this._super()) return false;

        this._createUnionLayerFit = gameFit.mainScene.createUnionLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._createUnionLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._createUnionLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon16);
        titleIcon.setPosition(this._createUnionLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var bgLayer = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgLayer.setContentSize(cc.size(600, 500));
        bgLayer.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(bgLayer);

        var titleBgIcon = cc.Sprite.create(main_scene_image.icon371);
        titleBgIcon.setPosition(cc.p(300, 500));
        bgLayer.addChild(titleBgIcon);

        titleIcon = cc.Sprite.create(main_scene_image.icon495);
        titleIcon.setPosition(cc.p(300, 505));
        bgLayer.addChild(titleIcon);

        var inputLabel = cc.LabelTTF.create("公会名称：", "STHeitiTC-Medium", 25);
        inputLabel.setPosition(cc.p(30, 350));
        inputLabel.setAnchorPoint(cc.p(0, 0.5));
        bgLayer.addChild(inputLabel);

        var nameEditBoxIcon = cc.Scale9Sprite.create(main_scene_image.icon29);
        nameEditBoxIcon.setContentSize(cc.size(400, 60));
        nameEditBoxIcon.setPosition(cc.p(360, 350));
        bgLayer.addChild(nameEditBoxIcon);

        this._nameEditBox = cc.EditBox.create(cc.size(400, 70), cc.Scale9Sprite.create(main_scene_image.edit));
        this._nameEditBox.setPosition(cc.p(360, 350));
        this._nameEditBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._nameEditBox.setDelegate(this);
        this._nameEditBox.setFont("STHeitiTC-Medium", 35);
        this._nameEditBox.setPlaceHolder("最多输入八个中文或者英文字母");
        bgLayer.addChild(this._nameEditBox);

        var spendLabel = cc.LabelTTF.create("花费：", "STHeitiTC-Medium", 25);
        spendLabel.setAnchorPoint(cc.p(0, 0.5));
        spendLabel.setPosition(cc.p(160, 220));
        bgLayer.addChild(spendLabel);

        var moneyIcon = cc.Sprite.create(main_scene_image.icon149);
        moneyIcon.setPosition(cc.p(250, 220));
        bgLayer.addChild(moneyIcon);

        var moneyLabel = cc.LabelTTF.create("1000000", "STHeitiTC-Medium", 25);
        moneyLabel.setPosition(cc.p(280, 220));
        moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        bgLayer.addChild(moneyLabel);

        var goldIcon = cc.Sprite.create(main_scene_image.icon148);
        goldIcon.setPosition(cc.p(430, 220));
        bgLayer.addChild(goldIcon);

        var goldLabel = cc.LabelTTF.create("200", "STHeitiTC-Medium", 25);
        goldLabel.setPosition(cc.p(460, 220));
        goldLabel.setAnchorPoint(cc.p(0, 0.5));
        bgLayer.addChild(goldLabel);

        var createItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon21,
            this._onClickCreate,
            this
        );
        createItem.setPosition(cc.p(300, 100));

        var createMenu = cc.Menu.create(createItem);
        createMenu.setPosition(cc.p(0, 0));
        bgLayer.addChild(createMenu);

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(this._createUnionLayerFit.backItemPoint);

        var menu = cc.Menu.create(backItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    _onClickBack: function () {
        cc.log("CreateUnionLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        MainScene.getInstance().switchLayer(UnionLayer);
    },

    _onClickCreate: function () {
        cc.log("CreateUnionLayer _onClickCreate");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var text = this._nameEditBox.getText();
        cc.log("create union's name: " + text);

        if (text == null || text == "") {
            TipLayer.tip("请先输入公会名字");
            return;
        }
    }

});

CreateUnionLayer.create = function () {
    var ret = new CreateUnionLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};