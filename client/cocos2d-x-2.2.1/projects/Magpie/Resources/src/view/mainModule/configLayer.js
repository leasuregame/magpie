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

    _musicOpen: false,
    _soundOpen: false,
    _musicSelect: null,
    _soundSelect: null,

    onEnter: function () {
        cc.log("ConfigLayer onEnter");

        this._super();

        lz.um.beginLogPageView("设置界面");
    },

    onExit: function () {
        cc.log("ConfigLayer onExit");

        this._super();

        lz.um.endLogPageView("设置界面");
    },

    init: function () {
        cc.log("ConfigLayer init");

        if (!this._super()) return false;

        this._configLayerFit = gameFit.mainScene.configLayer;

        var sound = gameData.sound;

        this._musicOpen = sound.isOpenMusic();
        this._soundOpen = sound.isOpenEffect();
        var fps = gameConfig.get("fps");

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

        var scrollViewLayer = MarkLayer.create(this._configLayerFit.scrollViewLayerRect);

        var scrollViewHeight = 7 * 120;
        var y = scrollViewHeight - 60;

        var bgMusicItem = cc.MenuItemImage.create(
            main_scene_image.icon127,
            main_scene_image.icon127,
            this._onClickBgMusic,
            this
        );

        bgMusicItem.setAnchorPoint(cc.p(0, 0.5));
        bgMusicItem.setPosition(cc.p(15, y));
        y -= 120;

        var musicItemTitle = StrokeLabel.create("背景音乐", "STHeitiTC-Medium", 30);
        musicItemTitle.setAnchorPoint(cc.p(0, 0.5));
        musicItemTitle.setPosition(cc.p(40, 55));
        bgMusicItem.addChild(musicItemTitle);

        var musicOpenSprite = cc.Sprite.create(main_scene_image.icon27);
        musicOpenSprite.setAnchorPoint(cc.p(0, 0.5));
        musicOpenSprite.setPosition(cc.p(470, 55));
        bgMusicItem.addChild(musicOpenSprite);

        var musicOpenSpriteTitle = StrokeLabel.create("开", "STHeitiTC-Medium", 30);
        musicOpenSpriteTitle.setAnchorPoint(cc.p(0, 0.5));
        musicOpenSpriteTitle.setPosition(cc.p(530, 55));
        bgMusicItem.addChild(musicOpenSpriteTitle);

        this._musicSelect = cc.Sprite.create(main_scene_image.icon20);
        this._musicSelect.setAnchorPoint(cc.p(0, 0.5));
        this._musicSelect.setPosition(cc.p(470, 55));
        bgMusicItem.addChild(this._musicSelect);
        this._musicSelect.setVisible(this._musicOpen);

        var soundItem = cc.MenuItemImage.create(
            main_scene_image.icon127,
            main_scene_image.icon127,
            this._onClickSound,
            this

        );
        soundItem.setAnchorPoint(cc.p(0, 0.5));
        soundItem.setPosition(cc.p(15, y));
        y -= 120;

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

        this._soundSelect = cc.Sprite.create(main_scene_image.icon20);
        this._soundSelect.setAnchorPoint(cc.p(0, 0.5));
        this._soundSelect.setPosition(cc.p(470, 55));
        soundItem.addChild(this._soundSelect);
        this._soundSelect.setVisible(this._soundOpen);

        var noticeItem = cc.MenuItemImage.create(
            main_scene_image.icon127,
            main_scene_image.icon127,
            this._onClickNotice,
            this
        );
        noticeItem.setAnchorPoint(cc.p(0, 0.5));
        noticeItem.setPosition(cc.p(15, y));
        y -= 120;

        var noticeItemTitle = StrokeLabel.create("公告", "STHeitiTC-Medium", 30);
        noticeItemTitle.setAnchorPoint(cc.p(0, 0.5));
        noticeItemTitle.setPosition(cc.p(40, 55));
        noticeItem.addChild(noticeItemTitle);

        var noticeIcon = cc.Sprite.create(main_scene_image.icon273);
        noticeIcon.setAnchorPoint(cc.p(0, 0.5));
        noticeIcon.setPosition(cc.p(518, 55));
        noticeItem.addChild(noticeIcon);

        var tipsItem = cc.MenuItemImage.create(
            main_scene_image.icon127,
            main_scene_image.icon127,
            this._onClickTips,
            this
        );
        tipsItem.setAnchorPoint(cc.p(0, 0.5));
        tipsItem.setPosition(cc.p(15, y));
        y -= 120;

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
        QQGroup.setAnchorPoint(cc.p(0, 0.5));
        QQGroup.setPosition(cc.p(15, y));
        y -= 120;

        var QQGroupTitle = StrokeLabel.create("Q群： 264272502", "STHeitiTC-Medium", 30);
        QQGroupTitle.setAnchorPoint(cc.p(0, 0.5));
        QQGroupTitle.setPosition(cc.p(40, 55));
        QQGroup.addChild(QQGroupTitle);

        var framesBgLabel = cc.Sprite.create(main_scene_image.icon127);
        framesBgLabel.setAnchorPoint(cc.p(0, 0.5));
        framesBgLabel.setPosition(cc.p(15, y));
        scrollViewLayer.addChild(framesBgLabel);

        var framesTitle = StrokeLabel.create("帧数选择", "STHeitiTC-Medium", 30);
        framesTitle.setAnchorPoint(cc.p(0, 0.5));
        framesTitle.setPosition(cc.p(40, 55));
        framesBgLabel.addChild(framesTitle);

        this._framesItem = [];

        this._framesItem[0] = cc.MenuItemImage.create(
            main_scene_image.icon27,
            main_scene_image.icon27,
            this._onClickFrames(0),
            this
        );
        this._framesItem[0].setAnchorPoint(cc.p(0, 0.5));
        this._framesItem[0].setPosition(cc.p(250, y));

        var framesSelectLabel1 = StrokeLabel.create("15", "STHeitiTC-Medium", 30);
        framesSelectLabel1.setAnchorPoint(cc.p(0, 0.5));
        framesSelectLabel1.setPosition(cc.p(290, 55));
        framesBgLabel.addChild(framesSelectLabel1);

        this._framesItem[1] = cc.MenuItemImage.create(
            main_scene_image.icon27,
            main_scene_image.icon27,
            this._onClickFrames(1),
            this
        );
        this._framesItem[1].setAnchorPoint(cc.p(0, 0.5));
        this._framesItem[1].setPosition(cc.p(370, y));

        var framesSelectLabel2 = StrokeLabel.create("30", "STHeitiTC-Medium", 30);
        framesSelectLabel2.setAnchorPoint(cc.p(0, 0.5));
        framesSelectLabel2.setPosition(cc.p(410, 55));
        framesBgLabel.addChild(framesSelectLabel2);

        this._framesItem[2] = cc.MenuItemImage.create(
            main_scene_image.icon27,
            main_scene_image.icon27,
            this._onClickFrames(2),
            this
        );
        this._framesItem[2].setAnchorPoint(cc.p(0, 0.5));
        this._framesItem[2].setPosition(cc.p(490, y));

        var framesSelectLabel3 = StrokeLabel.create("60", "STHeitiTC-Medium", 30);
        framesSelectLabel3.setAnchorPoint(cc.p(0, 0.5));
        framesSelectLabel3.setPosition(cc.p(530, 55));
        framesBgLabel.addChild(framesSelectLabel3);

        var point;
        for (var i = 0; i < 3; i++) {
            if (fps == FPS_LIST[i]) {
                point = this._framesItem[i].getPosition();
                break;
            }
        }
        this._framesSelect = cc.Sprite.create(main_scene_image.icon20);
        this._framesSelect.setAnchorPoint(cc.p(0, 0.5));
        this._framesSelect.setPosition(point);
        scrollViewLayer.addChild(this._framesSelect, 2);
        y -= 120;

        var go2LoginItem = cc.MenuItemImage.create(
            main_scene_image.icon127,
            main_scene_image.icon127,
            this._onClickGo2Login,
            this
        );
        go2LoginItem.setAnchorPoint(cc.p(0, 0.5));
        go2LoginItem.setPosition(cc.p(15, y));

        var go2LoginItemTitle = StrokeLabel.create("退出登录", "STHeitiTC-Medium", 30);
        go2LoginItemTitle.setAnchorPoint(cc.p(0, 0.5));
        go2LoginItemTitle.setPosition(cc.p(40, 55));
        go2LoginItem.addChild(go2LoginItemTitle);

        var go2LoginIcon = cc.Sprite.create(main_scene_image.icon273);
        go2LoginIcon.setAnchorPoint(cc.p(0, 0.5));
        go2LoginIcon.setPosition(cc.p(518, 55));
        go2LoginItem.addChild(go2LoginIcon);

        var menu = LazyMenu.create(
            bgMusicItem,
            soundItem,
            noticeItem,
            tipsItem,
            QQGroup,
            go2LoginItem,
            this._framesItem[0],
            this._framesItem[1],
            this._framesItem[2]
        );

        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        var scrollView = cc.ScrollView.create(this._configLayerFit.scrollViewSize, scrollViewLayer);
        scrollView.setContentSize(cc.size(640, scrollViewHeight));
        scrollView.setPosition(this._configLayerFit.scrollViewPoint);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        scrollView.setContentOffset(scrollView.minContainerOffset());

        return true;
    },

    _onClickBgMusic: function () {
        cc.log("ConfigLayer _onClickBgMusic");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._musicOpen = !this._musicOpen;
        this._musicSelect.setVisible(this._musicOpen);

        if (this._musicOpen) {
            gameData.sound.openMusic();
        } else {
            gameData.sound.closeMusic();
        }
    },

    _onClickSound: function () {
        cc.log("ConfigLayer _onClickSound");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._soundOpen = !this._soundOpen;
        this._soundSelect.setVisible(this._soundOpen);

        if (this._soundOpen) {
            gameData.sound.openEffect();
        } else {
            gameData.sound.closeEffect();
        }
    },

    _onClickNotice: function () {
        cc.log("ConfigLayer _onClickNotice");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (!lz.TARGET_PLATFORM_IS_BROWSER) {
            NoticeLayer.pop();
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

    _onClickFrames: function (id) {
        var that = this;

        return function () {
            cc.log("ConfigLayer _onClickFrames: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var point = that._framesItem[id].getPosition();
            that._framesSelect.setPosition(point);

            gameConfig.setFps(FPS_LIST[id]);
        }
    },

    _onClickGo2Login: function () {
        cc.log("ConfigLayer _onClickGo2Login");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (lz.platformLogout) {
            lz.platformLogout();
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