/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-24
 * Time: 下午3:58
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle spirit node
 * */


var BattleSpiritNode = cc.Node.extend({
    _ccbNode: null,
    _animationManager: null,

    init: function (spiritLv) {
        cc.log("BattleSpiritNode init");

        if (!this._super()) return false;

        this._ccbNode = cc.BuilderReader.load(main_scene_image.spiritNode, this);

        var spiritSpriteTexture = lz.getTexture(main_scene_image["spirit" + spiritLv]);
        this._animationManager = this._ccbNode.animationManager;
        this.addChild(this._ccbNode);

        this._spiritSprite1.setTexture(spiritSpriteTexture);
        this._spiritSprite2.setTexture(spiritSpriteTexture);
        this._spiritSprite3.setTexture(spiritSpriteTexture);
        this._spiritSprite4.setTexture(spiritSpriteTexture);

        return true;
    },

    callback: function () {
        this.getParent().callback();
    },

    runAnimations: function (name, tweenDuration, cb) {
        cc.log("BattleSpiritNode runAnimations: " + name);

        if (this._animationManager.getRunningSequenceName()) {
            this._cb();
        }

        tweenDuration = tweenDuration || 0;
        this._cb = cb || function () {
        };

        this._animationManager.runAnimationsForSequenceNamedTweenDuration(name, tweenDuration);
        this._animationManager.setCompletedAnimationCallback(this, this._cb);
    }
});


BattleSpiritNode.create = function (spiritLv) {
    var ret = new BattleSpiritNode();

    if (ret && ret.init(spiritLv)) {
        return ret;
    }

    return null;
};