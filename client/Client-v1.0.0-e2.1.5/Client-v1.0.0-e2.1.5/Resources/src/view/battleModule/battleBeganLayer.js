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


var MAX_CLOUD_COUNT = 150;
var CLOUD_RADIUS = 223;
var CLEAR_CLOUD_DELAY = 0.2;
var MIN_CLOUD_OPACITY = 200;
var MAX_CLOUD_OPACITY = 255;
var MIN_CLOUD_SCALE = 0.8;
var MAX_CLOUD_SCALE = 1;
var MIN_CLOUD_ROTATION = 0;
var MAX_CLOUD_ROTATION = 360;
var MIN_CLOUD_POSITION_X = 40;
var MID_CLOUD_POSITION_X = 360;
var MAX_CLOUD_POSITION_X = 680;
var MIN_CLOUD_POSITION_Y = 0;
var MAX_CLOUD_POSITION_Y = 1136;
var MIN_CLOUD_SPEED = 150;
var MAX_CLOUD_SPEED = 170;
var MIN_CLOUD_FADE_OUT_TIME = 1.4;
var MAX_CLOUD_FADE_OUT_TIME = 1.6;

var BattleBeganLayer = cc.Layer.extend({
    _cloud: null,

    onEnter: function () {
        cc.log("BattleBeganLayer onEnter");

        this._super();

        this.scheduleOnce(this._began, CLEAR_CLOUD_DELAY);
    },

    init: function () {
        cc.log("BattleBeganLayer init");

        if (!this._super()) return false;

        this._cloud = [];

        for (var i = 0; i < MAX_CLOUD_COUNT; ++i) {
            var cloud = cc.Sprite.create(main_scene_image.cloud);
            cloud.setRotation(this._getRandomRotation());
            cloud.setScale(this._getRandomScale());
            cloud.setOpacity(this._getRandomOpacity());
            cloud.setPosition(this._getRandomPosition());
            this.addChild(cloud);

            this._cloud[i] = cloud;
        }

        return true;

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
                x = MAX_CLOUD_POSITION_X - x;
                point.x = MAX_CLOUD_POSITION_X + CLOUD_RADIUS;
            } else {
                x = x - MIN_CLOUD_POSITION_X;
                point.x = MIN_CLOUD_POSITION_X - CLOUD_RADIUS;
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
}