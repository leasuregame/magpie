/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-3
 * Time: 下午3:06
 * To change this template use File | Settings | File Templates.
 */


/*
* 卡牌 详细信息面板
* */


var CardDetails = cc.Layer.extend({
    _touchedMenu : false,
    _menu : null,

    init : function(card) {
        cc.log("CardDetails init");

        if(!this._super()) return false;

        this.setTouchMode(cc.TOUCHES_ONE_BY_ONE);
        this.setTouchPriority(-100000);
        this.setTouchEnabled(true);

        var bgSprite = cc.Sprite.create("res/test1/view.png");
        this.addChild(bgSprite);

        var frame = cc.Sprite.create("res/test1/allFrame.png");
        frame.setPosition(-125, 150);
        this.addChild(frame);

        var sprite = null;
        switch (card) {
            case 1:
            case 2: sprite = cc.Sprite.create("res/test1/Rebels1.png");
                    sprite.setPosition(-125, 150);
                    this.addChild(sprite);
                    break;

            case 3:
            case 4: sprite = cc.Sprite.create("res/test1/Rebels1.png");
                    sprite.setPosition(-125, 150);
                    this.addChild(sprite);
                    sprite = cc.Sprite.create("res/test1/Rebels2.png");
                    sprite.setPosition(-125, 150);
                    this.addChild(sprite);
                    break;

            case 5: sprite = cc.Sprite.create("res/test1/Rebels3.png");
                    sprite.setPosition(-125, 150);
                    this.addChild(sprite);
                    break;
        }

        for(var i = 0; i < card; ++i) {
            var sprite = cc.Sprite.create("res/test1/star.png");
            sprite.setPosition(22, -50 * i + 300);
            this.addChild(sprite);
        }

        var closeItem = cc.MenuItemImage.create("res/test1/close.png", "res/test1/close.png", this._onClickCloseItem, this);
        closeItem.setPosition(252, -357);
        this._menu = cc.Menu.create(closeItem);
        this._menu.setPosition(0, 0);
        this.addChild(this._menu);

        return true;
    },

    _onClickCloseItem : function() {
        this.removeFromParent();
    },

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


CardDetails.create = function(card) {
    var ret = new CardDetails();

    if(ret && ret.init(card)) {
        return ret;
    }

    return null;
}

