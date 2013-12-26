//
//  WebLayerOC.m
//  Magpie
//
//  Created by lCeve on 13-12-20.
//
//

#import "WebLayerOC.h"
#import "EAGLView.h"

@implementation WebLayerOC

- (id) init :(NSString *)url :(CGRect)rect;
{
    if ((self = [super init])) {
        _uiView = [[UIView alloc] initWithFrame:rect];
        _uiWebView = [[UIWebView alloc] initWithFrame:rect];
        _url = url;
        
        [self load];
    }
    
    return self;
}

- (void) dealloc
{
    [_uiWebView release];
    [_uiView release];
    
    [super dealloc];
}

- (void) load
{
    [_uiWebView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString :_url]]];

    [_uiView addSubview:_uiWebView];

    [[EAGLView sharedEGLView] addSubview:_uiView];
}

- (void) close
{
    [_uiWebView removeFromSuperview];
    [_uiView removeFromSuperview];
}

- (void) _uiWebView :(UIWebView *)thisWebView didFailLoadWithError :(NSError *)error
{
    if (error != NULL && [error code] != -999) {
        NSLog(@"uiWebView load fail");
        
        [self load];
    }
}

@end
