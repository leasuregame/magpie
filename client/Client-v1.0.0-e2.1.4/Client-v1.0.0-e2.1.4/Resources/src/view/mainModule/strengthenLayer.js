/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-20
 * Time: 下午4:59
 * To change this template use File | Settings | File Templates.
 */


/*
 * 强化
 * */


var StrengthenLayer = cc.Layer.extend({
    _nowLabel: null,


    init: function () {
        cc.log("StrengthenLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.bg1);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite, -1);

        var playerHeaderLabel = PlayerHeaderLabel.create();
        playerHeaderLabel.setPosition(cc.p(40, 890));
        this.addChild(playerHeaderLabel);

        bgSprite = cc.Sprite.create(main_scene_image.bg15);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        var cardUpgradeItem = cc.MenuItemImage.create(
            main_scene_image.button22,
            main_scene_image.button22s,
            main_scene_image.button22d,
            this._onClickCardUpgrade,
            this
        );
        cardUpgradeItem.setPosition(cc.p(110, 931));

        var skillUpgradeItem = cc.MenuItemImage.create(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            this._onClickSkillUpgrade,
            this
        );
        skillUpgradeItem.setPosition(cc.p(255, 931));

        var passiveSkillUpgradeItem = cc.MenuItemImage.create(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            this._onClickPassiveSkillUpgrade,
            this
        );
        passiveSkillUpgradeItem.setPosition(cc.p(405, 931));

        var menu = cc.Menu.create(cardUpgradeItem, skillUpgradeItem, passiveSkillUpgradeItem);

        this.addChild(menu);

//        this._nowLabel = CardUpgradeLabel.create();
//
//        this.addChild(this._nowLabel);


        return true;
    },

    _onClickCardUpgrade: function () {
        this._switchLabel(CardUpgradeLabel);
    },

    _onClickSkillUpgrade: function () {
        this._switchLabel(SkillUpgradeLabel);
    },

    _onClickPassiveSkillUpgrade: function () {
        this._switchLabel(PassiveSkillUpgradeLabel);
    },

    _switchLabel: function (runLabel) {
        if (!(this._nowLayer instanceof runLabel)) {
            this.removeChild(this._nowLabel);
            this._nowLabel = runLabel.create();
            this.addChild(this._nowLabel);
        }
    }
})

StrengthenLayer.create = function () {
    var res = new StrengthenLayer();

    if (res && res.init()) {
        return res;
    }

    return null;
}