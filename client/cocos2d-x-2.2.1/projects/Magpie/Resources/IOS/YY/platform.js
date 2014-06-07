/**
 * Created by lcc3536 on 13-12-30.
 */


/*
 * YY platform
 * */


var lz = lz || {};

lz.platformConfig = {
    OS: "IOS",
    PLATFORM: "YY",
    VERSION: "1.5.0",
    APP_ID: "IYYDS",
    APP_KEY: "OpYnjFNAqwKgoCqpfnrCPtbQdbUGPhgf",
    GATE_SERVER_HOST: "125.90.93.74",
    GATE_SERVER_PORT: "3009",
    UPDATE_PACKAGE_URL: "http://125.90.93.74:9090/api/yy/update/",
    UPDATE_VERSION_URL: "http://125.90.93.74:9090/api/yy/version",
    GAME_NOTICE_URL: "http://125.90.93.74:9090/api/yy/notice",
    UM_APP_KEY: "534c999b56240b5a0d01d4b9"
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


var yyAdapter = yy.YYAdapter.YYAdapterInstance();
yyAdapter.YYInitWithAppId(lz.platformConfig.APP_ID, false);

yyAdapter.YYOnLoginRetCode = function (code, yyUser) {
    cc.log("yyAdapter YYOnLoginRetCode: " + code);
    cc.log(JSON.stringify(yyUser));
};


lz.platformIsLogin = function () {
    cc.log("yyAdapter YYIsLogin");

    return yyAdapter.YYIsLogin();
};

lz.platformLogout = function () {
    cc.log("yyAdapter YYLogout");

    yyAdapter.YYLogout();
};