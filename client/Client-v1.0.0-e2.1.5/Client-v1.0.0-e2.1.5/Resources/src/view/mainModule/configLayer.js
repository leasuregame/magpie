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

    musicOpen: true,
    soundOpen: true,
    musicSelect: null,
    soundSelect: null,

    init: function () {
        cc.log("ConfigLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(cc.p(40, 968));
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon260);
        titleIcon.setPosition(cc.p(360, 1008));
        this.addChild(titleIcon);

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(cc.p(100, 1008));
        var menu = cc.Menu.create(backItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        var bgMusicItem = cc.MenuItemImage.create(
            main_scene_image.icon127,
            main_scene_image.icon127,
            this._onClickBgMusic(),
            this
        );

        bgMusicItem.setAnchorPoint(cc.p(0, 0));
        bgMusicItem.setPosition(cc.p(55, 850));

        var bgMusicItemTitle = StrokeLabel.create('背景音乐', "STHeitiTC-Medium", 30);
        //bgMusicItemTitle.setColor(cc.c3b(255, 239, 131));
        bgMusicItemTitle.setAnchorPoint(cc.p(0, 0.5));
        bgMusicItemTitle.setPosition(cc.p(40, 55));
        bgMusicItem.addChild(bgMusicItemTitle);

        var bgMusicOpenSprite = cc.Sprite.create(main_scene_image.icon27);
        bgMusicOpenSprite.setAnchorPoint(cc.p(0, 0.5));
        bgMusicOpenSprite.setPosition(cc.p(470, 55));
        bgMusicItem.addChild(bgMusicOpenSprite);

        var bgMusicOpenSpriteTitle = StrokeLabel.create('开', "STHeitiTC-Medium", 30);
        //bgMusicOpenSpriteTitle.setColor(cc.c3b(255, 239, 131));
        bgMusicOpenSpriteTitle.setAnchorPoint(cc.p(0, 0.5));
        bgMusicOpenSpriteTitle.setPosition(cc.p(530, 55));
        bgMusicItem.addChild(bgMusicOpenSpriteTitle);


        this.musicSelect = cc.Sprite.create(main_scene_image.icon20);
        this.musicSelect.setAnchorPoint(cc.p(0, 0.5));
        this.musicSelect.setPosition(cc.p(470, 55));
        bgMusicItem.addChild(this.musicSelect);


        var soundItem = cc.MenuItemImage.create(
            main_scene_image.icon127,
            main_scene_image.icon127,
            this._onClickSound(),
            this

        );
        soundItem.setAnchorPoint(cc.p(0, 0));
        soundItem.setPosition(cc.p(55, 730));

        var soundItemTitle = StrokeLabel.create('游戏音效', "STHeitiTC-Medium", 30);
        //soundItemTitle.setColor(cc.c3b(255, 239, 131));
        soundItemTitle.setAnchorPoint(cc.p(0, 0.5));
        soundItemTitle.setPosition(cc.p(40, 55));
        soundItem.addChild(soundItemTitle);


        var soundOpenSprite = cc.Sprite.create(main_scene_image.icon27);
        soundOpenSprite.setAnchorPoint(cc.p(0, 0.5));
        soundOpenSprite.setPosition(cc.p(470, 55));
        soundItem.addChild(soundOpenSprite);

        var soundOpenSpriteTitle = StrokeLabel.create('开', "STHeitiTC-Medium", 30);
        //soundOpenSpriteTitle.setColor(cc.c3b(255, 239, 131));
        soundOpenSpriteTitle.setAnchorPoint(cc.p(0, 0.5));
        soundOpenSpriteTitle.setPosition(cc.p(530, 55));
        soundItem.addChild(soundOpenSpriteTitle);


        this.soundSelect = cc.Sprite.create(main_scene_image.icon20);
        this.soundSelect.setAnchorPoint(cc.p(0, 0.5));
        this.soundSelect.setPosition(cc.p(470, 55));
        soundItem.addChild(this.soundSelect);

        var tipsItem = cc.MenuItemImage.create(
            main_scene_image.icon127,
            main_scene_image.icon127,
            this._onClickTips,
            this
        );
        tipsItem.setAnchorPoint(cc.p(0, 0));
        tipsItem.setPosition(cc.p(55, 610));

        var tipsItemTitle = StrokeLabel.create('攻略', "STHeitiTC-Medium", 30);
        //tipsItemTitle.setColor(cc.c3b(255, 239, 131));
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
        QQGroup.setPosition(cc.p(55, 490));

        var QQGroupTitle = StrokeLabel.create('Q群： xxxxxxx', "STHeitiTC-Medium", 30);
        //feedbackItemTitle.setColor(cc.c3b(255, 239, 131));
        QQGroupTitle.setAnchorPoint(cc.p(0, 0.5));
        QQGroupTitle.setPosition(cc.p(40, 55));
        QQGroup.addChild(QQGroupTitle);

        var menu = cc.Menu.create(
            bgMusicItem,
            soundItem,
            tipsItem,
            QQGroup
        );

        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    _onClickBgMusic: function () {
        return function () {
            cc.log('ConfigLayer _onClickBgMusic');
            this.musicOpen = !this.musicOpen;
            this.musicSelect.setVisible(this.musicOpen);
        };
    },

    _onClickSound: function () {
        return function () {
            cc.log('ConfigLayer _onClickSound');
            this.soundOpen = !this.soundOpen;
            this.soundSelect.setVisible(this.soundOpen);
        };
    },

    _onClickTips: function () {
        cc.log('ConfigLayer _onClickTips');
        var tipsLayer = TipsLayer.create();
        this.addChild(tipsLayer, 1);
    },

    _onClickBack: function () {
        cc.log("ConfigLayer _onClickBack");

        MainScene.getInstance().switchLayer(MainLayer);
    }
});


ConfigLayer.create = function () {
    var ret = new ConfigLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};