//
//  IAPHelpOC.m
//  Client-v1.0.0-e2.1.5
//
//  Created by lCeve on 13-11-26.
//
//

#import "IAPHelpOC.h"

@implementation IAPHelpOC

+ (id) sharedInstance
{
    static dispatch_once_t pred = 0;
    __strong static id _sharedObject = nil;
    dispatch_once(&pred, ^{
        _sharedObject = [[self alloc] init]; // or some other init method
    });
    return _sharedObject;
}

- (id) init
{
    NSLog(@"IAPHelpOC init");
    
    if ((self = [super init])) {
        //监听购买结果
        
        NSLog(@"-----监听购买结果-----");
        
        [[SKPaymentQueue defaultQueue] addTransactionObserver:self];
    }
    
    return self;
}

- (void) buy : (NSString *) productId
{
    NSLog(@"IAPHelpOC buy");
    
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
    NSLog(@"IAPHelpOC getProductInfo");
    
    NSSet * set = [NSSet setWithArray:@[productId]];
    SKProductsRequest * request = [[SKProductsRequest alloc] initWithProductIdentifiers:set];
    request.delegate = self;
    [request start];
}

- (void) productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response
{
    NSLog(@"IAPHelpOC productsRequest");
    
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

- (void) paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transactions
{
    NSLog(@"IAPHelpOC paymentQueue");
    
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

- (void) completeTransaction:(SKPaymentTransaction *)transaction
{
    NSLog(@"IAPHelpOC completeTransaction");
    
    NSString * productStr = transaction.payment.productIdentifier;
    NSString * receiptStr = [[NSString alloc] initWithData:transaction.transactionReceipt encoding:NSUTF8StringEncoding];
    
//    NSLog(@"---------------------------------------------------------------------");
//    NSLog(@"transactionIdentifier = %@", productStr);
//    NSLog(@"transactionReceipt = %@", receiptStr);
//    NSLog(@"---------------------------------------------------------------------");
    
    if ([productStr length] > 0)
    {
        NSLog(@"-----购买成功-----");
        
        const char * product = [productStr UTF8String];
        const char * receipt = [receiptStr UTF8String];
        
        IAPHelp::executeCallback(PaymentPurchased, product, receipt, "购买成功");
    }
    else
    {
        NSLog(@"-----购买成功，但商品ID为空，未知错误-----");
        
        IAPHelp::executeCallback(PaymentFailed, "", "", "购买失败");
    }
    
    // 从支付队列删除改支付
    NSLog(@"-----删除支付-----");
    [[SKPaymentQueue defaultQueue] finishTransaction: transaction];
}

- (void) failedTransaction:(SKPaymentTransaction *)transaction
{
    NSLog(@"IAPHelpOC failedTransaction");
    
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
    NSLog(@"-----删除支付-----");
    [[SKPaymentQueue defaultQueue] finishTransaction: transaction];
}

- (void) restoreTransaction:(SKPaymentTransaction *)transaction
{
    NSLog(@"IAPHelpOC restoreTransaction");
    NSLog(@"-----已经购买过此商品-----");
    
    IAPHelp::executeCallback(PaymentRestored, "", "", "已经购买过此商品");
    
    // 从支付队列删除改支付
    NSLog(@"-----删除支付-----");
    [[SKPaymentQueue defaultQueue] finishTransaction: transaction];
}

- (void) dealloc
{
    NSLog(@"IAPHelpOC dealloc");
    
    //解除购买监听
    
    NSLog(@"-----解除购买监听-----");
    
    [[SKPaymentQueue defaultQueue] removeTransactionObserver:self];
    [super dealloc];
}

@end
