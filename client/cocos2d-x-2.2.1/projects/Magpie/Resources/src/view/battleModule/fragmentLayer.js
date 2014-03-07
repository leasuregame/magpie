/**
 * Created by lujunyu on 14-2-11.
 */

var FragmentLayer = LazyLayer.extend({
    _canClick: false,

    init: function (fragment) {
        cc.log("FragmentLayer init: " + fragment);

        if (!this._super()) return false;

        this._canClick = false;

        var fragmentEffect = cc.BuilderReader.load(main_scene_image.uiEffect23, this);
        fragmentEffect.setPosition(gameFit.GAME_MIDPOINT);
        fragmentEffect.controller.ccbFragment.setString("+" + fragment);
        this.addChild(fragmentEffect, 1);

        fragmentEffect.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_2", 0);
        fragmentEffect.animationManager.setCompletedAnimationCallback(this, function () {
            this._canClick = true;
        });

        return true;
    },

    onTouchBegan: function (touch, event) {
        cc.log("FragmentLayer onTouchBegan");

        if (this._canClick) {
            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            this.removeFromParent();
        }

        return true;
    }
});

FragmentLayer.create = function (fragment) {
    var ret = new FragmentLayer();

    if (ret && ret.init(fragment)) {
        return ret;
    }

    return null;
};

FragmentLayer.pop = function (fragment) {
    var fragmentLayer = FragmentLayer.create(fragment);

    BattlePlayer.getInstance().getScene().addChild(fragmentLayer, 10);
    
    return fragmentLayer;
};
