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
        
        _uiWebView = [[UIWebView alloc] initWithFrame:CGRectMake(0, 0, rect.size.width, rect.size.height)];
        [_uiWebView setBackgroundColor:[UIColor clearColor]];
        [_uiWebView setOpaque:NO];
        _uiWebView.delegate = self;
        
        [_uiView addSubview:_uiWebView];
        [[EAGLView sharedEGLView] addSubview:_uiView];
        
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
