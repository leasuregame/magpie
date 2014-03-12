/**
 * Created by lujunyu on 14-3-10.
 */

var BossAppearLabel = LazyLayer.extend({

    init: function(cb) {
        cc.log("BossAppearLabel init");

        if(!this._super()) return false;

        var bossEffect = cc.BuilderReader.load(main_scene_image.uiEffect89, this);
        bossEffect.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(bossEffect);

        bossEffect.animationManager.setCompletedAnimationCallback(this, function () {
            gameGuide.updateBossGuide();
            this.removeFromParent();
            cb();
        });

        return true;
    }

});

BossAppearLabel.create = function (cb) {
    cc.log("BossAppearLabel create");

    var ref = new BossAppearLabel();
    if(ref && ref.init(cb)) {
        return ref;
    }
    return null;
};

BossAppearLabel.pop = function (cb) {
    cc.log("BossAppearLabel pop");

    var bossAppearLabel = BossAppearLabel.create(cb);

    MainScene.getInstance().addChild(bossAppearLabel, 10);
};