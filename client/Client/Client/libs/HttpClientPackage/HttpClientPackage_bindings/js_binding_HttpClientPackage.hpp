#ifndef __js_binding_HttpClientPackage_h__
#define __js_binding_HttpClientPackage_h__

#include "jsapi.h"
#include "jsfriendapi.h"


extern JSClass  *jsb_HttpClientPackage_class;
extern JSObject *jsb_HttpClientPackage_prototype;

JSBool js_js_binding_HttpClientPackage_HttpClientPackage_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_js_binding_HttpClientPackage_HttpClientPackage_finalize(JSContext *cx, JSObject *obj);
void js_register_js_binding_HttpClientPackage_HttpClientPackage(JSContext *cx, JSObject *global);
void register_all_js_binding_HttpClientPackage(JSContext* cx, JSObject* obj);
JSBool js_js_binding_HttpClientPackage_HttpClientPackage_setTimeoutForConnect(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_binding_HttpClientPackage_HttpClientPackage_HttpGetRequest(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_binding_HttpClientPackage_HttpClientPackage_HttpPostRequest(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_binding_HttpClientPackage_HttpClientPackage_setTimeoutForRead(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_binding_HttpClientPackage_HttpClientPackage_destroyInstance(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_binding_HttpClientPackage_HttpClientPackage_getInstance(JSContext *cx, uint32_t argc, jsval *vp);
#endif

