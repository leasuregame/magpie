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
    _touchedMenu: false,
    _menu: null,

    init: function (card) {
        cc.log("CardDetails init" + card);

        if (!this._super()) return false;

        this.setTouchMode(cc.TOUCHES_ONE_BY_ONE);
        this.setTouchPriority(-100000);
        this.setTouchEnabled(true);

        var bgSprite = cc.Sprite.create(s_card_view);
        this.addChild(bgSprite);

        var frame = cc.Sprite.create(s_frame3);
        frame.setPosition(-125, 150);
        this.addChild(frame);

        var sprite = cc.Sprite.create(s_hero_1);
        sprite.setPosition(-125, 150);
        this.addChild(sprite);

        if(card > 1) {
            sprite = cc.Sprite.create("res/test/" + card + ".png");
            sprite.setPosition(-125, 150);
            this.addChild(sprite);
        }

        card = card % 6;
        if(card == 0) card = 1;

        for (var i = 0; i < card; ++i) {
            sprite = cc.Sprite.create("res/test/star" + card + ".png");
            sprite.setPosition(22, -50 * i + 300);
            this.addChild(sprite);
        }

        var closeItem = cc.MenuItemImage.create(s_close, s_close, this._onClickCloseItem, this);
        closeItem.setPosition(252, -357);
        this._menu = cc.Menu.create(closeItem);
        this._menu.setPosition(0, 0);
        this.addChild(this._menu);

        return true;
    },

    _onClickCloseItem: function () {
        this.removeFromParent();
    },

    onTouchBegan: function (touch, event) {
        cc.log("dialog: touch began!");
        this._touchedMenu = this._menu.onTouchBegan(touch, event);
        return true;
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchMoved: function (touch, event) {
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
    onTouchEnded: function (touch, event) {
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
    onTouchCancelled: function (touch, event) {
        cc.log("dialog: on touch cancelled");
        if (this._touchedMenu) {
            this._menu.onTouchEnded(touch, event);
            this._touchedMenu = false;
        }
    }
})


CardDetails.create = function (card) {
    var ret = new CardDetails();

    if (ret && ret.init(card)) {
        return ret;
    }

    return null;
}

