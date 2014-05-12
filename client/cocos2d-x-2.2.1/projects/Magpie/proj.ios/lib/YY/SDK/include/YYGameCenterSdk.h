//
//  yygamecentersdk.h
//  yygamecentersdk
//
//  Created by fantasy on 14-3-3.
//  @email zhouhaosheng@yy.com
//  Copyright (c) 2014年 fantasy. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YYGameCenterSdkDelegate.h"
#import "YYGUser.h"

@interface YYGameCenterSdk : NSObject
//实例化SDK
+ (YYGameCenterSdk *) defaultSdk;
//初始化SDK参数
- (void) initWithAppid:(NSString *) appid delegate:(id) delegate isDebug:(BOOL)isDebug;
//登陆
- (void) login;
//注册
- (void) register;
//个性密码
- (void) modifyPassword;
//注销
- (void) logout;
//判断是否登陆
- (bool) isLogin;
//获取登陆用户信息
- (YYGUser *) getUser;
//玩家选择区服 (厂商在玩家选择完区服, 进入游戏后调用)
//serverName -- 服务器代号
- (void) selectGameServer:(NSString *) serverName;
//玩家创建角色 (厂商在玩家创建完角色后调用)
//roleName -- 角色名称
//defaultRoleLevel -- 默认的玩家等级
- (void) createUserRole:(NSString *) roleName defaultRoleLevel:(int) defaultRoleLevel;
//玩家角色升级 (厂商在玩家角色升级的时候调用)
//roleName -- 角色名称或代号
//roleLevel --  玩家升级后的等级
- (void) updateUserRole:(NSString *) roleName roleLever:(int)roleLevel;
//玩家充值 count单位是人民币 (厂商在玩家appstore充值到游戏成功之后调用)
//serverName -- 服务器代号
//count --充值金额
- (void) gameConsumeOnServer:(NSString *) serverName count:(double) count;


//获取SDK版本号
+ (NSString *) getSdkVersion;
@end
