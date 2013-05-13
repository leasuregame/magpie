/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-25
 * Time: 下午1:00
 * To change this template use File | Settings | File Templates.
 */

/*
* 不可点击层， 屏蔽所有点击
* */

var CloudLayer = cc.Layer.extend({
    // 事件优先级
    LEAST : -100000000,

    ctor : function() {
        this._super();
        cc.associateWithNative(this, cc.Layer);
    },

    init : function() {
        if(!this._super()) return false;

        this.setTouchMode(cc.TOUCHES_ONE_BY_ONE)
        this.setTouchPriority(this.LEAST);
        this.setTouchEnabled(true);
    },

    /**
     * default implements are used to call script callback if exist<br/>
     * you must override these touch functions if you wish to utilize them
     * @param {cc.Touch} touch
     * @param {event} event
     * @return {Boolean}
     */
    onTouchBegan:function (touch, event) {
        console.log("NoTouchLayer: touch began!");
        return true;
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchMoved:function (touch, event) {
        console.log("NoTouchLayer: touch move")
    },

    /**
     * callback when a touch event finished
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchEnded:function (touch, event) {
        console.log("NoTouchLayer: touch end")
    }
})

/*
* 单利
* */
CloudLayer.getInstance = singleton(CloudLayer);