/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-11-6
 * Time: 下午3:23
 * To change this template use File | Settings | File Templates.
 */

var ColorLabelTTF = cc.Node.extend({
    _size: null,

    init: function (args) {
        cc.log("ColorLabelTTF init");

        if (!this._super()) return false;

        this._size = cc.size(0, 0);

        this._strLabel = cc.Node.create();
        this.addChild(this._strLabel);

        for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            var string = arg.string;
            var color = arg.color || cc.c3b(255, 255, 255);
            var fontName = arg.fontName || "STHeitiTC-Medium";
            var fontSize = arg.fontSize || 20;
            var isStroke = arg.isStroke || false;
            var dimensions = arg.dimensions || cc.size(0, fontSize);
            var alignment = arg.alignment || cc.TEXT_ALIGNMENT_LEFT;

            this.createLabel(string, color, fontName, fontSize, isStroke, dimensions, alignment);

        }

        this.setContentSize(this._size);

        return true;
    },

    createLabel: function (string, color, fontName, fontSize, isStroke, dimensions, alignment) {
        cc.log("ColorLabelTTF createLabel");

        var label = null;
        if (isStroke) {
            label = StrokeLabel.create(string, fontName, fontSize, dimensions, alignment);
        } else {
            label = cc.LabelTTF.create(string, fontName, fontSize, dimensions, alignment);
        }

        label.setColor(color);
        label.setAnchorPoint(cc.p(0, 0.5));
        label.setPosition(cc.p(this._size.width, 0));
        this.addChild(label);

        var size = label.getContentSize();
        this._size.width += size.width;
        this._size.height = Math.max(this._size.height, size.height);
    },

    setAnchorPoint: function (anchor) {
        cc.log("ColorLabelTTF setAnchorPoint: " + anchor);

        var children = this.getChildren();
        var len = children.length;

        for (var i = 0; i < len; ++i) {
            children[i].setAnchorPoint(anchor);
        }
    }
});

ColorLabelTTF.create = function (/* Multi arguments */) {
    var ret = new ColorLabelTTF();

    if (ret && ret.init(arguments)) {
        return ret;
    }

    return null;
};