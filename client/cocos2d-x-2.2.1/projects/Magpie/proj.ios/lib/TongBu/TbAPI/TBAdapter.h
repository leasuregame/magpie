//
//  TBAdapter.h
//
//  Created by YLo. on 13-8-2.
//
//

#ifndef ___2dx__TBAdapter__
#define ___2dx__TBAdapter__

#include <iostream>
#include "ScriptingCore.h"

#endif
/*屏幕方向枚举，等同于iOS原生方向*/
typedef enum {
    TBInterfaceOrientationPortrait = 1,
    TBInterfaceOrientationPortraitUpsideDown,
    TBInterfaceOrientationLandscapeLeft,
    TBInterfaceOrientationLandscapeRight
}TBAdapterOrientation;

struct UserData {
    char *nickName;
    char *userID;
    char *sessionId;
};

/**
 *	SDK调用类，负责适配C++与OC消息处理
 */
class TBAdapter{
private:
    TBAdapter(){};
    void TBExcuteCallback(const char *name, uint32_t argc /* = 0 */,
                          jsval *vp /* = NULL */, jsval* retVal /* = NULL */);
public:
    virtual ~TBAdapter(){};
    /*获取该类单例*/
    static TBAdapter* TBAdapterInstance();
    /*
     * 设置是否支持iOS7，只有使用iPhoneSDK 7.0编译工程时打开此选项
     */
    void TBSetSupportIOS7(bool isSupport);
    /* 初始化平台
     * appid：应用ID，由后台获取
     * orientation：平台初始方向
     * isAcceptWhenFailed：检查更新失败后是否允许进入游戏
     */
    void TBInitPlatformWithAppID(int appID,
                                 TBAdapterOrientation orientation,
                                 bool isAcceptWhenFailed);
    /*设置AppID*/
    int TBSetAppID(int appid);
    /*屏幕初始方向*/
    void TBSetScreenOrientation(TBAdapterOrientation orientation);
    /*是否开启自动旋转*/
    int TBSetAutoRotate(bool autoRotate);
    /*登录*/
    int TBLogin(int tag);
    /*注销 tag:0,表示注销但保存本地信息；1，表示注销，并清除自动登录*/
    int TBLogout(int tag);
    /*切换帐号*/
    int TBSwitchAccount();
    /*是否已登录*/
    bool TBIsLogined();
    /*开启调试模式*/
    void TBSetDebug();
    /*获取会话ID*/
    const char* TBSessionID();
    /*获取用户ID*/
    const char* TBUserID();
    /*获取用户昵称*/
    const char* TBNickName();
    /*检查更新*/
    int TBCheckUpdate();
    /*支付（指定金额）*/
    int TBUnipayForCoinWithOrder(const char *order,int amount,const char *paydes);
    /*支付（玩家自选金额）*/
    int TBUnipayForCoinWhthOrder(const char *order,const char *paydes);
    /*查询订单结果*/
    int TBCheckOrder(const char *order);
    /*进入个人中心*/
    int TBEnterUserCenter(int tag);
    /*进入游戏推荐中心*/
    int TBEnterGameCenter(int tag);
    /*进入论坛*/
    int TBEnterBBS(int tag);
/************************以下函数需要开发根据实际应用自定义************************/
    void TBInitDidFinishWithUpdateCode(int code);
    void TBLoginResultHandle(bool isSuccess);
    void TBLogoutHandle();
    void TBLeavedPlatformHandle(int closeType, const char *order);
    void TBCheckUpdateFinished(int updateResult);
    void TBBuyGoodsSuccessWithOrder(const char *order);
    void TBBuyGoodsFailed(const char *order,int error);
    void TBBuyGoodsDidEnterWebview(const char *order);
    void TBBuyGoodsDidCancelByUser(const char *order);
    void TBCheckOrderResultHandle(const char *order,int status,int amount);
    void TBCheckOrderFailed(const char *order);
/****************************************************************************/
    void ShowMessage(char *msg);
};


