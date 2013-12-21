//
//  WebLayerOC.h
//  Magpie
//
//  Created by lCeve on 13-12-20.
//
//

#ifndef __WEB_LAYER_OC__
#define __WEB_LAYER_OC__

#include "cocos2d.h"
#import <CoreLocation/CoreLocation.h>
#import <UIKit/UIKit.h>

USING_NS_CC;

@interface WebLayerOC : NSObject<UIWebViewDelegate, UIAlertViewDelegate>
{
    UIView * _uiView;
    UIWebView * _uiWebView;
    NSString * _url;
}

//- (id) init :(const char *)url :(const CCRect *)rect;
- (void) load;
- (void) close;

@end

#endif /* defined(__WEB_LAYER_OC__) */