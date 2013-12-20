//
//  WebLayer.m
//  Magpie
//
//  Created by lCeve on 13-12-20.
//
//

#include "WebLayer.h"

WebLayer::WebLayer(const char * url, const CCRect * rect)
{
//    _webLayerOC = [[WebLayerOC alloc] init:url :rect];
}

WebLayer::~WebLayer()
{
    [_webLayerOC release];
}

void WebLayer::close()
{
    [_webLayerOC close];
}

WebLayer * WebLayer::create(const char * url, const CCRect * rect)
{
    return new WebLayer(url, rect);
}