/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-12-27
 * Time: 上午11:19
 * To change this template use File | Settings | File Templates.
 */


var NoticeLayer = cc.Layer.extend({

    _webLayer: null,

    init: function () {
        cc.log("NoticeLayer init");

        if (!this._super()) return false;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        var noticeEffect = cc.BuilderReader.load(main_scene_image.uiEffect69, this);
        noticeEffect.setPosition(cc.p(320, 568));

        var that = this;
       // this.scheduleOnce(function () {
            var url = "http://115.29.175.156:9090/api/app/notice";
            that._webLayer = lz.WebLayer.create(url, cc.rect(23, 150, 274, 265));

      //  }, 0.01);

        noticeEffect.controller.ccbMenu.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
        this.addChild(noticeEffect);
        return true;
    },

    ccbFnClose: function () {
        cc.log("NoticeLayer ccbFnClose");
        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        this._webLayer.close();
        this.removeFromParent();
        LazyLayer.closeCloudAll();
    }

});

NoticeLayer.create = function () {
    cc.log("NoticeLayer create");

    var ref = new NoticeLayer();
    if (ref && ref.init()) {
        return ref;
    }

    return null;
};

NoticeLayer.pop = function () {
    cc.log("NoticeLayer pop");

    lz.scheduleOnce(function () {
        LazyLayer.showCloudAll();
        var noticeLayer = NoticeLayer.create();
        MainScene.getInstance().addChild(noticeLayer, 10);
    },0.01);
};
