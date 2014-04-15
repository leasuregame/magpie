/**
 *	消息、回调中转类
 */
@interface TBCallbackHandler : NSObject<TBPayDelegate,TBBuyGoodsProtocol,TBPlatformUpdateProtocol>
+ (TBCallbackHandler*)sharedHandler;
@end