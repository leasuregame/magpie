/**
 * Created by lcc3536 on 13-12-30.
 */


/*
 * YY platform
 * */


var lz = lz || {};

lz.platformConfig = {
    OS: "ANDROID",
    PLATFORM: "YY",
    VERSION: "1.6.2",
    APP_ID: "IYYDS",
    APP_KEY: "OpYnjFNAqwKgoCqpfnrCPtbQdbUGPhgf",
    GATE_SERVER_HOST: "124.238.236.33",
    GATE_SERVER_PORT: "3009",
    GAME_NOTICE_URL: "http://124.238.236.33:9090/api/yy/notice",
    UM_APP_KEY: "54151830fd98c55dc80008c9",
    
};

lz.updateConfig = {
    UPDATE_PACKAGE_URL: "http://124.238.236.33:9090/api/yy/update/",
    UPDATE_VERSION_URL: "http://124.238.236.33:9090/api/yy/version",

    LOAD_APP_RESOURCES_FILE_URL: "http://124.238.236.33:9090/api/yy/load/",
    LOAD_APP_RESOURCES_FILE_VERSION: "http://124.238.236.33:9090/api/yy/load/version",
    KEY_OF_HAS_LAOD_APP_FILES: 'has-load-app-files',
    UPDATE_TYPE: {
        LOAD_RESOURCES: 1,
        UPDATE_VERSION: 2
    }
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
    
//yy.YYClient.init();

lz.platformIsLogin = function () {
    cc.log("yyAdapter YYIsLogin");
    var isLogin = yy.YYClient.getLoginResult();
    cc.log('login result: ', isLogin+'')
    return isLogin == 'true';
};

lz.platformLogout = function () {
    cc.log("yyAdapter YYLogout");

    //yy.YYClient.exitSDK();
};