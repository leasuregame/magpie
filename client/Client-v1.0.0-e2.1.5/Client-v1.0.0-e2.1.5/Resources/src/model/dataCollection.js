/**
 * Created by lcc3536 on 13-11-18.
 */


/*
 * data collection
 * */


lz.dc = {
    _dc: um.MobClickCPP,

    setAppVersion: function (str) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER) {
            this._dc.setAppVersion.call(this._dc, arguments);
        }
    },

    setCrashReportEnabled: function (enabled) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER) {
            this._dc.setCrashReportEnabled.call(this._dc, arguments);
        }
    },

    setLogEnabled: function (enabled) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER) {
            this._dc.setLogEnabled.call(this._dc, arguments);
        }
    },

    startWithAppKey: function (appKey, rp, cid) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER) {
            this._dc.startWithAppKey.call(this._dc, arguments);
        }
    },

    setLogSendInterval: function (second) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER) {
            this._dc.setLogSendInterval.call(this._dc, arguments);
        }
    },

    logPageView: function (pageName, second) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER) {
            this._dc.logPageView.call(this._dc, arguments);
        }
    },

    beginLogPageView: function (pageName) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER) {
            this._dc.beginLogPageView.call(this._dc, arguments);
        }
    },

    endLogPageView: function (pageName) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER) {
            this._dc.endLogPageView.call(this._dc, arguments);
        }
    },

    event: function (eventId, lable, accumulation) {
        if (!lz.TARGET_PLATFORM_IS_BROWSER) {
            this._dc.event.call(this._dc, arguments);
        }
    }
};

lz.dc.startWithAppKey("5279b97f56240b8276001106");
lz.dc.setCrashReportEnabled(true);