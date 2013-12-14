//
//  TBPlatform+Login.h
//  TBPlatform
//
//  Created by OXH on 13-4-23.
//
//

#import "TBPlatformBase.h"

@interface TBPlatform (Login)

/**
 @brief 判断是否已经登录平台
 */
- (BOOL)isLogined;

/**
 @brief 是否配置了自动登录
 */
//- (BOOL)isAutoLogin;

/**
 @brief 注册界面入口
 @param nFlag 标识（按位标识）预留，默认为0
 @result 错误码
 */
- (int)TBRegister:(int) nFlag;
/**
 @brief 登录平台,进入登录或者注册界面入口
 @param nFlag 标识（按位标识）预留，默认为0
 @result 错误码
 */
- (int)TBLogin:(int) nFlag;

/**
 @brief 获取当前登陆帐户的状态
 @result 登录帐户状态
 */
- (TB_LOGIN_STATE)getCurrentLoginState;


/**
 @brief 注销
 @param nFlag 标识（按位标识）0,表示注销但保存本地信息；1，表示注销，并清除自动登录
 @result 错误码
 */
- (int)TBLogout:(int) nFlag;

/**
 @brief 切换帐号（logout+login），会注销当前登录的帐号。
 */
- (void)TBSwitchAccount;



#pragma mark -
/**
 @brief 获取本次登录的sessionId，需要登录后才能获取
 */
- (NSString *)sessionId;


/**
 @brief 获取登录后的昵称
 */
- (NSString *)nickName;

/**
 *	@brief	获取用户ID（唯一标识）
 *
 */
- (NSString *)userID;

/**
 @brief 获取登录帐户的信息
 @result 当前登录帐户的信息，包含用户ID，昵称等。
 @note 该接口在登录后立即返回
 */
- (TBPlatformUserInfo *)TBGetMyInfo;


- (NSString *)accountStr;
@end
