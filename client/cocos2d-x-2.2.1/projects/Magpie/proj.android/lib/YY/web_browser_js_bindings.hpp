#ifndef __web_browser_js_bindings_h__
#define __web_browser_js_bindings_h__

#include "jsapi.h"
#include "jsfriendapi.h"


extern JSClass  *jsb_WebBrowser_class;
extern JSObject *jsb_WebBrowser_prototype;

JSBool js_web_browser_js_bindings_WebBrowser_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_web_browser_js_bindings_WebBrowser_finalize(JSContext *cx, JSObject *obj);
void js_register_web_browser_js_bindings_WebBrowser(JSContext *cx, JSObject *global);
void register_all_web_browser_js_bindings(JSContext* cx, JSObject* obj);
JSBool js_web_browser_js_bindings_WebBrowser_openWebView(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_web_browser_js_bindings_WebBrowser_WebBrowser(JSContext *cx, uint32_t argc, jsval *vp);
#endif

