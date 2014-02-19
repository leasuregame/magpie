/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-12-27
 * Time: 上午11:19
 * To change this template use File | Settings | File Templates.
 */


var NoticeLayer = cc.Layer.extend({
    _webLayer: null,

    onEnter: function () {
        cc.log("NoticeLayer onEnter");

        this._super();

        lz.dc.beginLogPageView("公告界面");
    },

    onExit: function () {
        cc.log("NoticeLayer onExit");

        this._super();

        if (this._webLayer) {
            this._webLayer.close();
        }

        lz.dc.endLogPageView("公告界面");
    },

    init: function () {
        cc.log("NoticeLayer init");

        if (!this._super()) return false;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        var point = gameFit.GAME_MIDPOINT;

        var noticeEffect = cc.BuilderReader.load(main_scene_image.uiEffect69, this);
        noticeEffect.setPosition(point);

        var rect = cc.rect(point.x - 260, point.y - 280, 520, 532);
        this._webLayer = lz.WebLayer.create(lz.platformConfig.GAME_NOTICE_URL, rect);

        noticeEffect.controller.ccbMenu.setTouchPriority(WAIT_LAYER_HANDLER_PRIORITY - 1);
        this.addChild(noticeEffect);

        LazyLayer.showCloudAll();

        return true;
    },

    ccbFnClose: function () {
        cc.log("NoticeLayer ccbFnClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._webLayer.close();
        this._webLayer = null;

        this.removeFromParent();

        LazyLayer.closeCloudAll();
    }
});

NoticeLayer.create = function () {
    var ret = new NoticeLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};

NoticeLayer.pop = function () {
    lz.scheduleOnce(function () {
        var noticeLayer = NoticeLayer.create();
        cc.Director.getInstance().getRunningScene().addChild(noticeLayer, 10001);
    }, 0.01);
};
