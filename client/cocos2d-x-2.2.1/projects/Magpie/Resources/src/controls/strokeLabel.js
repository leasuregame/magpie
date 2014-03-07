/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-3
 * Time: 上午10:30
 * To change this template use File | Settings | File Templates.
 */


/*
 * stroke label
 * */


var BG_LABEL_COUNT = 5;

var StrokeLabel = cc.Node.extend({
    _strLabel: null,
    _strBgLabel: null,

    init: function (arg) {
        cc.log("StrokeLabel init");

        if (!this._super()) return false;

        this._strBgLabel = [];

        var string = arg[0];
        var fontName = arg[1] || "STHeitiTC-Medium";
        var fontSize = arg[2] || 20;
        var dimensions = arg[3] || cc.size(0, 0);
        var alignment = arg[4] || cc.TEXT_ALIGNMENT_LEFT;

        this._strLabel = cc.LabelTTF.create(string, fontName, fontSize, dimensions, alignment);
        this.addChild(this._strLabel, 1);

        for (var i = 0; i < BG_LABEL_COUNT; ++i) {
            this._strBgLabel[i] = cc.LabelTTF.create(string, fontName, fontSize, dimensions, alignment);
            this.addChild(this._strBgLabel[i]);
            this._strBgLabel[i].setColor(cc.c3b(47, 7, 8));
        }

        this.update();

        return true;
    },

    update: function () {
        cc.log("StrokeLabel update");

        var fontSize = this._strLabel.getFontSize();
        var offset = fontSize / 20;

        this._strBgLabel[0].setPosition(cc.p(0, offset));
        this._strBgLabel[1].setPosition(cc.p(0, -offset));
        this._strBgLabel[2].setPosition(cc.p(-offset, 0));
        this._strBgLabel[3].setPosition(cc.p(offset, 0));
        this._strBgLabel[4].setPosition(cc.p(offset * 1.5, -offset * 1.5));

        this.setContentSize(this._strLabel.getContentSize());
    },

    setAnchorPoint: function (point) {
        cc.log("StrokeLabel setAnchorPoint");

        this._strLabel.setAnchorPoint(point);

        for (var i = 0; i < BG_LABEL_COUNT; ++i) {
            this._strBgLabel[i].setAnchorPoint(point);
        }
    },

    setString: function (text) {

        this._strLabel.setString(text);

        for (var i = 0; i < BG_LABEL_COUNT; ++i) {
            this._strBgLabel[i].setString(text);
        }

        this.update();
    },

    setColor: function (color3) {
        cc.log("StrokeLabel setColor: " + color3);

        this._strLabel.setColor(color3);
    },

    setBgColor: function (color3) {
        cc.log("StrokeLabel setColor: " + color3);

        for (var i = 0; i < BG_LABEL_COUNT; ++i) {
            this._strBgLabel[i].setColor(color3);
        }
    },

    setOpacity: function (opacity) {
        this._strLabel.setOpacity(opacity);

        for (var i = 0; i < BG_LABEL_COUNT; ++i) {
            this._strBgLabel[i].setOpacity(opacity);
        }
    },

    getOpacity: function () {
        return this._strLabel.getOpacity();
    },

    setFontName: function (fontName) {
        cc.log("StrokeLabel setFontName");

        this._strLabel.setFontName(fontName);

        for (var i = 0; i < BG_LABEL_COUNT; ++i) {
            this._strBgLabel[i].setFontName(fontName);
        }
    },

    setFontSize: function (fontSize) {
        cc.log("StrokeLabel setFontSize");

        this._strLabel.setFontSize(fontSize);

        for (var i = 0; i < BG_LABEL_COUNT; ++i) {
            this._strBgLabel[i].setFontSize(fontSize);
        }

        this.update();
    }
});


StrokeLabel.create = function (/* Multi arguments */) {
    var ret = new StrokeLabel();

    if (ret && ret.init(arguments)) {
        return ret;
    }

    return null;
};