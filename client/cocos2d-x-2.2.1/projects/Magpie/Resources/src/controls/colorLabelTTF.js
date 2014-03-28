/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-11-6
 * Time: 下午3:23
 * To change this template use File | Settings | File Templates.
 */


var colorLabelIcons = {
    "money": "icon149",
    "gold": "icon148",
    "power": "icon150",
    "elixir": "icon151",
    "fragment": "icon243",
    "energy": "icon154",
    "skillPoint": "icon152",
    "spirit": "icon317",
    "exp_card": "icon316",
    "exp": "icon318",
    "speaker": "icon375",
    "honor": "icon405",
    "superHonor": "icon406",
    "star": "icon427"
};

var ColorLabelTTF = cc.Node.extend({
    _size: null,

    init: function (args) {
        cc.log("ColorLabelTTF init");

        if (!this._super()) return false;

        this.setAnchorPoint(cc.p(0.5, 0.5));

        this.setLabel.apply(this, args);

        return true;
    },

    setLabel: function () {
        cc.log("ColorLabelTTF setLabel");

        this.removeAllChildren();
        this._size = cc.size(0, 0);

        this.addLabel.apply(this, arguments);
    },

    addLabel: function (args) {
        cc.log("ColorLabelTTF addLabel");

        if (arguments.length == 0) {
            return;
        }

        if (arguments.length > 1) {
            args = Array.prototype.slice.call(arguments, 0);
        }

        if (!(args instanceof Array)) {
            args = [args];
        }

        var len = args.length;
        for (var i = 0; i < len; i++) {
            var arg = args[i];
            if (arg.iconName) {
                var scale = arg.scale || 1.0;
                var spacing = arg.spacing || 2;

                this._createIcon(arg.iconName, scale, spacing);
            } else {
                var string = arg.string;
                var color = arg.color || cc.c3b(255, 255, 255);
                var fontName = arg.fontName || "STHeitiTC-Medium";
                var fontSize = arg.fontSize || 20;
                var isStroke = arg.isStroke || false;
                var dimensions = arg.dimensions || cc.size(0, 0);
                var alignment = arg.alignment || cc.TEXT_ALIGNMENT_LEFT;

                this._createLabel(string, color, fontName, fontSize, isStroke, dimensions, alignment);
            }
        }

        this.setContentSize(this._size);
    },

    _createLabel: function (string, color, fontName, fontSize, isStroke, dimensions, alignment) {
        cc.log("ColorLabelTTF createLabel");
        cc.log(string, color, fontName, fontSize, isStroke, dimensions, alignment);

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

    _createIcon: function (iconName, scale, spacing) {
        cc.log("IconLabel createIcon");

        if (!colorLabelIcons[iconName]) {
            return;
        }

        var icon = cc.Sprite.create(main_scene_image[colorLabelIcons[iconName]]);
        icon.setAnchorPoint(cc.p(0, 0.5));
        icon.setScale(scale);
        icon.setPosition(cc.p(this._size.width + spacing, 0));
        this.addChild(icon);

        var size = icon.getContentSize();
        this._size.width += size.width * scale + spacing * 2;
        this._size.height = Math.max(this._size.height, size.height);
    }
});


ColorLabelTTF.create = function (/* Multi arguments */) {
    var ret = new ColorLabelTTF();

    if (ret && ret.init(arguments)) {
        return ret;
    }

    return null;
};