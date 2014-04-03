/**
 * Created by lcc3536 on 13-12-3.
 */


/*
 * wait layer
 * */


// wait layer handler priority
var WAIT_LAYER_HANDLER_PRIORITY = -500;

var WaitLayer = LazyLayer.extend({
    init: function () {
        cc.log("WaitLayer init");

        if (!this._super()) return false;

        this.setTouchPriority(WAIT_LAYER_HANDLER_PRIORITY);

        var ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect88, this);
        ccbNode.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(ccbNode);

        return true;
    }
});


WaitLayer.create = function () {
    var ret = new WaitLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};


WaitLayer.pop = function () {
    var waitLayer = WaitLayer.create();

    cc.Director.getInstance().getRunningScene().addChild(waitLayer, 10000);

    return waitLayer;
};