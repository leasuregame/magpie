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
@property uint64_t account;
@property long long time;
@property (strong) NSString *username;
@property bool isLogin;
@property (strong) NSString* passport;
@property uint64_t udbuid;
@property (strong) NSString *gameServer;  //厂商提供
@end
