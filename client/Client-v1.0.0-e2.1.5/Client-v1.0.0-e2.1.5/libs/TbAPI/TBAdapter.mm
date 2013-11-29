//
//  TBAdapter.cpp
//  2dxagain
//
//  Created by YLo. on 13-8-2.
//
//

#include "TBAdapter.h"
#include <TBPlatform/TBPlatform.h>
#include "TBCallbackHandler.h"

//TBAdapter TBAdapter::TBAdapter(){
    //[TBCallbackHandler sharedHandler];
//};
/**
 *	Adapter类实现
 *
 */
static TBAdapter *m_Instance;
TBAdapter * TBAdapter::TBAdapterInstance(){
    if (m_Instance == NULL){
        m_Instance = new TBAdapter();
    }
    [TBCallbackHandler sharedHandler];
    return m_Instance;
}
/* 初始化平台
 * appid：应用ID，由后台获取
 * orientation：平台初始方向
 * isAcceptWhenFailed：检查更新失败后是否允许进入游戏
 */
void TBAdapter::TBInitPlatformWithAppID(int appID,
                                        TBAdapterOrientation orientation,
                                        bool isAcceptWhenFailed){
    [[TBPlatform defaultPlatform] TBInitPlatformWithAppID:appID
                                        screenOrientation:orientation
                          isContinueWhenCheckUpdateFailed:NO];
}
/*设置AppID*/
int TBAdapter::TBSetAppID(int appid){
    return [[TBPlatform defaultPlatform] setAppId:appid];
}
/*屏幕初始方向*/
void TBAdapter::TBSetScreenOrientation(TBAdapterOrientation orientation){
    [[TBPlatform defaultPlatform] TBSetScreenOrientation:orientation];
}
/*是否开启自动旋转*/
int TBAdapter::TBSetAutoRotate(bool autoRotate){
    [[TBPlatform defaultPlatform] TBSetAutoRotation:autoRotate];
    return 1;
}
/*登录*/
int TBAdapter::TBLogin(int tag){
    return [[TBPlatform defaultPlatform] TBLogin:0];
}
/*注销*/
int TBAdapter::TBLogout(int tag){
    return [[TBPlatform defaultPlatform] TBLogout:tag];
}
/*切换帐号*/
int TBAdapter::TBSwitchAccount(){
    [[TBPlatform defaultPlatform] TBSwitchAccount];
    return 1;
}
/*是否已登录*/
bool TBAdapter::TBIsLogined(){
    return [[TBPlatform defaultPlatform] isLogined];
}
/*开启调试模式*/
void TBAdapter::TBSetDebug(){
    [[TBPlatform defaultPlatform] TBSetDebugMode:0];
}
/*获取会话ID*/
const char* TBAdapter::TBSessionID(){
    return [[TBPlatform defaultPlatform] sessionId].UTF8String;
}
/*获取用户ID*/
const char* TBAdapter::TBUserID(){
    return [[TBPlatform defaultPlatform] userID].UTF8String;
}
/*获取用户昵称*/
const char* TBAdapter::TBNickName(){
    return [[TBPlatform defaultPlatform] nickName].UTF8String;
}
/*检查更新*/
int TBAdapter::TBCheckUpdate(){
    return [[TBPlatform defaultPlatform] TBAppVersionUpdate:0
                                                   delegate:[TBCallbackHandler sharedHandler]];
}
/*支付（指定金额）*/
int TBAdapter::TBUnipayForCoinWithOrder(const char *order,int amount,const char *paydes){
    return [[TBPlatform defaultPlatform] TBUniPayForCoin:[NSString stringWithUTF8String:order]
                                              needPayRMB:amount
                                          payDescription:[NSString stringWithUTF8String:paydes]
                                                delegate:[TBCallbackHandler sharedHandler]];
}
/*支付（玩家自选金额）*/
int TBAdapter::TBUnipayForCoinWhthOrder(const char *order,const char *paydes){
    return [[TBPlatform defaultPlatform] TBUniPayForCoin:[NSString stringWithUTF8String:order]
                                          payDescription:[NSString stringWithUTF8String:paydes]];
}
/*查询订单结果*/
int TBAdapter::TBCheckOrder(const char *order){
    return [[TBPlatform defaultPlatform] TBCheckPaySuccess:[NSString stringWithUTF8String:order]
                                                  delegate:[TBCallbackHandler sharedHandler]];
}
/*进入个人中心*/
int TBAdapter::TBEnterUserCenter(int tag){
    [[TBPlatform defaultPlatform] TBEnterUserCenter:0];
    return 1;
}
/*进入游戏推荐中心*/
int TBAdapter::TBEnterGameCenter(int tag){
    [[TBPlatform defaultPlatform] TBEnterAppCenter:0];
    return 1;
}
/*进入论坛*/
int TBAdapter::TBEnterBBS(int tag){
    return [[TBPlatform defaultPlatform] TBEnterAppBBS:0];
}
/************************以下函数需要开发根据实际应用自定义************************/
void TBAdapter::TBInitDidFinishWithUpdateCode(int code){
#warning 初始化结果处理（需要自定义）
    this->ShowMessage("初始化结果（检查更新结果）:%d");
}
void TBAdapter::TBLoginResultHandle(bool isSuccess){
#warning 登录结果处理（需要自定义）
    this->ShowMessage("登录结果:%d");
}
void TBAdapter::TBLogoutHandle(){
#warning 注销结果处理（需要自定义）
    this->ShowMessage("Logouted");
}
void TBAdapter::TBLeavedPlatformHandle(int closeType, const char *order){
#warning 平台离开通知（需要自定义）
    this->ShowMessage("离开类型:%d,订单号(仅从充值页关闭时有值):%s");
}
void TBAdapter::TBCheckUpdateFinished(int result){
#warning 检查更新结果（需要自定义）
    this->ShowMessage("检查更新结果:%d");
}
void TBAdapter::TBBuyGoodsSuccessWithOrder(const char *order){
#warning 推币购买物品成功（需要自定义）
    this->ShowMessage("购买物品成功:%@");
}
void TBAdapter::TBBuyGoodsFailed(const char *order,int error){
#warning 购买物品失败（需要自定义）
    this->ShowMessage("购买物品失败:%@ errorCode:%d");
}
void TBAdapter::TBBuyGoodsDidEnterWebview(const char *order){
#warning 余额不足，进入充值支付页面（需要自定义）
    this->ShowMessage("进入充值Web页，订单号:%@");
}
void TBAdapter::TBCheckOrderResultHandle(const char *order,int status,int amount){
#warning 查询订单结果（需要自定义）
    this->ShowMessage("查询订单结果\nOrder:%@\nStatus:%d\nAmount:%d");
}
void TBAdapter::TBCheckOrderFailed(const char *order){
#warning 查询订单失败（需要自定义）
    this->ShowMessage("查询订单失败，订单号:%@");
}

void TBAdapter::TBBuyGoodsDidCancelByUser(const char *order){
    this->ShowMessage("取消支付");
}

void TBAdapter::ShowMessage(char *msg){
    NSString* _msg = [NSString stringWithUTF8String:msg];
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Notice"
                                                    message:_msg
                                                   delegate:nil
                                          cancelButtonTitle:@"See"
                                          otherButtonTitles:nil, nil];
    [alert show];
    [alert release];
}

#pragma mark - ****************************************************************
#define _NotiCenter [NSNotificationCenter defaultCenter]
static TBCallbackHandler *p_instance = NULL;
/******************************************************************************
 *
 *	消息、回调中转类
 *
 *  负责处理Objective-C原生回调、通知处理
 *
 *****************************************************************************/
@implementation TBCallbackHandler
+ (TBCallbackHandler*)sharedHandler{
    if (!p_instance) {
        p_instance = [[TBCallbackHandler alloc] init];
    }
    return p_instance;
}
- (id)init{
    if (self = [super init]) {
        [_NotiCenter addObserver:self selector:@selector(TBLoginNotify:) name:kTBLoginNotification object:nil];
        [_NotiCenter addObserver:self selector:@selector(TBLogoutNotify:) name:kTBUserLogoutNotification object:nil];
        [_NotiCenter addObserver:self selector:@selector(TBLeavedNotify:) name:kTBLeavePlatformNotification object:nil];
        [_NotiCenter addObserver:self selector:@selector(TBInitFinishedNotify:) name:kTBInitDidFinishNotification object:nil];
    }
    return  self;
}
- (void)dealloc{
    [_NotiCenter removeObserver:self];
    [super dealloc];
}
#pragma mark - Notifications
/**
 *	初始化结果通知
 *
 */
- (void)TBInitFinishedNotify:(NSNotification *)notify{
    int updateResult = [[notify.userInfo objectForKey:@"updateResult"] intValue];
    TBAdapter::TBAdapterInstance() -> TBInitDidFinishWithUpdateCode(updateResult);
}
/**
 *	登录结果通知
 */
- (void)TBLoginNotify:(id)notify{
    NSDictionary *dict = [notify userInfo];
	BOOL isSuccess  = [[dict objectForKey:@"result"] boolValue];
    TBAdapter::TBAdapterInstance()->TBLoginResultHandle(isSuccess);
}
/**
 *	注销结果通知
 *
 */
- (void)TBLogoutNotify:(id)notify{
    TBAdapter::TBAdapterInstance()->TBLogoutHandle();
}
/**
 *	玩家离开平台通知
 *
 */
- (void)TBLeavedNotify:(NSNotification *)notify{
    TBAdapter::TBAdapterInstance()->TBLeavedPlatformHandle([[notify.userInfo objectForKey:TBLeavedPlatformTypeKey] intValue],
                                                           [[notify.userInfo objectForKey:TBLeavedPlatformOrderKey] UTF8String]);
}
#pragma mark - Kinds of callbacks
#pragma mark 检查更新回调
- (void)appVersionUpdateDidFinish:(TB_APP_UPDATE_RESULT)updateResult{
    /***
     typedef enum  _TB_APP_UPDATE_RESULT {
     TB_APP_UPDATE_NO_NEW_VERSION = 0,                  没有新版本
     TB_APP_UPDATE_UPDATE_CANCEL_BY_USER = 1,           用户取消下载更新
     TB_APP_UPDATE_NEW_VERSION_DOWNLOAD_FAIL = 2,       下载新版本失败
     TB_APP_UPDATE_CHECK_NEW_VERSION_FAIL = 3,          检测新版本失败
     }	TB_APP_UPDATE_RESULT;
     ***/
    TBAdapter::TBAdapterInstance()->TBCheckUpdateFinished(updateResult);
}
#pragma mark 购买 指定金额 物品结果回调
/**
 *	推币余额充足，购买成功
 *
 *	@param	order	订单号
 */
- (void)TBBuyGoodsDidSuccessWithOrder:(NSString *)order{
    TBAdapter::TBAdapterInstance()->TBBuyGoodsSuccessWithOrder(order.UTF8String);
}
/**
 *	推币余额充足，但是购买失败
 *
 *	@param	order	订单号
 *	@param	errorType	错误类型
 */
- (void)TBBuyGoodsDidFailedWithOrder:(NSString *)order resultCode:(TB_BUYGOODS_ERROR)errorType{
    /***
     typedef enum {
     kBuyGoodsBalanceNotEnough,  余额不足
     kBuyGoodsServerError,       服务器错误
     kBuyGoodsOrderEmpty,        订单号为空
     kBuyGoodsOtherError,        其他错误
     }TB_BUYGOODS_ERROR;
     ***/
    TBAdapter::TBAdapterInstance()->TBBuyGoodsFailed(order.UTF8String,errorType);
}
/**
 *	推币余额不足，进入充值页面（需要开发者手动查询购买结果）
 *
 *	@param	order	订单号
 */
- (void)TBBuyGoodsDidStartRechargeWithOrder:(NSString *)order{
    TBAdapter::TBAdapterInstance()->TBBuyGoodsDidEnterWebview(order.UTF8String);
}
/**
 *	取消支付（弹出选择时）
 *
 *	@param	order	订单号
 */
- (void)TBBuyGoodsDidCancelByUser:(NSString *)order{
    TBAdapter::TBAdapterInstance()->TBBuyGoodsDidCancelByUser(order.UTF8String);
}
#pragma mark 查询订单回调
/**
 *	查询订单成功（不等于订单充值成功）
 *
 *	@param	dict 结果字典
 */
- (void)TBCheckOrderSuccessWithResult:(NSDictionary *)dict{
    /***
     * order:订单号
     * amount:充值金额 （单位：分）
     * status:状态 （-1：未知错误 0：待支付  1：充值中  2：失败  3：成功）
     ***/
    NSString *order = [dict objectForKey:@"order"];
    int      status = [[dict objectForKey:@"status"] intValue];
    int      amount = [[dict objectForKey:@"amount"] intValue];
    TBAdapter::TBAdapterInstance()->TBCheckOrderResultHandle(order.UTF8String,status,amount);
}
/**
 *	查询订单失败（一般是网络不通）
 *
 *	@param	order	订单号
 */
- (void)TBCheckOrderDidFailed:(NSString *)order{
    TBAdapter::TBAdapterInstance()->TBCheckOrderFailed(order.UTF8String);
}

@end