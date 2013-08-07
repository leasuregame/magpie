/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-16
 * Time: 上午12:13
 * To change this template use File | Settings | File Templates.
 */


/*
* 模式对话框
* 屏蔽底层操作
* 优先级比menu更高一级
* 向其包含的menu菜单分发触摸事件
* */

cc.TOP_LAYER = 1000000;

var DIALOG_TYPE = {
    OK : 1,                 // 消息框包含“确定”按钮（默认）
    OK_CANCEL : 2,          // 消息框包含“确定”和“取消”按钮
    RETRY_CANCEL : 3,       // 消息框包含“重试”和“取消”按钮
    YES_NO : 4,             // 消息框包含“是”和“否”按钮
    YES_NO_CANCEL : 5       // 消息框包含“是”、“否”和“取消”按钮
}


var Dialog = cc.LayerColor.extend({
    _menu : null,
    _touchedMenu : false,
    _priority : cc.MENU_HANDLER_PRIORITY - 1,

    _defaultCallback : function() {
        cc.log("this is default callback");
        this.removeFromParentAndCleanup(true);
    },

    ctor : function() {
        this._super();
        cc.associateWithNative(this, cc.Layer);

        this._menu = cc.Menu.create();
        this._menu.setPosition(cc.p(0, 0));
        this.addChild(this._menu);
    },

    init : function(dialogType, text, color, width, height, callback1, callback2, callback3) {
        var winSize = cc.Director.getInstance().getWinSize();
        color = color || new cc.Color4B(0, 0, 0, 255);
        width = width || winSize.width;
        height = height || winSize.height;

        if(!this._super(color, width, height)) return false;

        this.setTouchMode(cc.TOUCHES_ONE_BY_ONE)
        this.setTouchPriority(this._priority);
        this.setTouchEnabled(true);

        dialogType = dialogType || DIALOG_TYPE.OK;
        this._initWithType(dialogType, width, height, callback1, callback2, callback3);

        text = text || "请选择：";
        var textLabel = cc.LabelTTF.create(text);
        textLabel.setPosition(width / 2, height * 2 / 3);
        textLabel.setFontSize(50);
        this.addChild(textLabel);

        this.setPosition(winSize.width / 2 - width / 2, winSize.height / 2 - height / 2);
        cc.Director.getInstance().getRunningScene().addChild(this, cc.TOP_LAYER);
    },

    _initWithType : function(dialogType, width, height, callback1, callback2, callback3) {
        callback1 = this._defaultCallback;
        callback2 = this._defaultCallback;
        callback3 = this._defaultCallback;

        switch(dialogType) {
            case DIALOG_TYPE.OK :
                cc.log("ok");
                var okItem = cc.MenuItemFont.create("ok", this._defaultCallback, this);
                okItem.setPosition(width / 2, height / 3);
                this._menu.addChild(okItem);
                break;
            case DIALOG_TYPE.OK_CANCEL :
                cc.log("okcancel");
                var okItem = cc.MenuItemFont.create("ok", function() {
                    this.key = 1;
                });
                okItem.setPosition(width / 3, height / 3);
                this._menu.addChild(okItem);

                var cancelItem = cc.MenuItemFont.create("cancel");
                cancelItem.setPosition(width * 2 / 3, height / 3);
                this._menu.addChild(cancelItem);
                break;
            case DIALOG_TYPE.RETRY_CANCEL :
                cc.log("retrycancel");
                var retryItem = cc.MenuItemFont.create("retry", function() {
                    this.key = 1;
                });
                retryItem.setPosition(width / 3, height / 3);
                this._menu.addChild(retryItem);

                var cancelItem = cc.MenuItemFont.create("cancel");
                cancelItem.setPosition(width * 2 / 3, height / 3);
                this._menu.addChild(cancelItem);
                break;
            case DIALOG_TYPE.YES_NO :
                cc.log("yesno");
                var okItem = cc.MenuItemFont.create("ok", function() {
                    this.key = 1;
                });
                okItem.setPosition(width / 3, height / 3);
                this._menu.addChild(okItem);

                var cancelItem = cc.MenuItemFont.create("cancel");
                cancelItem.setPosition(width * 2 / 3, height / 3);
                this._menu.addChild(cancelItem);
                break;
            case DIALOG_TYPE.YES_NO_CANCEL :
                cc.log("yesnocencel");
                break;
            default :
                cc.Assert(true, "dialog type error");
        }
    },



    /**
     * default implements are used to call script callback if exist<br/>
     * you must override these touch functions if you wish to utilize them
     * @param {cc.Touch} touch
     * @param {event} event
     * @return {Boolean}
     */
    onTouchBegan:function (touch, event) {
        cc.log("dialog: touch began!");
        this._touchedMenu = this._menu.onTouchBegan(touch, event);
        return true;
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchMoved:function (touch, event) {
        cc.log("dialog: touch move");
        if (this._touchedMenu) {
            this._menu.onTouchMoved(touch, event);
        }
    },

    /**
     * callback when a touch event finished
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchEnded:function (touch, event) {
        cc.log("dialog: touch end");
        if (this._touchedMenu) {
            this._menu.onTouchEnded(touch, event);
            this._touchedMenu = false;
        }
    },

    /**
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchCancelled:function (touch, event) {
        cc.log("dialog: on touch cancelled");
        if (this._touchedMenu) {
            this._menu.onTouchEnded(touch, event);
            this._touchedMenu = false;
        }
    }
})


Dialog.create = function (dialogType, text, color, width, height, callback1, callback2, callback3) {
    var ret = new Dialog();
    ret.init(dialogType, text, color, width, height, callback1, callback2, callback3);
    return ret.key;
};