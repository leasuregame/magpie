/**
 * Created by lcc3536 on 13-11-18.
 */


/*
 * data collection
 * */

lz.um = {
    setAppVersion: function (str) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER && typeof(um) != "undefined") {
            um.MobClickCPP.setAppVersion.apply(um.MobClickCPP, arguments);
        }
    },

    setCrashReportEnabled: function (enabled) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER && typeof(um) != "undefined") {
            um.MobClickCPP.setCrashReportEnabled.apply(um.MobClickCPP, arguments);
        }
    },

    setLogEnabled: function (enabled) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER && typeof(um) != "undefined") {
            um.MobClickCPP.setLogEnabled.apply(um.MobClickCPP, arguments);
        }
    },

    startWithAppKey: function (appKey, rp, cid) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER && typeof(um) != "undefined") {
            um.MobClickCPP.startWithAppKey.apply(um.MobClickCPP, arguments);
        }
    },

    applicationDidEnterBackground: function() {
        if (!lz.TARGET_PLATFORM_IS_BROWSER && typeof(um) != "undefined") {
            um.MobClickCPP.applicationDidEnterBackground.apply(um.MobClickCPP, arguments);
        }
    },

    applicationWillEnterForeground: function() {
        if (!lz.TARGET_PLATFORM_IS_BROWSER && typeof(um) != "undefined") {
            um.MobClickCPP.applicationWillEnterForeground.apply(um.MobClickCPP, arguments);
        }
    },

    end: function() {
        if (!lz.TARGET_PLATFORM_IS_BROWSER && typeof(um) != "undefined") {
            um.MobClickCPP.end.apply(um.MobClickCPP, arguments);
        }
    },

    beginLogPageView: function (pageName) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER && typeof(um) != "undefined") {
            um.MobClickCPP.beginLogPageView.apply(um.MobClickCPP, arguments);
        }
    },

    endLogPageView: function (pageName) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER && typeof(um) != "undefined") {
            um.MobClickCPP.endLogPageView.apply(um.MobClickCPP, arguments);
        }
    },

    event: function (eventId, lable, accumulation) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER && typeof(um) != "undefined") {
            um.MobClickCPP.event.apply(um.MobClickCPP, arguments);
        }
    }
};