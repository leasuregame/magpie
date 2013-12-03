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
    _audioEngine: null,
    _openMusic: SOUND_OPEN,
    _openEffect: SOUND_OPEN,
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

        this._openMusic = parseInt(sys.localStorage.getItem(this._openMusicKey)) || SOUND_OPEN;
        this._openEffect = parseInt(sys.localStorage.getItem(this._openEffectKey)) || SOUND_OPEN;

        this._audioEngine.setMusicVolume(this.isOpenMusic() ? MUSIC_VOLUME : NO_VOLUME);
        this._audioEngine.setEffectsVolume(this.isOpenEffect() ? EFFECT_VOLUME : NO_VOLUME);
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
        if (this.isOpenMusic()) {
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
        this._openMusic = SOUND_OPEN;
        this._audioEngine.setMusicVolume(MUSIC_VOLUME);
        this.playMusic();

        this._save();
    },

    closeMusic: function () {
        this._openMusic = SOUND_CLOSE;
        this._audioEngine.setMusicVolume(NO_VOLUME);
        this.stopMusic();

        this._save();
    },

    playEffect: function (path, loop) {
        if (this.isOpenEffect()) {
            this._audioEngine.playEffect(path, loop);
        }
    },

    stopEffect: function () {
        this._audioEngine.stopAllEffects();
    },

    openEffect: function () {
        this._openEffect = SOUND_OPEN;
        this._audioEngine.setEffectsVolume(EFFECT_VOLUME);
        this._save();
    },

    closeEffect: function () {
        this._openEffect = SOUND_CLOSE;
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