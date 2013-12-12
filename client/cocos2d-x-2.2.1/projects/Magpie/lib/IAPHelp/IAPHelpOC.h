//
//  IAPHelpOC.h
//  Client-v1.0.0-e2.1.5
//
//  Created by lCeve on 13-11-26.
//
//

#ifndef __IAP_HELP_OC__
#define __IAP_HELP_OC__

#import <Foundation/Foundation.h>
#import <StoreKit/StoreKit.h>
#include "IAPHelp.h"

@interface IAPHelpOC : NSObject<SKProductsRequestDelegate, SKPaymentTransactionObserver>

+ (id) sharedInstance;

/*
 购买某个商品，传入商品ID
 若设备允许购买进入商品查询过程
 若设备不允许返回错误信息
 事先在itunesConnect中添加好的，已存在的付费项目。否则查询会失败。
 */
- (void) buy : (NSString *) productId;

/*
 查询商品类表
 完成时回调 productsRequest
 */
- (void) getProductInfo : (NSString *) productId;

/*
 购买操作有结果时触发该回调函数
 */
- (void) paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transactions;

/*
 购买完成时调用
 */
- (void) completeTransaction: (SKPaymentTransaction *)transaction;

/*
 购买失败时调用
 */
- (void) failedTransaction: (SKPaymentTransaction *)transaction;

/*
 已经购买过该商品调用
 */
- (void) restoreTransaction: (SKPaymentTransaction *)transaction;

@end

#endif /* defined(__IAP_HELP_OC__) */