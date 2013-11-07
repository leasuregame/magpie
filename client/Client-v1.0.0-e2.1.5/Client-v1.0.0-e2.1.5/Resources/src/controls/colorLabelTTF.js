/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-11-6
 * Time: 下午3:23
 * To change this template use File | Settings | File Templates.
 */

var ColorLabelTTF = cc.Node.extend({
    _position: cc.p(0, 0),

    init: function (args) {
        cc.log("ColorLabelTTF init");

        if (!this._super()) return false;

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
        label.setPosition(this._position);
        var size = label.getContentSize();
        this._position.x += size.width;
        this.addChild(label);
    },

    setAnchorPoint: function (anchor) {
        cc.log("ColorLabelTTF setAnchorPoint: " + anchor);

        cc.Node.prototype.setAnchorPoint.call(this, anchor);
    },

    setPosition: function (point) {
        cc.log("ColorLabelTTF setPosition: " + point);

        cc.Node.prototype.setPosition.call(this, point);
    }
});

ColorLabelTTF.create = function (/* Multi arguments */) {
    var ret = new ColorLabelTTF();

    if (ret && ret.init(arguments)) {
        return ret;
    }

    return null;
};