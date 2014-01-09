/**
 * Created by lcc3536 on 13-12-6.
 */


/*
 * level 9 box
 * */


var Level9BoxLayer = LazyLayer.extend({
    _level9BoxLayerFit: null,
    _data: null,

    onEnter: function () {
        cc.log("Level9BoxLayer onEnter");

        this._super();

        lz.dc.beginLogPageView("九级礼包界面");
    },

    onExit: function () {
        cc.log("Level9BoxLayer onExit");

        this._super();

        lz.dc.endLogPageView("九级礼包界面");
    },

    init: function (data) {
        cc.log("Level9BoxLayer init");

        if (!this._super()) return false;

        this._data = data;

        this._level9BoxLayerFit = gameFit.mainScene.level9BoxLayer;
        this.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        this._ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect55, this);
        this._ccbNode.setPosition(this._level9BoxLayerFit.bgSpritePoint);
        this.addChild(this._ccbNode);

        this._ccbNode.controller.ccbMenu.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        return true;
    },

    ccbFnBox: function () {
        cc.log("Level9Box ccbFnBox");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._ccbNode.controller.ccbBoxItem.setEnabled(false);
        this._ccbNode.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_3", 0);
    },

    ccbFnShowBox: function () {
        cc.log("Level9Box ccbFnShowBox");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();
        GiftBagLayer.pop(this._data);
    }

});


Level9BoxLayer.create = function (data) {
    var ret = new Level9BoxLayer();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
};

Level9BoxLayer.pop = function (data) {
    var level9BoxLayer = Level9BoxLayer.create(data);

    MainScene.getInstance().addChild(level9BoxLayer, 10);
};
