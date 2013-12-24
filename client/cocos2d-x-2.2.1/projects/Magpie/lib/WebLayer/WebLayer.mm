//
//  WebLayer.m
//  Magpie
//
//  Created by lCeve on 13-12-20.
//
//

#include "WebLayer.h"
#include "WebLayerOC.h"

WebLayer::WebLayer(const char * url, const CCRect rect)
{
    NSString * _url = [NSString stringWithUTF8String:url];
    
    CCPoint point = rect.origin;
    CCSize size = rect.size;
    
    _webLayerOC = [[WebLayerOC alloc] init:_url :CGRectMake(point.x, point.y, size.width, size.height)];
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