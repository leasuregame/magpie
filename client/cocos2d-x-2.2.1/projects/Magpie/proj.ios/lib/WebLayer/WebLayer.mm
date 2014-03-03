//
//  WebLayer.m
//  Magpie
//
//  Created by lCeve on 13-12-20.
//
//

#include "WebLayer.h"
#include "WebLayerOC.h"

#define IPHONE5_HEIGHT 568
#define IPAD_HEIGHT 1024

#define IPHONE5_BOUNDS (CCRect(0, 0, 640, 1136))
#define IPAD_BOUNDS (CCRect(0, 0, 720, 960))
#define OTHER_BOUNDS (CCRect(40, 0, 720, 960))

WebLayer::WebLayer(const char * url, const CCRect rect)
{
    NSString * _url = [NSString stringWithUTF8String:url];
    
    CGRect bounds = [[UIScreen mainScreen] bounds];
    CCRect gameBounds = OTHER_BOUNDS;
    
    float x, y, width, height;
    
    if(bounds.size.height == IPHONE5_HEIGHT) {
        CCLOG("the dev is iPhone5");
        
        gameBounds = IPHONE5_BOUNDS;
    } else if(bounds.size.height == IPAD_HEIGHT) {
        CCLOG("the dev is iPad");
        
        gameBounds = IPAD_BOUNDS;
    } else {
        CCLOG("the dev is other");
        
        gameBounds = OTHER_BOUNDS;
    }
    
    x = (rect.origin.x - gameBounds.origin.x) * bounds.size.width / gameBounds.size.width;
    y = (gameBounds.size.height - (rect.origin.y - gameBounds.origin.y) - rect.size.height) * bounds.size.height / gameBounds.size.height;
    
    width = rect.size.width * bounds.size.width / (gameBounds.size.width - gameBounds.origin.x * 2);
    height = rect.size.height * bounds.size.height / gameBounds.size.height;

    _webLayerOC = [[WebLayerOC alloc] init:_url :CGRectMake(x, y, width, height)];
}

WebLayer::~WebLayer()
{
    [_webLayerOC release];
}

void WebLayer::close()
{
    [_webLayerOC close];
}

WebLayer * WebLayer::create(const char * url, const CCRect rect)
{
    return new WebLayer(url, rect);
}