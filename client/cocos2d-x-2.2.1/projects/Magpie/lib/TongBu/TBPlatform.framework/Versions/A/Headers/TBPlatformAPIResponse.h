//
//  TBPlatformAPIResponse.h
//  TBPlatform
//
//  Created by OXH on 13-4-23.
//
//

#import <Foundation/Foundation.h>
/**
 *	离开平台时userinfo中的离开类型Key
 */
#define TBLeavedPlatformTypeKey  @"_key_typeOfLeave_"
/**
 *	离开平台时userinfo中的充值订单Key（从充值页面离开时才有）
 */
#define TBLeavedPlatformOrderKey @"_key_orderOfLeave_"


/**
 *	@brief	登录状态
 */
typedef enum _TB_LOGIN_STATE
{
	TB_LOGIN_STATE_NOT_LOGIN = 0,  	//未登录		
	TB_LOGIN_STATE_NORMAL_LOGIN,     //普通帐号登陆
}TB_LOGIN_STATE;

/**
 *	离开平台的类型
 */
typedef enum _TB_LeavedPlatform_Type_
{
    //离开未知平台（预留状态）
    TBPlatformLeavedDefault,
    //离开注册、登录页面
    TBPlatformLeavedFromLogin,
    //包括个人中心、游戏推荐、论坛
    TBPlatformLeavedFromUserCenter,
    //离开充值页（包括成功、失败）
    TBPlatformLeavedFromUserPay,    
}TBPlatformLeavedType;

#pragma mark - TBPlatformUserInfo

/**
 *	@brief	用户的基础信息（登录后获得）
 */
@interface TBPlatformUserInfo : NSObject
@property (nonatomic, copy) NSString *sessionID;		// 登录会话id,用于登录验证
@property (nonatomic, copy) NSString *userID;           // 用户id
@property (nonatomic, copy) NSString *nickName;         // 用户昵称
@end


