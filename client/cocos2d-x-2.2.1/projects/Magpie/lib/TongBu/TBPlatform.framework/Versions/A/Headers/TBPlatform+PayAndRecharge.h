//
//  TBPlatform+PayAndRecharge.h
//  TBPlatform
//
//  Created by OXH on 13-4-26.
//
//

#import "TBPlatform.h"
@protocol TBBuyGoodsProtocol;
@interface TBPlatform (PayAndRecharge)
#pragma mark -
#pragma mark PayAndRecharge Interface

/**
 @brief 进行虚拟币充值或商品购买（需登录，同步后台记录充值帐号记录）
 @param orderSerial     合作商订单号，必须保证唯一，双方对帐的唯一标记
 @param needPayRMB      需要支付的金额，单位：元（大于0，否则进入自选金额界面）
 @param payDescription 支付描述，发送支付成功通知时，返回给开发者
 @param delegate         回调对象，见TBBuyGoodsProtocol协议
 @result 错误码
 */
- (int)TBUniPayForCoin:(NSString*)orderSerial
            needPayRMB:(int)needPayRMB
        payDescription:(NSString*)payDescription
              delegate:(id<TBBuyGoodsProtocol>)buyDelegate;

/**
 @brief 进行充值。该接口直接进入Web页充值，无回调，开发者可以使用TBCheckPaySuccess:delegate:接口进行订单查询
 @param orderSerial     合作商订单号，必须保证唯一，双方对帐的唯一标记
 @param payDescription  支付描述，发送支付成功通知时，返回给开发者
 @result 错误码
 */
- (int)TBUniPayForCoin:(NSString*)orderSerial
        payDescription:(NSString*)payDescription;
/**
 @brief 查询支付是成功
 @param strCooOrderSerial	支付订单号
 @param delegate	    	回调对象，回调接口参见 TBPayDelegate
 @result 错误码
 */
- (int)TBCheckPaySuccess:(NSString*)strCooOrderSerial delegate:(id)delegate;
@end


#pragma mark - Protocol


/**
 @brief 购买相关回调，通知购买结果
 */
@protocol TBBuyGoodsProtocol <NSObject>
typedef enum {
    kBuyGoodsBalanceNotEnough,  /*余额不足*/
    kBuyGoodsServerError,       /*服务器错误*/
    kBuyGoodsOrderEmpty,        /*订单号为空*/
    kBuyGoodsNetworkingError,   /*网络不流畅（有可能已经购买成功但客户端已超时）*/
    kBuyGoodsOtherError,        /*其他错误*/
}TB_BUYGOODS_ERROR;
@optional
/**
 *	@brief	使用推币直接购买商品成功
 *
 *	@param 	order 	订单号
 */
- (void)TBBuyGoodsDidSuccessWithOrder:(NSString*)order;
/**
 *	@brief	使用推币直接购买商品失败
 *
 *	@param 	order 	订单号
 *	@param 	errorType  错误类型，见TB_BUYGOODS_ERROR
 */
- (void)TBBuyGoodsDidFailedWithOrder:(NSString *)order resultCode:(TB_BUYGOODS_ERROR)errorType;
/**
 *	@brief	推币余额不足，进入充值页面（开发者需要手动查询订单以获取充值购买结果）
 *
 *	@param 	order 	订单号
 */
- (void)TBBuyGoodsDidStartRechargeWithOrder:(NSString*)order;
/**
 *	@brief  跳提示框时，用户取消
 *
 *	@param	order	订单号
 */
- (void)TBBuyGoodsDidCancelByUser:(NSString *)order;
@end



/**
 @brief 手动查询充值结果回调协议
 */
@protocol TBPayDelegate <NSObject>

/**
 *	@brief	查询充值结果
 *
 *	@param 	dict 	结果信息
 *                  order:订单号
 *                  amount:充值金额 （单位：分）
 *                  status:状态 （-1：其它错误（包括选定金额后未进入第三方充值页或服务器返回异常）
                                  0：待支付  1：充值中  2：失败  3：成功）
 */
- (void)TBCheckOrderSuccessWithResult:(NSDictionary *)dict;
/**
 *  @brief 查询订单失败
 */
- (void)TBCheckOrderDidFailed:(NSString*)order;

@end
