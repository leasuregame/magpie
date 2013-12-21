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

//- (id) init :(const char *)url :(const CCRect *)rect;
//{
//    if ((self = [super init])) {
//        CCPoint point = rect->origin;
//        CCSize size = rect->size;
//        _uiView = [[UIView alloc] initWithFrame:CGRectMake(point.x, point.y, size.width, size.height)];
//        _uiWebView = [[UIWebView alloc] initWithFrame:CGRectMake(point.x, point.y, size.width, size.height)];
//        _url = [NSString stringWithUTF8String:url];
//        
//        [self load];
//    }
//    
//    return self;
//}

- (void)dealloc
{
    [_uiWebView release];
    [_uiView release];
    
    [super dealloc];
}

- (void) load
{
    [_uiWebView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString :_url]]];
    [_uiWebView setUserInteractionEnabled:NO];

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
