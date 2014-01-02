/**
 * Created by lcc3536 on 13-11-14.
 */


/*
 * sound
 * */


var SOUND_OPEN = 1;
var SOUND_CLOSE = 2;

var MUSIC_VOLUME = 0.3;
var EFFECT_VOLUME = 1.0;
var NO_VOLUME = 0;

var Sound = Entity.extend({
    _openMusic: SOUND_OPEN,
    _openEffect: SOUND_OPEN,
    _openMusicKey: null,
    _openEffectKey: null,

    init: function () {
        cc.log("Sound init");

        this._openMusic = SOUND_OPEN;
        this._openEffect = SOUND_OPEN;

        cc.AudioEngine.getInstance().setMusicVolume(MUSIC_VOLUME);
        cc.AudioEngine.getInstance().setEffectsVolume(EFFECT_VOLUME);

        this._openMusicKey = "openMusic";
        this._openEffectKey = "openEffect";

        return true;
    },

    _save: function () {
        cc.log("Sound _save");

        sys.localStorage.setItem(this._openMusicKey, this._openMusic);
        sys.localStorage.setItem(this._openEffectKey, this._openEffect);
    },

    isOpenMusic: function () {
        return (this._openMusic == SOUND_OPEN);
    },

    isOpenEffect: function () {
        return (this._openEffect == SOUND_OPEN);
    },

    playMusic: function (path, loop) {
        cc.log("Sound playMusic");
        cc.log("path: " + path);
        cc.log("loop: " + loop);

        if (this.isOpenMusic()) {
            if (path) {
                cc.AudioEngine.getInstance().playMusic(path, loop);
            } else {
                cc.AudioEngine.getInstance().playMusic(main_scene_image.main_bg_music, true);
            }
        }
    },

    stopMusic: function () {
        cc.AudioEngine.getInstance().stopMusic();
    },

    openMusic: function () {
        this._openMusic = SOUND_OPEN;
        cc.AudioEngine.getInstance().setMusicVolume(MUSIC_VOLUME);
        this.playMusic();

        this._save();
    },

    closeMusic: function () {
        this._openMusic = SOUND_CLOSE;
        cc.AudioEngine.getInstance().setMusicVolume(NO_VOLUME);
        this.stopMusic();

        this._save();
    },

    playEffect: function (path, loop) {
        cc.log("Sound playEffect");

        if (this.isOpenEffect()) {
            cc.AudioEngine.getInstance().playEffect(path, loop);
        }
    },

    stopEffect: function () {
        cc.AudioEngine.getInstance().stopAllEffects();
    },

    openEffect: function () {
        this._openEffect = SOUND_OPEN;
        cc.AudioEngine.getInstance().setEffectsVolume(EFFECT_VOLUME);
        this._save();
    },

    closeEffect: function () {
        this._openEffect = SOUND_CLOSE;
        cc.AudioEngine.getInstance().setEffectsVolume(NO_VOLUME);
        this.stopEffect();

        this._save();
    }
});


Sound.create = function () {
    var ret = new Sound();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};