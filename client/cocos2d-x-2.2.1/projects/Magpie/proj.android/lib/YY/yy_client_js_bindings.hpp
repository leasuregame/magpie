#ifndef __yy_client_js_bindings_h__
#define __yy_client_js_bindings_h__

#include "jsapi.h"
#include "jsfriendapi.h"


extern JSClass  *jsb_YYClient_class;
extern JSObject *jsb_YYClient_prototype;

JSBool js_yy_client_js_bindings_YYClient_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_yy_client_js_bindings_YYClient_finalize(JSContext *cx, JSObject *obj);
void js_register_yy_client_js_bindings_YYClient(JSContext *cx, JSObject *global);
void register_all_yy_client_js_bindings(JSContext* cx, JSObject* obj);
JSBool js_yy_client_js_bindings_YYClient_getTime(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_yy_client_js_bindings_YYClient_pay(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_yy_client_js_bindings_YYClient_enterGameServer(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_yy_client_js_bindings_YYClient_exitSDK(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_yy_client_js_bindings_YYClient_getInitResult(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_yy_client_js_bindings_YYClient_getLoginResult(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_yy_client_js_bindings_YYClient_getPayResult(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_yy_client_js_bindings_YYClient_login(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_yy_client_js_bindings_YYClient_getAccount(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_yy_client_js_bindings_YYClient_getSid(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_yy_client_js_bindings_YYClient_getUserName(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_yy_client_js_bindings_YYClient_YYClient(JSContext *cx, uint32_t argc, jsval *vp);
#endif

