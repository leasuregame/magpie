/**
 * Created by lcc3536 on 13-12-30.
 */


/*
 * 91 platform
 * */


var lz = lz || {};

lz.platformConfig = {
    OS: "IOS",
    PLATFORM: "91",
    VERSION: "1.4.0",
    APP_ID: 113216,
    APP_KEY: "3049d17b5d525b97ec758f1716f6f0bbcdde80486343ee72",
    GATE_SERVER_HOST: "124.238.236.33",
    GATE_SERVER_PORT: "3009",
    UPDATE_PACKAGE_URL: "http://124.238.236.33:9090/api/app/update/",
    UPDATE_VERSION_URL: "http://124.238.236.33:9090/api/app/version",
    GAME_NOTICE_URL: "http://124.238.236.33:9090/api/app/notice",
    UM_APP_KEY: "5314371056240be15b216fc1"
};


(function () {
    if (!lz.TARGET_PLATFORM_IS_BROWSER) {
        // 程序到后台时调用
        cc.Application.getInstance().jsApplicationDidEnterBackground = function () {
            cc.log("*************************************************************");
            cc.log("cc.Application.getInstance().jsApplicationDidEnterBackground");
            cc.log("*************************************************************");

            if (typeof(lz.NotificationHelp) != "undefined") {
                lz.NotificationHelp.end();
            }

            lz.um.applicationDidEnterBackground();
        };

        // 程序回复运行时调用
        cc.Application.getInstance().jsApplicationWillEnterForeground = function () {
            cc.log("*************************************************************");
            cc.log("cc.Application.getInstance().jsApplicationWillEnterForeground");
            cc.log("*************************************************************");

            if (typeof(lz.NotificationHelp) != "undefined") {
                lz.NotificationHelp.start();
            }

            lz.um.applicationWillEnterForeground();
        };
    }
})();


(function jsApplicationDidFinishLaunching() {
    cc.log("*************************************************************");
    cc.log("jsApplicationDidFinishLaunching");
    cc.log("*************************************************************");

    if (typeof(lz.NotificationHelp) != "undefined") {
        lz.NotificationHelp.start();
    }

    lz.um.startWithAppKey(lz.platformConfig.UM_APP_KEY);
})();


var ND_VERSION_CHECK_LEVEL_STRICT = 0;                  // 默认，严格等级，版本检测失败卡界面
var ND_VERSION_CHECK_LEVEL_NORMAL = 1;                  // 正常等级

var UI_DEVICE_ORIENTATION_UN_KNOWN = 0;
var UI_DEVICE_ORIENTATION_PORTRAIT = 1;                 // Device oriented vertically, home button on the bottom
var UI_DEVICE_ORIENTATION_PORTRAIT_UPSIDE_DOWN = 2;     // Device oriented vertically, home button on the top
var UI_DEVICE_ORIENTATION_LANDSCAPE_LEFT = 3;           // Device oriented horizontally, home button on the right
var UI_DEVICE_ORIENTATION_LANDSCAPE_RIGHT = 4;          // Device oriented horizontally, home button on the left
var UI_DEVICE_ORIENTATION_FACE_UP = 5;                  // Device oriented flat, face up
var UI_DEVICE_ORIENTATION_FACE_DOWN = 6;                // Device oriented flat, face down

var ND_TOOL_BAR_AT_TOP_LEFT = 1;                        // 左上
var ND_TOOL_BAR_AT_TOP_RIGHT = 2;                       // 右上
var ND_TOOL_BAR_AT_MIDDLE_LEFT = 3;                     // 左中
var ND_TOOL_BAR_AT_MIDDLE_RIGHT = 4;                    // 右中
var ND_TOOL_BAR_AT_BOTTOM_LEFT = 5;                     // 左下
var ND_TOOL_BAR_AT_BOTTOM_RIGHT = 6;                    // 右下

var ND_LOGIN_STATE_NOT_LOGIN = 0;	                    // 未登录
var ND_LOGIN_STATE_GUEST_LOGIN = 1;		                // 游客账号登陆
var ND_LOGIN_STATE_NORMAL_LOGIN = 2;	                // 普通账号登陆