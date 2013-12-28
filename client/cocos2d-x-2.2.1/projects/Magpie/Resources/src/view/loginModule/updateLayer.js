/**
 * Created by lcc3536 on 13-12-24.
 */


/*
 * update layer
 * */


var UPDATE_CREATE_FILE_ERROR = 0;
var UPDATE_NETWORK_ERROR = 1;
var UPDATE_NO_NEW_VERSION_ERROR = 2;
var UPDATE_UN_COMPRESS_ERROR = 3;

var UPDATE_PACKAGE_URL = "http://115.29.175.156:9090/api/app/update/";
var UPDATE_VERSION_URL = "http://115.29.175.156:9090/api/app/version";
var UPDATE_DIR = "update_dir";


var UpdateLayer = cc.Layer.extend({
    init: function() {
        cc.log("UpdateLayer init");

        if(!this._super()) return false;

        this._assetsManager = cc.AssetsManager.create(
            "",
            UPDATE_VERSION_URL,
            UPDATE_DIR,
            this,
            this.errorCallback,
            this.progressCallback,
            this.successCallback
        );

        this._assetsManager.setPackageUrl(UPDATE_PACKAGE_URL + (this._assetsManager.getVersion() || ""));

        this.update();

        return true;
    },

    errorCallback: function (errorCode) {
        cc.log("UpdateLayer errorCallback: " + errorCode);

        var that = this;
        var cb = (function() {
            return function() {
                that.update();
            }
        })();

        switch (errorCode) {
            case UPDATE_CREATE_FILE_ERROR:
                Dialog.pop("创建文件出错，点击重试", cb);
                break;
            case UPDATE_NETWORK_ERROR:
                Dialog.pop("网络不给力，点击重试", cb);
                break;
            case UPDATE_NO_NEW_VERSION_ERROR:
                this.noNewVersionCallback();
                break;
            case UPDATE_UN_COMPRESS_ERROR:
                Dialog.pop("解析文件出错，点击重试", cb);
                break;
            default:
                Dialog.pop("未知错误，点击重试", cb);
                break;
        }
    },

    progressCallback: function (percent) {
        percent = Math.min(percent, 100);

        cc.log("UpdateLayer progressCallback: " + percent);

        if (this._progressCb) {
            this._progressCb(percent);
        }
    },

    successCallback: function () {
        cc.log("UpdateLayer successCallback");

        require("game.jsc");
    },

    update: function () {
        cc.log("UpdateLayer update");

        this._assetsManager.update();
    },

    noNewVersionCallback: function() {
        cc.log("UpdateLayer noNewVersionCallback");

        this.getParent().switchLayer(LoginLayer);
    }
});


UpdateLayer.create = function() {
    var ret = new UpdateLayer();

    if(ret && ret.init()) {
        return ret;
    }

    return null;
};