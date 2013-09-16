/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-23
 * Time: 上午10:48
 * To change this template use File | Settings | File Templates.
 */


/*
 * spirit details
 * */


var SpiritDetails = LazyLayer.extend({
    _menu: null,
    _expProgress: null,
    _lvLabel: null,
    _expLabel: null,
    _passiveHarmLabel: null,
    _skillHarmLabel: null,

    onEnter: function () {
        cc.log("SpiritDetails onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("SpiritDetails init");

        if (!this._super()) return false;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 640, 960);
        bgLayer.setPosition(GAME_ZERO);
        this.addChild(bgLayer);

        var spiritNode = SpiritNode.create();
        spiritNode.setScale(2.0);
        spiritNode.setPosition(cc.p(360, 900));
        this.addChild(spiritNode);

        var tipIcon = cc.Sprite.create(main_scene_image.icon115);
        tipIcon.setPosition(cc.p(360, 400));
        this.addChild(tipIcon);

        this._passiveHarmLabel = cc.LabelTTF.create("0%", "黑体", 23);
        this._passiveHarmLabel.setAnchorPoint(cc.p(0, 0.5));
        this._passiveHarmLabel.setPosition(cc.p(520, 485));
        this.addChild(this._passiveHarmLabel);

        this._skillHarmLabel = cc.LabelTTF.create("0%", "黑体", 23);
        this._skillHarmLabel.setAnchorPoint(cc.p(0, 0.5));
        this._skillHarmLabel.setPosition(cc.p(520, 226));
        this.addChild(this._skillHarmLabel);

        var lvIcon = cc.LabelTTF.create("LV.", "黑体", 40);
        lvIcon.setAnchorPoint(cc.p(0, 0));
        lvIcon.setPosition(cc.p(90, 715));
        this.addChild(lvIcon);

        this._lvLabel = cc.LabelTTF.create("0", "黑体", 28);
        this._lvLabel.setAnchorPoint(cc.p(0, 0));
        this._lvLabel.setPosition(cc.p(160, 715));
        this.addChild(this._lvLabel);

        var expIcon = cc.LabelTTF.create("EXP.", "黑体", 36);
        expIcon.setAnchorPoint(cc.p(0, 0));
        expIcon.setPosition(cc.p(415, 715));
        this.addChild(expIcon);

        this._expLabel = cc.LabelTTF.create("0 / 0", "黑体", 28);
        this._expLabel.setAnchorPoint(cc.p(0, 0));
        this._expLabel.setPosition(cc.p(500, 715));
        this.addChild(this._expLabel);

        this._expProgress = Progress.create(
            main_scene_image.progress9,
            main_scene_image.progress10,
            0,
            0
        );
        this._expProgress.setPosition(cc.p(360, 700));
        this.addChild(this._expProgress);

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button0,
            main_scene_image.button0s,
            this._onClickClose,
            this
        );
        closeItem.setPosition(cc.p(620, 1000));

        this._menu = cc.Menu.create(closeItem);
        this._menu.setPosition(cc.p(0, 0));
        this.addChild(this._menu);

        return true;
    },

    update: function () {
        cc.log("SpiritDetails update");

        var spirit = gameData.spirit;

        this._expProgress.setAllValue(spirit.get("exp"), spirit.get("maxExp"));

        this._lvLabel.setString(spirit.get("lv"));
        this._expLabel.setString(spirit.get("exp") + " / " + spirit.get("maxExp"));
        this._passiveHarmLabel.setString(spirit.get("passiveHarm") + "%");
        this._skillHarmLabel.setString(spirit.get("skillHarm") + "%");
    },

    _onClickClose: function () {
        cc.log("PlayerDetails _onClickClose");

        this._menu.setEnabled(false);

        this.removeFromParent();
    }
});


SpiritDetails.create = function () {
    var ret = new SpiritDetails();

    if (ret && ret.init()) {
        return ret;
    }

    return ret;
};
