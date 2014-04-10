//
//  YYGUser.h
//  yygamecentersdk
//
//  Created by fantasy on 14-4-2.
//  @email zhouhaosheng@yy.com
//  Copyright (c) 2014年 fantasy. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface YYGUser : NSObject
@property (strong) NSString *sid;
@property long account;
@property long long time;
@property (strong) NSString *username;
@property bool isLogin;
@end
