//
//  NDAdapter.h
//  Magpie
//
//  Created by lCeve on 14-4-11.
//
//

#ifndef __ND_ADAPTER__
#define __ND_ADAPTER__

#include <iostream>

typedef struct BuyInfoData {
    const char * cooOrderSerial;
	const char * productId;
	const char * productName;
	float productPrice;
	float productOrignalPrice;
	int productCount;
	const char * payDescription;
} BuyInfo;

class NDAdapter
{
public:
    NDAdapter();
    virtual ~NDAdapter();
    
    static NDAdapter * NDAdapterInstance();
    
    /**
     @brief 应用初始化 初始化完成后会发送kNdCPInitDidFinishNotification
     @param configure 初始化配置类
     */
    int NDInit(int appId, const char * appKey, int versionCheckLevel);
    
    /**
     @brief 设定调试模式
     @param nFlag 预留，默认为0
     */
    void NDSetDebugMode(int mode);
    
    /**
     @brief 显示工具栏
     */
    void NDShowToolBar(int place);
    
    /**
     @brief 隐藏工具栏
     */
    void NDHideToolBar();
    
    /**
     @brief 设定平台为横屏或者竖屏
     */
    void NDSetScreenOrientation(int orientation);
    
    /**
     @brief 设置是否自动旋转。
     @note
     1:iPad默认开启自动旋转，iPhone默认关闭自动旋转
     2设置NO后，使用NdSetScreenOrientation设置的方向
     3设置Yes后，iPad支持4个方向切换自适应旋转；iPhone不支持横竖屏切换自适应旋转，仅支持横屏自适应旋转或者竖屏自适应旋转。
     */
    void NDSetAutoRotation(bool isAutoRotate);
    
    /**
     @brief 登录平台,进入登录或者注册界面入口
     @param nFlag 标识（按位标识）预留，默认为0
     @result 错误码
     */
    void NDLogin(int nFlag);
    
    /**
     @brief 登录平台,默认自动登陆，支持游客账号登陆
     @param nFlag 标识（按位标识）预留，默认为0
     @result 错误码
     */
    void NDLoginEx(int nFlag);
    
    /**
     @brief 进入游客账号转正式账号界面
     @param nFlag 标识（按位标识）预留，默认为0
     */
    void NDGuestRegist(int nFlag);
    
    /**
     @brief 判断是否已经登录平台
     */
    bool NDIsLogined();
    
    /**
     @brief 获取当前登陆账户的状态
     @result 登录类型
     */
    int NDGetCurrentLoginState();
    
    /**
     @brief 切换账号（logout+login），会注销当前登录的账号。
     */
    void NDSwitchAccount();
    
    /**
     @brief 进入账号管理界面，用户可以选择其它账号登录。如果没有新账号登录，当前登录的账号仍然有效。
     @result 错误码
     */
    int NDEnterAccountManage();
    
    /**
     @brief 获取登录后的Uin
     */
    const char * NDLoginUin();
    
    /**
     @brief 获取本次登录的sessionId，需要登录后才能获取
     */
    const char * NDSessionId();
    
    /**
     @brief 获取登录后的昵称
     */
    const char * NDNickName();
    
    /**
     @brief 注销
     @param nFlag 标识（按位标识）0,表示注销；1，表示注销，并清除自动登录
     @result 错误码
     */
    int NDLogout(int nFlag);
    
    /**
     @brief 用户反馈
     @result 错误码
     */
    int NDUserFeedback();
    
    /**
     @brief 暂停 暂停页消失后会发送kNdCPPauseDidExitNotification
     */
    int NDPause();
    
    /**
     @brief 进入平台中心
     @param nFlag 预留, 默认为0
     */
    void NDEnterPlatform(int nFlag);
    
    /**
     @brief 向通用业务服务器发起支付请求,必须登录后才能使用
     @param buyInfo 购买信息
     @result 若未登录调用则返回错误码，否则返回0
     */
    int NDUniPay(const char * cooOrderSerial,       // 合作商的订单号，必须保证唯一，双方对账的唯一标记（用GUID生成，32位）
               const char * productId,              // 商品Id
               const char * productName,            // 商品名字
               float productOrignalPrice,           // 商品价格，两位小数
               float productPrice,                  // 商品原始价格，保留两位小数
               int productCount,                    // 购买商品个数
               const char * payDescription);        // 购买描述，可选，没有为空
    
    int NDUniPayAsyn(const char * cooOrderSerial,   // 合作商的订单号，必须保证唯一，双方对账的唯一标记（用GUID生成，32位）
              const char * productId,               // 商品Id
              const char * productName,             // 商品名字
              float productOrignalPrice,            // 商品价格，两位小数
              float productPrice,                   // 商品原始价格，保留两位小数
              int productCount,                     // 购买商品个数
              const char * payDescription);         // 购买描述，可选，没有为空
    
    
/******************************************************************************
 *
 *	Objective-C回调中调回C++同名函数
 *
 *****************************************************************************/
    // 初始化完成的通知
    void SNSInitResult(bool result, int code);
    
    // 离开平台界面时，会发送该通知
    void SNSLeavePlatform(bool result, int code);
    
    // 登录完成的通知
    void SNSLoginResult(bool result, int code);
    
    // 暂停页退出的通知
    void SNSPauseExit(bool result, int code);
    
    // 购买结果的通知,在购买结束时会发送该通知
    void SNSBuyResult(bool result, int code, BuyInfo * buyInfo);
};

#endif /* defined(__ND_ADAPTER__) */
