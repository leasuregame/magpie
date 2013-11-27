//
//  IAPHelp.h
//  Client-v1.0.0-e2.1.5
//
//  Created by lCeve on 13-11-25.
//
//

#ifndef __IAP_HELP__
#define __IAP_HELP__

#include "cocos2d.h"
#include <string>

USING_NS_CC;
using namespace std;


/*
 付费处理状态
 PaymentPurchased 完成购买
 PaymentFailed 购买失败
 PaymentRestored 已经购买过此商品
 PaymentPurchasing 正在购买
 */
typedef enum PaymentStateEnum {
    PaymentLock = 0,
    PaymentPurchased,
    PaymentFailed,
    PaymentRestored,
    PaymentPurchasing
} PaymentState;


/*
 购买后返回JS数据
 state 购买状态
 product 商品识别码
 receipt 购买凭证
 msg 提示信息
 */
typedef struct PaymentDataStruct {
    PaymentState state;
    const char * product;
    const char * receipt;
    const char * msg;
} PaymentData;


class IAPHelp
{
public:
    static CCObject * target;
    static SEL_CallFuncO callback;
    
    static void buy(const char * productId, CCObject * target, SEL_CallFuncO callback);
    static void executeCallback(PaymentState state, const char * product, const char * receipt, const char * msg);
};

#endif /* defined(__IAP_HELP__) */
