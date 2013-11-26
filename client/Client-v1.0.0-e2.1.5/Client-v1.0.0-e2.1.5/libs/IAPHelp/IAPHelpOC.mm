//
//  IAPHelpOC.m
//  Client-v1.0.0-e2.1.5
//
//  Created by lCeve on 13-11-26.
//
//

#import "IAPHelpOC.h"

@implementation IAPHelpOC

- (void) buy : (NSString *) productId
{
    if([SKPaymentQueue canMakePayments])
    {
        NSLog(@"-----允许购买进入购买流程-----");
        [self getProductInfo:productId];
    }
    else
    {
        NSLog(@"-----用户禁止内付费购买-----");
        IAPHelp::executeCallback(PaymentLock, "", "", "用户禁止内付费购买");
    }
}

- (void) getProductInfo : (NSString *) productId
{
    NSSet * set = [NSSet setWithArray:@[productId]];
    SKProductsRequest * request = [[SKProductsRequest alloc] initWithProductIdentifiers:set];
    request.delegate = self;
    [request start];
}

- (void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response
{
    NSArray *myProduct = response.products;
    
    if (myProduct.count == 0)
    {
        NSLog(@"-----无法获取物品信息购买失败-----");
        IAPHelp::executeCallback(PaymentFailed, "", "", "无法获取物品信息购买失败");
        return;
    }
    
    SKPayment * payment = [SKPayment paymentWithProduct:myProduct[0]];
    [[SKPaymentQueue defaultQueue] addPayment:payment];
}

- (void)paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transactions
{
    for (SKPaymentTransaction *transaction in transactions)
    {
        switch (transaction.transactionState)
        {
            case SKPaymentTransactionStatePurchased:    //完成购买
                [self completeTransaction:transaction];
                break;
            case SKPaymentTransactionStateFailed:       //购买失败
                [self failedTransaction:transaction];
                break;
            case SKPaymentTransactionStateRestored:     //已经购买过此商品
                [self restoreTransaction:transaction];
                break;
            case SKPaymentTransactionStatePurchasing:   //正在购买
                NSLog(@"-----正在购买-----");
                IAPHelp::executeCallback(PaymentPurchasing, "", "", "正在购买");
                break;
            default:
                NSLog(@"-----未知情况-----");
                break;
        }
    }
    
}

- (void)completeTransaction:(SKPaymentTransaction *)transaction
{
    NSString * productStr = transaction.payment.productIdentifier;
    NSString * receiptStr = [transaction.transactionReceipt base64EncodedString];
    
    NSLog(@"---------------------------------------------------------------------");
    NSLog(@"transactionIdentifier = %@", productStr);
    NSLog(@"transactionReceipt = %@", receiptStr);
    NSLog(@"---------------------------------------------------------------------");
    
    if ([productStr length] > 0)
    {
        NSLog(@"-----购买成功-----");
        
        const char * product = [productStr UTF8String];
        const char * receipt = [receiptStr UTF8String];
        
        IAPHelp::executeCallback(PaymentPurchased, product, receipt, "购买成功");
    }
    
    // 从支付队列删除改支付
    [[SKPaymentQueue defaultQueue] finishTransaction: transaction];
}

- (void)failedTransaction:(SKPaymentTransaction *)transaction
{
    if(transaction.error.code != SKErrorPaymentCancelled)
    {
        NSLog(@"-----购买失败-----");
        
        IAPHelp::executeCallback(PaymentFailed, "", "", "购买失败");
    }
    else
    {
        NSLog(@"-----用户取消交易-----");
        
        IAPHelp::executeCallback(PaymentFailed, "", "", "用户取消交易");
    }
    
    // 从支付队列删除改支付
    [[SKPaymentQueue defaultQueue] finishTransaction: transaction];
}

- (void)restoreTransaction:(SKPaymentTransaction *)transaction
{
    NSLog(@"-----已经购买过此商品-----");
    
    IAPHelp::executeCallback(PaymentRestored, "", "", "已经购买过此商品");
    
    // 从支付队列删除改支付
    [[SKPaymentQueue defaultQueue] finishTransaction: transaction];
}

@end
