//
//  WebLayerOC.h
//  Magpie
//
//  Created by lCeve on 13-12-20.
//
//

#ifndef __WEB_LAYER_OC__
#define __WEB_LAYER_OC__

#import <CoreLocation/CoreLocation.h>
#import <UIKit/UIKit.h>

@interface WebLayerOC : NSObject<UIWebViewDelegate>
{
    UIView * _uiView;
    UIWebView * _uiWebView;
    NSString * _url;
}

- (id) init :(NSString * )url :(CGRect)rect;
- (void) load;
- (void) close;

@end

#endif /* defined(__WEB_LAYER_OC__) */