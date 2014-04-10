//
//  PPAdapter.h
//  Magpie
//
//  Created by lCeve on 14-4-4.
//
//

#ifndef __PP_ADAPTER__
#define __PP_ADAPTER__

#include <iostream>

class PPAdapter
{
public:
    PPAdapter();
    virtual ~PPAdapter();
    
    static PPAdapter * PPAdapterInstance();
    
    /**
     * @brief     弹出PP登录页面
     * @return    无返回
     */
    void PPShowLogin();
    
    /**
     * @brief     弹出PP中心页面
     * @return    无返回
     */
    void PPShowCenter();
    
    /**
     * @brief     兑换道具
     * @noti      只有余额大于道具金额时候才有客户端回调。余额不足的情况取决与paramIsLongComet参数，paramIsLongComet = YES，则为充值兑换。回调给服务端，paramIsLongComet = NO ，则只是打开充值界面
     * @param     INPUT paramPrice      商品价格，价格必须为大于等于1的int类型
     * @param     INPUT paramBillNo     商品订单号，订单号长度请勿超过30位，参有特殊符号
     * @param     INPUT paramBillTitle  商品名称
     * @param     INPUT paramRoleId     角色id，回传参数若无请填0
     * @param     INPUT paramZoneId     开发者中心后台配置的分区id，若无请填写0
     * @return    无返回
     */
    void PPExchangeGoods(int paramPrice, const char * paramBillNo, const char * paramBillTitle, const char * paramRoleId, int paramZoneId);
    
    /**
     * @brief     设置关闭充值提示语
     * @param     INPUT paramCloseRechargeAlertMessage      关闭充值时弹窗的提示语
     * @return    无返回
     */
    void PPSetCloseRechargeAlertMessage(const char * paramCloseRechargeAlertMessage);
    
    /**
     * @brief     充值状态设置
     * @param     INPUT paramIsOpenRecharge      YES为开启，NO为关闭。
     * @return    无返回
     */
    void PPSetIsOpenRecharge(bool paramIsOpenRecharge);
    
    /**
     * @brief     注销用户，清除自动登录状态
     * @return    无返回
     */
    void PPLogout();
    
    /**
     * @brief     设定充值页面默认充值数额
     * @note      paramAmount 大于等于1的整数
     * @param     INPUT paramAmount      充值金额
     * @return    无返回
     */
    void PPSetRechargeAmount(int paramAmount);
    
    /**
     * @brief     获取用户名
     * @return    返回当前登录用户名
     */
    const char * PPCurrentUserName();
    
    /**
     * @brief     获取用户id
     * @return    返回当前登录用户id
     */
    int PPCurrentUserId();
    
    /**
     * @brief     设定打印SDK日志
     * @note      发布时请务必改为NO
     * @param     INPUT paramIsNSlogDatad     YES为开启，NO为关闭
     * @return    无返回
     */
    void PPSetIsNSlogData(bool paramIsNSlogData);
    
    /**
     * @brief     设置该游戏的AppKey和AppId。从开发者中心游戏列表获取
     * @param     INPUT paramAppId     游戏Id
     * @param     INPUT paramAppKey    游戏Key
     * @return    无返回
     */
    void PPInit(int paramAppId, const char * paramAppKey);
    
    /**
     * @brief     设置注销用户后是否弹出的登录页面
     * @param     INPUT paramIsLogOutPushLoginView    YES为自动弹出登 页面，NO为不弹出登录页面
     * @return    无返回
     */
    void PPSetIsLogOutPushLoginView(bool paramIsLogOutPushLoginView);
    
    /**
     * @brief     设置游戏客户端与游戏服务端链接方式【如果游戏服务端能主动与游戏客户端交互。例如发放道具则为长连接。此处设置影响充值并兑换的方式】
     * @param     INPUT paramIsLongComet    YES 游戏通信方式为长链接，NO 游戏通信方式为长链接
     * @return    无返回
     */
    void PPSetIsLongComet(bool paramIsLongComet);
    
    /**
     * @brief     获取帐号的安全级别[登录验证成功时必须调用]
     * @return    无返回
     */
    void PPGetUserInfoSecurity();
    
    /**
     * @brief     SDK检查游戏版本更新
     * @return    无返回
     */
    void PPCheckGameUpdate();
    
    /**
     * @brief     设置SDK是否允许竖立设备Home键在下方向
     * @param     INPUT paramDeviceOrientationPortrait: YES 支持 ，NO 不支持， 默认为YES
     * @return    无返回
     */
    void PPSetIsDeviceOrientationPortrait(bool paramDeviceOrientationPortrait);
    
    /**
     * @brief     设置SDK是否允许竖立设备Home键在上方向
     * @param     INPUT paramDeviceOrientationPortraitUpsideDown: YES 支持 ，NO 不支持， 默认为YES
     * @return    无返回
     */
    void PPSetIsDeviceOrientationPortraitUpsideDown(bool paramDeviceOrientationPortraitUpsideDown);
    
    /**
     * @brief     设置SDK是否允许竖立设备Home键在左方向
     * @param     INPUT paramDeviceOrientationLandscapeLeft: YES 支持 ，NO 不支持， 默认为YES
     * @return    无返回
     */
    void PPSetIsDeviceOrientationLandscapeLeft(bool paramDeviceOrientationLandscapeLeft);
    
    /**
     * @brief     设置SDK是否允许竖立设备Home键在右方向
     * @param     INPUT paramDeviceOrientationLandscapeRight: YES 支持 ，NO 不支持， 默认为YES
     * @return    无返回
     */
    void PPSetIsDeviceOrientationLandscapeRight(bool paramDeviceOrientationLandscapeRight);
    

/******************************************************************************
 *
 *	Objective-C回调中调回C++同名函数
 *
 *****************************************************************************/
    /**
     * @brief   余额大于所购买道具
     * @param   INPUT   paramPPPayResultCode       接口返回的结果编码
     * @return  无返回
     */
    void PPPayResultCallBack(int paramPPPayResultCode);
    
    /**
     * @brief   验证更新成功后
     * @noti    分别在非强制更新点击取消更新和暂无更新时触发回调用于通知弹出登录界面
     * @return  无返回
     */
    void PPVerifyingUpdatePassCallBack();
    
    /**
     * @brief   登录成功回调【任其一种验证即可】
     * @param   INPUT   paramStrToKenKey       字符串token
     * @return  无返回
     */
    void PPLoginStrCallBack(const char * paramStrToKenKey);
    
    /**
     * @brief   关闭Web页面后的回调
     * @param   INPUT   paramPPWebViewCode    接口返回的页面编码
     * @return  无返回
     */
    void PPCloseWebViewCallBack(int paramPPWebViewCode);
    
    /**
     * @brief   关闭SDK客户端页面后的回调
     * @param   INPUT   paramPPPageCode       接口返回的页面编码
     * @return  无返回
     */
    void PPClosePageViewCallBack(int paramPPPageCode);
    
    /**
     * @brief   注销后的回调
     * @return  无返回
     */
    void PPLogOffCallBack();
};

#endif /* defined(__PP_ADAPTER__) */
