/**
 * Created by lujunyu on 14-2-13.
 */

var MOVING_X = 3;
var FADEOUT_TIME = 4;

var SpeakerLayer = cc.Layer.extend({
    _speakerLayerFit: null,

    _speaker: null,
    _msg: null,
    _moveLen: 0,
    _startPointX: null,
    _showWidth: 0,
    _msgSize: null,
    _msgLen: 0,

    init: function () {
        cc.log("SpeakerLayer init");

        if (!this._super()) return false;

        this._speakerLayerFit = gameFit.mainScene.speakerLayer;
        this._showWidth = 0;
        this._moveLen = 0;
        this._msgSize = 0;
        this._msgLen = 0;
        this._msg = null;

        var msgBgLabel = cc.Sprite.create(main_scene_image.icon370);
        msgBgLabel.setPosition(this._speakerLayerFit.msgBgLabelPoint);
        this.addChild(msgBgLabel);
        this._bgSize = msgBgLabel.getContentSize();
        var point = msgBgLabel.getPosition();
        this._startPointX = point.x + this._bgSize.width / 2 - 15;

        var speakerIcon = cc.Sprite.create(main_scene_image.icon369);
        speakerIcon.setPosition(this._speakerLayerFit.speakerIconPoint);
        this.addChild(speakerIcon);
        this.setVisible(false);
        return true;
    },

    push: function (msg) {
        cc.log("SpeakerLayer push");

        if (this._speaker) {
            this._speaker.removeFromParent();
            this._speaker = null;
        }

        if (this._msg) {
            this._msg.removeFromParent();
            this._msg = null;
        }

        this.unscheduleAllCallbacks();

        this._moveLen = 0;
        this._speaker = cc.LabelTTF.create(msg.name + ": ", "STHeitiTC-Medium", 26);
        this._msg = cc.LabelTTF.create(msg.content + " ", "STHeitiTC-Medium", 22);

        var point = this._speakerLayerFit.speakerPoint;
        this._speaker.setAnchorPoint(cc.p(0, 0.5));
        this._speaker.setPosition(point);
        this._speaker.setColor(cc.c3b(255, 239, 131));

        this._msg.setAnchorPoint(cc.p(0, 0.5));
        var size = this._speaker.getContentSize();
        this._msgSize = this._msg.getContentSize();


        this._showWidth = this._bgSize.width - size.width - 62;
        this._msg.setPosition(cc.p(this._startPointX, point.y));
        this._msgLen = this._msg.getContentSize().width;
        this._msg.setTextureRect(cc.rect(0, 0, 0, this._msgSize.height));

        this._startX = 0;
        var fps = gameConfig.get("fps");
        this.schedule(this._firstStep, 1 / fps, 6);

        this.schedule(this._secondStep, 1 / fps, (this._msgLen - this._showWidth) / MOVING_X, 1.2);
        this.scheduleOnce(this._hiddenSpeaker, FADEOUT_TIME);

        this.addChild(this._speaker);
        this.addChild(this._msg);
        this.setVisible(true);
    },

    _firstStep: function () {
        var point = this._msg.getPosition();
        var msgSize = this._msg.getContentSize();
        this._msg.setTextureRect(cc.rect(0, 0, this._moveLen, msgSize.height));
        this._msg.setPosition(cc.p(this._startPointX - this._moveLen, point.y));
        this._moveLen += this._showWidth / 6;
    },

    _secondStep: function () {
        if (this._msgSize.width - this._startX < this._showWidth - 5) {
            return;
        }
        var msgSize = this._msg.getContentSize();
        this._msg.setTextureRect(cc.rect(this._startX, 0, this._showWidth, msgSize.height));
        this._startX += MOVING_X;
        this.scheduleOnce(this._secondStep, 1 / gameConfig.get("fps"));
    },

    _hiddenSpeaker: function () {
        this._speaker.removeFromParent();
        this._msg.removeFromParent();
        this._speaker = null;
        this._msg = null;
        this.unscheduleAllCallbacks();
        this.setVisible(false);
    }
});

SpeakerLayer.create = function () {
    cc.log("SpeakerLayer create");
    var ref = new SpeakerLayer();
    if (ref && ref.init()) {
        return ref;
    }
    return null;
};

SpeakerLayer.pop = function () {

    var speakerLayer = SpeakerLayer.create();
    MainScene.getInstance().addChild(speakerLayer, 10);
    return speakerLayer;
};