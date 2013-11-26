/**
 * Created by lcc3536 on 13-11-18.
 */


/*
 * data collection
 * */


lz.dc = {
    setAppVersion: function (str) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER && um) {
            um.MobClickCPP.setAppVersion.apply(um.MobClickCPP, arguments);
        }
    },

    setCrashReportEnabled: function (enabled) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER && um) {
            um.MobClickCPP.setCrashReportEnabled.apply(um.MobClickCPP, arguments);
        }
    },

    setLogEnabled: function (enabled) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER && um) {
            um.MobClickCPP.setLogEnabled.apply(um.MobClickCPP, arguments);
        }
    },

    startWithAppKey: function (appKey, rp, cid) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER && um) {
            um.MobClickCPP.startWithAppKey.apply(um.MobClickCPP, arguments);
        }
    },

    setLogSendInterval: function (second) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER && um) {
            um.MobClickCPP.setLogSendInterval.apply(um.MobClickCPP, arguments);
        }
    },

    logPageView: function (pageName, second) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER && um) {
            um.MobClickCPP.logPageView.apply(um.MobClickCPP, arguments);
        }
    },

    beginLogPageView: function (pageName) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER && um) {
            um.MobClickCPP.beginLogPageView.apply(um.MobClickCPP, arguments);
        }
    },

    endLogPageView: function (pageName) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER && um) {
            um.MobClickCPP.endLogPageView.apply(um.MobClickCPP, arguments);
        }
    },

    event: function (eventId, lable, accumulation) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER && um) {
            um.MobClickCPP.event.apply(um.MobClickCPP, arguments);
        }
    }
};

lz.dc.startWithAppKey("5279b97f56240b8276001106");
lz.dc.setLogEnabled(true);