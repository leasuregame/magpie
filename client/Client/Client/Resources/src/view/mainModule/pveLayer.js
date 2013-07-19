/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-16
 * Time: 下午4:28
 * To change this template use File | Settings | File Templates.
 */


/*
 * pve layer
 * */


var PveLayer = cc.Layer.extend({
    _nowLayer: null,

    init: function () {
        cc.log("PveLayer init");

        if (!this._super()) return false;

        var menuBg = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), GAME_WIDTH, 60);

        var taskLayerItem = cc.MenuItemFont.create("任务", this._onClickTaskLayer, this);
        taskLayerItem.setAnchorPoint(cc.p(0.5, 0.5));
        taskLayerItem.setPosition(cc.p(150, 30));

        var passLayerItem = cc.MenuItemFont.create("关卡", this._onClickPassLayer, this);
        passLayerItem.setAnchorPoint(cc.p(0.5, 0.5));
        passLayerItem.setPosition(cc.p(500, 30));

        var menu = cc.Menu.create(taskLayerItem, passLayerItem);
        menu.setPosition(cc.p(0, 0));
        menuBg.addChild(menu);

        menuBg.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, 988));
        this.addChild(menuBg);

        this._nowLayer = TaskLayer.create();
        this.addChild(this._nowLayer);

        return true;
    },

    _onClickTaskLayer: function () {
        cc.log("PveLayer _onClickTaskLayer");

        this.switchLayer(TaskLayer);
    },

    _onClickPassLayer: function () {
        cc.log("PveLayer _onClickPassLayer");

        this.switchLayer(PassLayer);
    },

    switchLayer: function (runLayer) {
        cc.log("PveLayer switchMenu");
        cc.log("this._nowLayer is runLayer " + (this._nowLayer instanceof runLayer));

        if (!(this._nowLayer instanceof runLayer)) {
            if (this._nowLayer != null) this.removeChild(this._nowLayer);
            this._nowLayer = runLayer.create();
            this.addChild(this._nowLayer);
        }
    }
})

PveLayer.create = function () {
    var ret = new PveLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}