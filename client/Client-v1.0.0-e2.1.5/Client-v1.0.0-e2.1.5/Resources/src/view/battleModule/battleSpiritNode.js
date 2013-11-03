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
    _index: 0,
    _ccbNode: null,
    _animationManager: null,

    init: function (spiritLv, index) {
        cc.log("BattleSpiritNode init");

        if (!this._super()) return false;

        this._index = index;

        this._ccbNode = cc.BuilderReader.load(main_scene_image.spiritNode, this);

        var spiritSpriteTexture = lz.getTexture(main_scene_image["spirit" + spiritLv]);
        this._animationManager = this._ccbNode.animationManager;
        this.addChild(this._ccbNode);

        this._spiritSprite1.setTexture(spiritSpriteTexture);
        this._spiritSprite2.setTexture(spiritSpriteTexture);
//        this._spiritSprite3.setTexture(spiritSpriteTexture);
//        this._spiritSprite4.setTexture(spiritSpriteTexture);

        return true;
    },

    showAddition: function () {
        var startIndex = this._index < 7 ? 1 : 7;
        this.getParent().showAddition(startIndex);
    },

    callback: function () {
        this.getParent().callback();
    },

    getSubtitleNode: function () {
        cc.log("BattleSpiritNode getSubtitleNode");

        var ccbNode = cc.BuilderReader.load(main_scene_image.effect11, this);

        if (ccbNode) {
            cc.log(ccbNode);
        }

        return ccbNode;
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


BattleSpiritNode.create = function (spiritLv, index) {
    var ret = new BattleSpiritNode();

    if (ret && ret.init(spiritLv, index)) {
        return ret;
    }

    return null;
};