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