//
//  IAPHelp.cpp
//  Client-v1.0.0-e2.1.5
//
//  Created by lCeve on 13-11-25.
//
//

#include "IAPHelp.h"

CCObject * IAPHelp::target = NULL;
SEL_CallFuncO IAPHelp::callback = NULL;

void IAPHelp::buy(const char * productId, CCObject * target, SEL_CallFuncO callback)
{
    IAPHelp::target = target;
    IAPHelp::callback = callback;
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