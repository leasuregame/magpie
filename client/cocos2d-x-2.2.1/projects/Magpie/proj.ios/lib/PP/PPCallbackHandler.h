//
//  PPCallbackHandler.h
//  Magpie
//
//  Created by lCeve on 14-4-8.
//
//

/**
 *	消息、回调中转类
 */
@interface PPCallbackHandler : NSObject<PPAppPlatformKitDelegate>
+ (PPCallbackHandler *)sharedHandler;
@end