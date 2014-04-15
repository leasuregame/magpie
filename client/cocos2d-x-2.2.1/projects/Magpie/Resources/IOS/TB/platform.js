/**
 * Created by lcc3536 on 13-12-30.
 */


/*
 * TB platform
 * */


var lz = lz || {};

lz.platformConfig = {
    OS: "IOS",
    PLATFORM: "TB",
    VERSION: "1.4.0",
    APP_ID: 131232,
    APP_KEY: "o$KiXv0SHUsB6Dbz$2Kivk9GeTs6ODzo",
    GATE_SERVER_HOST: "115.29.12.178",
    GATE_SERVER_PORT: "3009",
    UPDATE_PACKAGE_URL: "http://115.29.12.178:9090/api/tb/update/",
    UPDATE_VERSION_URL: "http://115.29.12.178:9090/api/tb/version",
    GAME_NOTICE_URL: "http://115.29.12.178:9090/api/tb/notice",
    UM_APP_KEY: "534c99f956240b191c287b68"
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
        };

        // 程序回复运行时调用
        cc.Application.getInstance().jsApplicationWillEnterForeground = function () {
            cc.log("*************************************************************");
            cc.log("cc.Application.getInstance().jsApplicationWillEnterForeground");
            cc.log("*************************************************************");

            if (typeof(lz.NotificationHelp) != "undefined") {
                lz.NotificationHelp.start();
            }
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


var BUY_GOODS_BALANCE_NOT_ENOUGH = 0;                           // 余额不足
var BUY_GOODS_SERVER_ERROR = 1;                                 // 服务器错误
var BUY_GOODS_ORDER_EMPTY = 2;                                  // 订单号为空
var BUY_GOODS_NETWORKING_ERROR = 3;                             // 网络不流畅
var BUY_GOODS_OTHER_ERROR = 4;                                  // 其他错误

var TB_PLATFORM_LEAVED_DEFAULT = 0;                             // 离开未知平台
var TB_PLATFORM_LEAVED_FROM_LOGIN = 1;                          // 离开注册、登录页面
var TB_PLATFORM_LEAVED_FROM_USER_CENTER = 2;                    // 离开个人中心、游戏推荐、论坛页面
var TB_PLATFORM_LEAVED_FROM_USER_PAY = 3;                       // 离开充值页面（成功或者失败）

var TB_PLATFORM_NO_APPID_ERROR = -105;                          // 未设置AppID
var TB_PLATFORM_NETWORKING_ERROR = -100;                        // 网络不给力
var TB_PLATFORM_NOT_LOGINED = -1;                               // 玩家未登录
var TB_PLATFORM_NO_ERROR = 0;                                   // 没有错误
var TB_PLATFORM_LOGIN_FAILED_ERROR = 1;                         // 登录失败
var TB_PLATFORM_LOGIN_INCORRECT_ACCOUNT_OR_PASSWORD_ERROR = 2;  // 帐号或密码错误
var TB_PLATFORM_LOGIN_INVALID_ACCOUNT_ERROR = 3;                // 帐号被禁用
var TB_PLATFORM_LOGIN_SYNC_FAILED_ERROR = 300;                  // 帐号同步出错
var TB_PLATFORM_LOGIN_REQUEST_FAILED_ERROR = 400;               // 登录请求失败
var TB_PLATFORM_NO_BBS = 1000;                                  // 该游戏未配置论坛

// 初始化TB平台
var tbAdapter = tb.TBAdapter.TBAdapterInstance();
tbAdapter.TBInitPlatformWithAppID(lz.platformConfig.APP_ID, 1, false);
tbAdapter.TBSetAutoRotate(true);

// 初始化平台完成回调
tbAdapter.initDidFinishWithUpdateCodeHandler = function (code) {
    cc.log("tbAdapter initDidFinishWithUpdateCodeHandler: " + code);

    tbAdapter.TBLogin(0);
};

// 登录成功回调
tbAdapter.loginResultHandler = function (isSuccess) {
    cc.log("tbAdapter loginResultHandler: " + isSuccess);
};

// 退出登录
tbAdapter.logoutHandler = function () {
    cc.log("tbAdapter logoutHandler");

//    lz.server.disconnect();
};

// 离开平台回调
tbAdapter.leavedPlatformHandler = function (closeType, order) {
    cc.log("tbAdapter leavedPlatformHandler");
    cc.log(closeType);
    cc.log(order);

    switch (closeType) {
        case TB_PLATFORM_LEAVED_DEFAULT:
            break;
        case TB_PLATFORM_LEAVED_FROM_LOGIN:
            break;
        case TB_PLATFORM_LEAVED_FROM_USER_CENTER:
            break;
        case TB_PLATFORM_LEAVED_FROM_USER_PAY:
            tbAdapter.TBCheckOrder(order);
            break;
        default:
            break;
    }
};

// 购买成功回调
tbAdapter.buyGoodsSuccessWithOrderHandler = function (order) {
    cc.log("tbAdapter buyGoodsSuccessWithOrderHandler: " + order);

    gameData.payment._closeWaitLayer();
    gameData.payment.buyGoodsSuccess(order);

    Dialog.pop("充值成功，请稍候");
};

// 购买失败回调
tbAdapter.buyGoodsFailedHandler = function (order, error) {
    cc.log("tbAdapter buyGoodsFailedHandler: " + order);
    cc.log(error);

    switch (error) {
        case BUY_GOODS_BALANCE_NOT_ENOUGH:
            Dialog.pop("充值失败，余额不足");
            break;
        case BUY_GOODS_SERVER_ERROR:
            Dialog.pop("充值失败，服务器错误");
            break;
        case BUY_GOODS_ORDER_EMPTY:
            Dialog.pop("充值失败，订单号错误");
            break;
        case BUY_GOODS_NETWORKING_ERROR:
            tbAdapter.TBCheckOrder(order);
            return;
        case BUY_GOODS_OTHER_ERROR:
            Dialog.pop("充值失败，未知错误");
            break;
        default:
            break;
    }

    gameData.payment._closeWaitLayer();
};

// 查询订单成功回调
tbAdapter.checkOrderResultHandler = function (order, status, amount) {
    cc.log("tbAdapter checkOrderResultHandler");
    cc.log(order);
    cc.log(status);

    gameData.payment._closeWaitLayer();

    switch (status) {
        case -1:
            Dialog.pop("充值失败，未知错误");
            break;
        case 0:
            Dialog.pop("充值失败");
            break;
        case 1:
            Dialog.pop("充值失败");
            break;
        case 2:
            Dialog.pop("充值失败");
            break;
        case 3:
            gameData.payment.buyGoodsSuccess(order);
            Dialog.pop("充值成功，请稍候");
            break;
        default :
            break;
    }
};

// 查询订单失败回调
tbAdapter.checkOrderFailedHandler = function (order, status, amount) {
    cc.log("tbAdapter checkOrderFailedHandler");

    gameData.payment._closeWaitLayer();
    Dialog.pop("充值失败");
};

// 取消进入支付界面
tbAdapter.buyGoodsDidCancelByUser = function (order, status, amount) {
    cc.log("tbAdapter buyGoodsDidCancelByUser");

    gameData.payment._closeWaitLayer();
    Dialog.pop("充值失败");
};

tbAdapter.buyGoodsDidEnterWebViewHandler = function (order) {
    cc.log("tbAdapter buyGoodsDidEnterWebViewHandler");
};


lz.platformIsLogin = function () {
    cc.log("tbAdapter TBIsLogined");

    return tbAdapter.TBIsLogined();
};

lz.platformLogout = function () {
    cc.log("tbAdapter TBLogout");

    tbAdapter.TBLogout(0);
};

lz.platformShowCenter = function () {
    cc.log("tbAdapter TBEnterUserCenter");

    tbAdapter.TBEnterUserCenter(0);
};