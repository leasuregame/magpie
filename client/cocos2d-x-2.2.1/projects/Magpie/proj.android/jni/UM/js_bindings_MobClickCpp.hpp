#ifndef __js_bindings_MobClickCpp_h__
#define __js_bindings_MobClickCpp_h__

#include "jsapi.h"
#include "jsfriendapi.h"


extern JSClass  *jsb_MobClickCpp_class;
extern JSObject *jsb_MobClickCpp_prototype;

JSBool js_js_bindings_MobClickCpp_MobClickCpp_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_js_bindings_MobClickCpp_MobClickCpp_finalize(JSContext *cx, JSObject *obj);
void js_register_js_bindings_MobClickCpp_MobClickCpp(JSContext *cx, JSObject *global);
void register_all_js_bindings_MobClickCpp(JSContext* cx, JSObject* obj);
JSBool js_js_bindings_MobClickCpp_MobClickCpp_applicationDidEnterBackground(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_MobClickCpp_MobClickCpp_applicationWillEnterForeground(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_MobClickCpp_MobClickCpp_beginEventWithLabel(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_MobClickCpp_MobClickCpp_setCrashReportEnabled(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_MobClickCpp_MobClickCpp_checkUpdate(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_MobClickCpp_MobClickCpp_beginLogPageView(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_MobClickCpp_MobClickCpp_setAppVersion(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_MobClickCpp_MobClickCpp_getConfigParams(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_MobClickCpp_MobClickCpp_endEventWithLabel(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_MobClickCpp_MobClickCpp_endEvent(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_MobClickCpp_MobClickCpp_startWithAppkey(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_MobClickCpp_MobClickCpp_endLogPageView(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_MobClickCpp_MobClickCpp_setLogEnabled(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_MobClickCpp_MobClickCpp_end(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_MobClickCpp_MobClickCpp_updateOnlineConfig(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_MobClickCpp_MobClickCpp_event(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_MobClickCpp_MobClickCpp_beginEvent(JSContext *cx, uint32_t argc, jsval *vp);
#endif

