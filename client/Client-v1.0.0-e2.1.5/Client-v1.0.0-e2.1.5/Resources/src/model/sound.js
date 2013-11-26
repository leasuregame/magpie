/**
 * Created by lcc3536 on 13-11-14.
 */


/*
 * sound
 * */


var MUSIC_VOLUME = 0.2;
var EFFECT_VOLUME = 1.0;
var NO_VOLUME = 0;

var Sound = Entity.extend({
    _audioEngine: null,
    _openMusic: true,
    _openEffect: true,
    _openMusicKey: null,
    _openEffectKey: null,

    init: function () {
        cc.log("Sound init");

        this._audioEngine = cc.AudioEngine.getInstance();

        this._openMusicKey = "openMusic";
        this._openEffectKey = "openEffect";

        this._load();

        return true;
    },

    _load: function () {
        cc.log("Sound _load");

        this._openMusic = sys.localStorage.getItem(this._openMusicKey) || true;
        this._openEffect = sys.localStorage.getItem(this._openEffectKey) || true;

        var volume = this._openMusic ? MUSIC_VOLUME : NO_VOLUME;
        this._audioEngine.setMusicVolume(volume);

        volume = this._openEffect ? EFFECT_VOLUME : NO_VOLUME;
        this._audioEngine.setEffectsVolume(volume);

        cc.log(sys.localStorage.getItem(this._openMusicKey));
        cc.log(this._openMusic);

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
        this._audioEngine.setMusicVolume(MUSIC_VOLUME);
        this.playMusic();

        this._save();
    },

    closeMusic: function () {
        this._openMusic = false;
        this._audioEngine.setMusicVolume(NO_VOLUME);
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
        this._audioEngine.setEffectsVolume(EFFECT_VOLUME);
        this._save();
    },

    closeEffect: function () {
        this._openEffect = false;
        this._audioEngine.setEffectsVolume(NO_VOLUME);
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