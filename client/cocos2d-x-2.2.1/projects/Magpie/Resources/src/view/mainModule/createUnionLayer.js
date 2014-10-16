/**
 * Created by xiaoyu on 2014/10/16.
 */

var CreateUnionLayer = cc.Layer.extend({
    _createUnionLayerFit: null,

    init: function () {
        this._super();

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

        var createLayer = cc.Layer.create();
        createLayer.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(createLayer);

        var bgLabel = cc.Sprite.create(main_scene_image.bg22);
        createLayer.addChild(bgLabel);

        var createLabel = cc.LabelTTF.create("创建公会", "STHeitiTC-Medium", 30);
        createLabel.setPosition(cc.p(0, 130));
        createLayer.addChild(createLabel);

        var inputLabel = cc.LabelTTF.create("输入名字", "STHeitiTC-Medium", 30);
        inputLabel.setPosition(cc.p(0, 80));
        createLayer.addChild(inputLabel);

        var nameEditBoxIcon = cc.Sprite.create(main_scene_image.edit4);
        nameEditBoxIcon.setPosition(cc.p(0, 0));
        createLayer.addChild(nameEditBoxIcon);

        this._nameEditBox = cc.EditBox.create(cc.size(540, 70), cc.Scale9Sprite.create(main_scene_image.edit));
        this._nameEditBox.setPosition(cc.p(0, 0));
        this._nameEditBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._nameEditBox.setDelegate(this);
        this._nameEditBox.setFont("STHeitiTC-Medium", 35);
        this._nameEditBox.setPlaceHolder("最多输入八个中文或者英文字母");
        createLayer.addChild(this._nameEditBox);

        var moneyIcon = cc.Sprite.create(main_scene_image.icon149);
        moneyIcon.setPosition(cc.p(-150, -70));
        createLayer.addChild(moneyIcon);

        var moneyLabel =  cc.LabelTTF.create("1000000", "STHeitiTC-Medium", 30);
        moneyLabel.setPosition(cc.p(-120, -70));
        moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        createLayer.addChild(moneyLabel);
        
        var goldIcon = cc.Sprite.create(main_scene_image.icon148);
        goldIcon.setPosition(cc.p(80, -70));
        createLayer.addChild(goldIcon);

        var goldLabel =  cc.LabelTTF.create("200", "STHeitiTC-Medium", 30);
        goldLabel.setPosition(cc.p(110, -70));
        goldLabel.setAnchorPoint(cc.p(0, 0.5));
        createLayer.addChild(goldLabel);

        var createItem = cc.MenuItemImage.create(
            main_scene_image.button10,
            main_scene_image.button10s,
            main_scene_image.button9d,
            this._onClickCreate,
            this
        );
        createItem.setPosition(cc.p(0, -150));

        var createMenu = cc.Menu.create(createItem);
        createMenu.setPosition(cc.p(0, 0));
        createLayer.addChild(createMenu);

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

    _onClickCreate: function() {
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