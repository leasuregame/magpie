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

(function () {
    var audioEngine = cc.AudioEngine.getInstance();

    audioEngine.preloadMusic(main_scene_image.main_bg_music);
    audioEngine.preloadMusic(main_scene_image.battle_bg_music);
    audioEngine.preloadMusic(main_scene_image.start_animation_music);

    audioEngine.preloadEffect(main_scene_image.battle_bg_music);
    audioEngine.preloadEffect(main_scene_image.battle_sound_aoe);
    audioEngine.preloadEffect(main_scene_image.battle_sound_atk);
    audioEngine.preloadEffect(main_scene_image.battle_sound_buff);
    audioEngine.preloadEffect(main_scene_image.battle_sound_heal);
    audioEngine.preloadEffect(main_scene_image.battle_sound_lose);
    audioEngine.preloadEffect(main_scene_image.battle_sound_miss);
    audioEngine.preloadEffect(main_scene_image.battle_sound_single);
    audioEngine.preloadEffect(main_scene_image.battle_sound_subtitle_card);
    audioEngine.preloadEffect(main_scene_image.battle_sound_subtitle_spirit);
    audioEngine.preloadEffect(main_scene_image.battle_sound_win);
    audioEngine.preloadEffect(main_scene_image.card_upgrade_sound);
    audioEngine.preloadEffect(main_scene_image.click_building_sound);
    audioEngine.preloadEffect(main_scene_image.click_gold_sound);
    audioEngine.preloadEffect(main_scene_image.highlights_sound);
    audioEngine.preloadEffect(main_scene_image.click_button_sound);
    audioEngine.preloadEffect(main_scene_image.player_upgrade_sound);
    audioEngine.preloadEffect(main_scene_image.spirit_upgrade_sound);
    audioEngine.preloadEffect(main_scene_image.star_sound);
    audioEngine.preloadEffect(main_scene_image.summon_door);

    audioEngine.preloadEffect(main_scene_image.startAnimation_angry_sound);
    audioEngine.preloadEffect(main_scene_image.startAnimation_boom_sound);
    audioEngine.preloadEffect(main_scene_image.startAnimation_breaktree_sound);
    audioEngine.preloadEffect(main_scene_image.startAnimation_ding_sound);
    audioEngine.preloadEffect(main_scene_image.startAnimation_funny_sound);
    audioEngine.preloadEffect(main_scene_image.startAnimation_insert_sound);
    audioEngine.preloadEffect(main_scene_image.startAnimation_keep_sound);
    audioEngine.preloadEffect(main_scene_image.startAnimation_money_sound);
    audioEngine.preloadEffect(main_scene_image.startAnimation_noword_sound);
    audioEngine.preloadEffect(main_scene_image.startAnimation_peaches_sound);
    audioEngine.preloadEffect(main_scene_image.startAnimation_pop_sound);
    audioEngine.preloadEffect(main_scene_image.startAnimation_rock_sound);
    audioEngine.preloadEffect(main_scene_image.startAnimation_shardow_sound);
    audioEngine.preloadEffect(main_scene_image.startAnimation_smalltree_sound);
    audioEngine.preloadEffect(main_scene_image.startAnimation_treelight_sound);
    audioEngine.preloadEffect(main_scene_image.startAnimation_wordinsert_sound);
})();

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