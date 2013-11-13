/**
 * Created by lcc3536 on 13-11-14.
 */


/*
 * lottery card layer
 * */


var LotteryCardLayer = LazyLayer.extend({
    _canClick: false,

    init: function (card) {
        cc.log("LotteryCardLayer init");

        if (!this._super()) return false;

        this.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        var ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect7, this);
        ccbNode.setPosition(cc.p(320, 568));
        this.addChild(ccbNode);



        return true;
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchBegan: function (touch, event) {
        cc.log("LazyLayer onTouchBegan");

        if (this._canClick) {
            this.removeFromParent();
        }

        return true;
    }
});


LotteryCardLayer.create = function(card) {
    var ret = new LotteryCardLayer();

    if(ret && ret.init(card)) {
        return ret;
    }

    return null;
};