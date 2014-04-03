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
    _cb: null,

    init: function (spiritLv, index) {
        cc.log("BattleSpiritNode init");

        if (!this._super()) return false;

        this._index = index;

        this._ccbNode = cc.BuilderReader.load(main_scene_image.spiritNode, this);

        var spiritSpriteTexture = lz.getTexture(main_scene_image["spirit_1_" + Math.ceil(spiritLv / 2)]);
        this._animationManager = this._ccbNode.animationManager;
        this.addChild(this._ccbNode);

        this.ccbSpiritSprite1.setTexture(spiritSpriteTexture);
        this.ccbSpiritSprite2.setTexture(spiritSpriteTexture);

        return true;
    },

    ccbFnShowAddition: function () {
        var startIndex = this._index < 7 ? 1 : 7;
        this.getParent().ccbFnShowAddition(startIndex);
    },

    ccbFnCallback: function () {
        this.getParent().ccbFnCallback();
    },

    getSubtitleNode: function () {
        cc.log("BattleSpiritNode getSubtitleNode");

        var ccbNode = null;

        if (this._index < 7) {
            ccbNode = cc.BuilderReader.load(main_scene_image.battleEffect6, this);
        } else {
            ccbNode = cc.BuilderReader.load(main_scene_image.battleEffect7, this);
        }

        return ccbNode;
    },

    runAnimations: function (name, tweenDuration, cb) {
        cc.log("BattleSpiritNode runAnimations: " + name);

        if (this._animationManager.getRunningSequenceName()) {
            if (this._cb) {
                this._cb();
            }
        }

        tweenDuration = tweenDuration || 0;

        this._cb = function () {
            if (cb) {
                cb();
                cb = null;
            }
        };

        this._animationManager.runAnimationsForSequenceNamedTweenDuration(name, tweenDuration);
        this._animationManager.setCompletedAnimationCallback(this, this._cb);

        return this._animationManager.getSequenceDuration(name);
    }
});


BattleSpiritNode.create = function (spiritLv, index) {
    var ret = new BattleSpiritNode();

    if (ret && ret.init(spiritLv, index)) {
        return ret;
    }

    return null;
};