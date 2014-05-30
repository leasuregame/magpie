//
//  YYCallbackHandler.h
//  Magpie
//
//  Created by lCeve on 14-4-8.
//
//

/**
 *	消息、回调中转类
 */
@interface YYCallbackHandler : NSObject<YYGameCenterSdkDelegate>
+ (YYCallbackHandler *)sharedHandler;
@end
