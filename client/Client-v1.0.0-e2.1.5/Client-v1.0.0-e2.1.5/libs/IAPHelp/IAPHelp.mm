//
//  IAPHelp.cpp
//  Client-v1.0.0-e2.1.5
//
//  Created by lCeve on 13-11-25.
//
//

#include "IAPHelp.h"

CCObject IAPHelp::*target = NULL;
SEL_CallFuncO IAPHelp::*callback = NULL;

bool IAPHelp::canBuy()
{
}

void IAPHelp::buy(const char * productId, CCObject * target, SEL_CallFuncO callback)
{
    if(IAPHelp::canBuy())
    {
        NSLog(@"-----允许购买进入购买流程-----");
        
//        NSString * key = [NSString stringWithUTF8String:appKey];
//        NSSet * set = [NSSet setWithArray:@[@"ProductId"]];
//        SKProductsRequest * request = [[SKProductsRequest alloc] initWithProductIdentifiers:set];
//        request.delegate = self;
//        [request start];
    }
    else
    {
        NSLog(@"-----用户禁止内付费购买-----");

        IAPHelp::executeCallback(PaymentLock, "", "", "用户禁止内付费购买");
    }
}

void IAPHelp::executeCallback(PaymentState state, const char * product, const char * receipt, const char * msg)
{
    if (target && callback)
    {
        PaymentData * data = new PaymentData();
        
        data->state = state;
        data->product = product;
        data->receipt = receipt;
        data->msg = msg;
        
        (target->*callback)((CCObject *)data);
    }
}