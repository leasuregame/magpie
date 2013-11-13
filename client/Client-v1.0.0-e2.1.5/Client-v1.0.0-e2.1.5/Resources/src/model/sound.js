/**
 * Created by lcc3536 on 13-11-14.
 */


/*
 * sound
 * */


var MUSIC_VOLUME = 0.2;
var EFFECT_VOLUME = 1.0;

var Sound = Entity.extend({
    _audioEngine: null,
    _openMusic: true,
    _openEffect: true,
    _openMusicKey: null,
    _openEffectKey: null,

    init: function () {
        cc.log("Sound init");

        this._audioEngine = cc.AudioEngine.getInstance();

        this._audioEngine.setMusicVolume(MUSIC_VOLUME);
        this._audioEngine.setEffectsVolume(EFFECT_VOLUME);

        this._openMusicKey = "openMusic";
        this._openEffectKey = "openEffect";

        this._load();

        return true;
    },

    _load: function () {
        cc.log("Sound _load");

        this._openMusic = sys.localStorage.getItem(this._openMusicKey) || true;
        this._openEffect = sys.localStorage.getItem(this._openEffectKey) || true;

    },

    _save: function () {
        cc.log("Sound _save");

        sys.localStorage.setItem(this._openMusicKey, this._openMusic);
        sys.localStorage.setItem(this._openEffectKey, this._openEffect);
    },

    playMusic: function (path, loop) {
        if (this._openMusic) {
            if (path) {
                this._audioEngine.playMusic(path, loop);
            } else {
                this._audioEngine.playMusic(main_scene_image.main_bg_music, true);
            }
        }
    },

    stopMusic: function () {
        this._audioEngine.stopMusic();
    },

    openMusic: function () {
        this._openMusic = true;

        this.playMusic();

        this._save();
    },

    closeMusic: function () {
        this._openMusic = false;

        this.stopMusic();

        this._save();
    },

    playEffect: function (path, loop) {
        if (this._openEffect) {
            this._audioEngine.playEffect(path, loop);
        }
    },

    stopEffect: function () {
        this._audioEngine.stopAllEffects();
    },

    openEffect: function () {
        this._openEffect = true;

        this._save();
    },

    closeEffect: function () {
        this._openEffect = false;

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