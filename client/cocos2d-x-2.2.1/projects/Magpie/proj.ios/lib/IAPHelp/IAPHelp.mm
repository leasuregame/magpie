//
//  IAPHelp.cpp
//  Client-v1.0.0-e2.1.5
//
//  Created by lCeve on 13-11-25.
//
//

#include "IAPHelp.h"
#include "IAPHelpOC.h"

CCObject * IAPHelp::mTarget = NULL;
SEL_CallFuncO IAPHelp::mCallback = NULL;

void IAPHelp::buy(const char * productId, CCObject * target, SEL_CallFuncO callback)
{
    NSLog(@"IAPHelp buy");
    
    if (target)
    {
        target->retain();
    }
    
    if (mTarget)
    {
        mTarget->release();
    }
    
    mTarget = target;
    mCallback = callback;
    
    NSString * productIdStr = [NSString stringWithUTF8String:productId];
    
    NSLog(@"product id str %@", productIdStr);
    
    [[IAPHelpOC sharedInstance] buy:productIdStr];
}

void IAPHelp::executeCallback(PaymentState state, const char * product, const char * receipt, const char * msg)
{
    NSLog(@"IAPHelp executeCallback");
    
    if (mTarget && mCallback)
    {
        PaymentData * data = new PaymentData();
        
        data->state = state;
        data->product = product;
        data->receipt = receipt;
        data->msg = msg;
        
        (mTarget->*mCallback)((CCObject *)data);
        
        delete data;
    }
}