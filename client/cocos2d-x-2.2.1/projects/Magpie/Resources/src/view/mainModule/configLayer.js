/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-16
 * Time: 下午5:22
 * To change this template use File | Settings | File Templates.
 */


/*
 * config layer
 * */


var ConfigLayer = cc.Layer.extend({
    _configLayerFit: null,

    musicOpen: false,
    soundOpen: false,
    musicSelect: null,
    soundSelect: null,

    onEnter: function () {
        cc.log("ConfigLayer onEnter");

        this._super();

        lz.dc.beginLogPageView("设置界面");
    },

    onExit: function () {
        cc.log("ConfigLayer onExit");

        this._super();

        lz.dc.endLogPageView("设置界面");
    },

    init: function () {
        cc.log("ConfigLayer init");

        if (!this._super()) return false;

        this._configLayerFit = gameFit.mainScene.configLayer;

        var sound = gameData.sound;

        this.musicOpen = sound.isOpenMusic();
        this.soundOpen = sound.isOpenEffect();

        cc.log(this.musicOpen);
        cc.log(this.soundOpen);

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._configLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._configLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon260);
        titleIcon.setPosition(this._configLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(this._configLayerFit.backItemPoint);
        var menu = cc.Menu.create(backItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        var bgMusicItem = cc.MenuItemImage.create(
            main_scene_image.icon127,
            main_scene_image.icon127,
            this._onClickBgMusic,
            this
        );

        bgMusicItem.setAnchorPoint(cc.p(0, 0));
        bgMusicItem.setPosition(this._configLayerFit.bgMusicItemPoint);

        var bgMusicItemTitle = StrokeLabel.create("背景音乐", "STHeitiTC-Medium", 30);
        bgMusicItemTitle.setAnchorPoint(cc.p(0, 0.5));
        bgMusicItemTitle.setPosition(cc.p(40, 55));
        bgMusicItem.addChild(bgMusicItemTitle);

        var bgMusicOpenSprite = cc.Sprite.create(main_scene_image.icon27);
        bgMusicOpenSprite.setAnchorPoint(cc.p(0, 0.5));
        bgMusicOpenSprite.setPosition(cc.p(470, 55));
        bgMusicItem.addChild(bgMusicOpenSprite);

        var bgMusicOpenSpriteTitle = StrokeLabel.create("开", "STHeitiTC-Medium", 30);
        bgMusicOpenSpriteTitle.setAnchorPoint(cc.p(0, 0.5));
        bgMusicOpenSpriteTitle.setPosition(cc.p(530, 55));
        bgMusicItem.addChild(bgMusicOpenSpriteTitle);

        this.musicSelect = cc.Sprite.create(main_scene_image.icon20);
        this.musicSelect.setAnchorPoint(cc.p(0, 0.5));
        this.musicSelect.setPosition(cc.p(470, 55));
        bgMusicItem.addChild(this.musicSelect);
        this.musicSelect.setVisible(this.musicOpen);

        var soundItem = cc.MenuItemImage.create(
            main_scene_image.icon127,
            main_scene_image.icon127,
            this._onClickSound,
            this

        );
        soundItem.setAnchorPoint(cc.p(0, 0));
        soundItem.setPosition(this._configLayerFit.soundItemPoint);

        var soundItemTitle = StrokeLabel.create("游戏音效", "STHeitiTC-Medium", 30);
        soundItemTitle.setAnchorPoint(cc.p(0, 0.5));
        soundItemTitle.setPosition(cc.p(40, 55));
        soundItem.addChild(soundItemTitle);

        var soundOpenSprite = cc.Sprite.create(main_scene_image.icon27);
        soundOpenSprite.setAnchorPoint(cc.p(0, 0.5));
        soundOpenSprite.setPosition(cc.p(470, 55));
        soundItem.addChild(soundOpenSprite);

        var soundOpenSpriteTitle = StrokeLabel.create("开", "STHeitiTC-Medium", 30);
        soundOpenSpriteTitle.setAnchorPoint(cc.p(0, 0.5));
        soundOpenSpriteTitle.setPosition(cc.p(530, 55));
        soundItem.addChild(soundOpenSpriteTitle);

        this.soundSelect = cc.Sprite.create(main_scene_image.icon20);
        this.soundSelect.setAnchorPoint(cc.p(0, 0.5));
        this.soundSelect.setPosition(cc.p(470, 55));
        soundItem.addChild(this.soundSelect);
        this.soundSelect.setVisible(this.soundOpen);

        cc.log(this.musicOpen);
        cc.log(this.soundOpen);

        var tipsItem = cc.MenuItemImage.create(
            main_scene_image.icon127,
            main_scene_image.icon127,
            this._onClickTips,
            this
        );
        tipsItem.setAnchorPoint(cc.p(0, 0));
        tipsItem.setPosition(this._configLayerFit.tipsItemPoint);

        var tipsItemTitle = StrokeLabel.create("攻略", "STHeitiTC-Medium", 30);
        tipsItemTitle.setAnchorPoint(cc.p(0, 0.5));
        tipsItemTitle.setPosition(cc.p(40, 55));
        tipsItem.addChild(tipsItemTitle);

        var tipIcon = cc.Sprite.create(main_scene_image.icon273);
        tipIcon.setAnchorPoint(cc.p(0, 0.5));
        tipIcon.setPosition(cc.p(518, 55));
        tipsItem.addChild(tipIcon);

        var QQGroup = cc.MenuItemImage.create(
            main_scene_image.icon127,
            main_scene_image.icon127,
            null,
            this
        );
        QQGroup.setAnchorPoint(cc.p(0, 0));
        QQGroup.setPosition(this._configLayerFit.QQGroupPoint);

        var QQGroupTitle = StrokeLabel.create("Q群： 264272502", "STHeitiTC-Medium", 30);
        QQGroupTitle.setAnchorPoint(cc.p(0, 0.5));
        QQGroupTitle.setPosition(cc.p(40, 55));
        QQGroup.addChild(QQGroupTitle);

        var go2LoginItem = cc.MenuItemImage.create(
            main_scene_image.icon127,
            main_scene_image.icon127,
            this._onClickGo2Login,
            this
        );

        go2LoginItem.setAnchorPoint(cc.p(0, 0));
        go2LoginItem.setPosition(this._configLayerFit.go2LoginItemPoint);

        var go2LoginItemTitle = StrokeLabel.create("退出登录", "STHeitiTC-Medium", 30);
        go2LoginItemTitle.setAnchorPoint(cc.p(0, 0.5));
        go2LoginItemTitle.setPosition(cc.p(40, 55));
        go2LoginItem.addChild(go2LoginItemTitle);

        var go2LoginIcon = cc.Sprite.create(main_scene_image.icon273);
        go2LoginIcon.setAnchorPoint(cc.p(0, 0.5));
        go2LoginIcon.setPosition(cc.p(518, 55));
        go2LoginItem.addChild(go2LoginIcon);

        var menu = cc.Menu.create(
            bgMusicItem,
            soundItem,
            tipsItem,
            QQGroup,
            go2LoginItem
        );

        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    _onClickBgMusic: function () {
        cc.log("ConfigLayer _onClickBgMusic");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.musicOpen = !this.musicOpen;
        this.musicSelect.setVisible(this.musicOpen);

        if (this.musicOpen) {
            gameData.sound.openMusic();
        } else {
            gameData.sound.closeMusic();
        }
    },

    _onClickSound: function () {
        cc.log("ConfigLayer _onClickSound");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.soundOpen = !this.soundOpen;
        this.soundSelect.setVisible(this.soundOpen);

        if (this.soundOpen) {
            gameData.sound.openEffect();
        } else {
            gameData.sound.closeEffect();
        }
    },

    _onClickTips: function () {
        cc.log("ConfigLayer _onClickTips");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var tipsLayer = TipsLayer.create();
        this.addChild(tipsLayer, 1);
    },

    _onClickBack: function () {
        cc.log("ConfigLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        MainScene.getInstance().switchLayer(MainLayer);
    },

    _onClickGo2Login: function () {
        cc.log("ConfigLayer _onClickGo2Login");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if(tbAdapter && tbAdapter.TBLogout) {
            tbAdapter.TBLogout(0);
        }

        MainScene.destroy();
        cc.Director.getInstance().replaceScene(LoginScene.create());
    }
});


ConfigLayer.create = function () {
    var ret = new ConfigLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};