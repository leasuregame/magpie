/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-11
 * Time: 下午5:40
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle began layer
 * */


var MAX_CLOUD_COUNT = 75;
var CLOUD_RADIUS = 225;
var CLEAR_CLOUD_DELAY = 0.2;
var MIN_CLOUD_OPACITY = 180;
var MAX_CLOUD_OPACITY = 255;
var MIN_CLOUD_SCALE = 0.7;
var MAX_CLOUD_SCALE = 1.3;
var MIN_CLOUD_ROTATION = 0;
var MAX_CLOUD_ROTATION = 360;
var MIN_CLOUD_POSITION_X = 40;
var MID_CLOUD_POSITION_X = 360;
var MAX_CLOUD_POSITION_X = 680;
var MIN_CLOUD_POSITION_Y = 0;
var MAX_CLOUD_POSITION_Y = 1136;
var MIN_CLOUD_SPEED = 300;
var MAX_CLOUD_SPEED = 380;
var MIN_CLOUD_FADE_OUT_TIME = 1.3;
var MAX_CLOUD_FADE_OUT_TIME = 1.7;

var BattleBeganLayer = cc.Layer.extend({
    _cloud: null,
    _cb: null,

    init: function () {
        cc.log("BattleBeganLayer init");

        if (!this._super()) return false;

        var spriteSheet = cc.SpriteBatchNode.create(main_scene_image.cloud, MAX_CLOUD_COUNT);
        this.addChild(spriteSheet);

        this._cloud = [];

        for (var i = 0; i < MAX_CLOUD_COUNT; ++i) {
            var cloud = cc.Sprite.create(main_scene_image.cloud);
            cloud.setRotation(this._getRandomRotation());
            cloud.setScale(this._getRandomScale());
            cloud.setOpacity(this._getRandomOpacity());
            cloud.setPosition(this._getRandomPosition());
            spriteSheet.addChild(cloud);

            this._cloud[i] = cloud;
        }

        return true;
    },

    play: function (cb) {
        cc.log("BattleBeganLayer play");

        this._cb = cb || null;

        this.scheduleOnce(this._began, CLEAR_CLOUD_DELAY);
    },

    _began: function () {
        cc.log("BattleBeganLayer _began");

        var time = 0;

        for (var i = 0; i < MAX_CLOUD_COUNT; ++i) {
            var cloud = this._cloud[i];

            if (!cloud) continue;

            var point = cloud.getPosition();
            var x = point.x;

            if (x > MID_CLOUD_POSITION_X) {
                point.x = MAX_CLOUD_POSITION_X + CLOUD_RADIUS;
                x = point.x - x;
            } else {
                point.x = MIN_CLOUD_POSITION_X - CLOUD_RADIUS;
                x = x - point.x;
            }

            var moveTime = x / this._getRandomSpeed();
            var fadeOutTime = this._getRandomFadeOutTime();

            time = Math.max(time, moveTime);
            time = Math.max(time, fadeOutTime);

            var moveAction = cc.MoveTo.create(moveTime, point);
            var fadeOutAction = cc.FadeOut.create(fadeOutTime);
            var action = cc.Spawn.create(moveAction, fadeOutAction);

            cloud.runAction(action);
        }

        this.scheduleOnce(function () {
            if (this._cb) {
                this._cb();
            }

            this.removeFromParent();
        }, time);
    },

    _getRandomPosition: function () {
        var x = lz.random(MIN_CLOUD_POSITION_X, MAX_CLOUD_POSITION_X);
        var y = lz.random(MIN_CLOUD_POSITION_Y, MAX_CLOUD_POSITION_Y);

        return cc.p(x, y);
    },

    _getRandomRotation: function () {
        return lz.random(MIN_CLOUD_ROTATION, MAX_CLOUD_ROTATION);
    },

    _getRandomScale: function () {
        return lz.random(MIN_CLOUD_SCALE, MAX_CLOUD_SCALE);
    },

    _getRandomOpacity: function () {
        return lz.random(MIN_CLOUD_OPACITY, MAX_CLOUD_OPACITY);
    },

    _getRandomSpeed: function () {
        return lz.random(MIN_CLOUD_SPEED, MAX_CLOUD_SPEED);
    },

    _getRandomFadeOutTime: function () {
        return lz.random(MIN_CLOUD_FADE_OUT_TIME, MAX_CLOUD_FADE_OUT_TIME);
    }
});


BattleBeganLayer.create = function () {
    var ret = new BattleBeganLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};


BattleBeganLayer.play = function (cb) {
    var battleBeganLayer = BattleBeganLayer.create();

    if (battleBeganLayer) {
        cc.Director.getInstance().getRunningScene().addChild(battleBeganLayer, 1);

        battleBeganLayer.play(cb);

        return battleBeganLayer;
    }

    return null;
};