#ifndef __js_bindings_WebLayer_h__
#define __js_bindings_WebLayer_h__

#include "jsapi.h"
#include "jsfriendapi.h"


extern JSClass  *jsb_WebLayer_class;
extern JSObject *jsb_WebLayer_prototype;

JSBool js_js_bindings_WebLayer_WebLayer_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_js_bindings_WebLayer_WebLayer_finalize(JSContext *cx, JSObject *obj);
void js_register_js_bindings_WebLayer_WebLayer(JSContext *cx, JSObject *global);
void register_all_js_bindings_WebLayer(JSContext* cx, JSObject* obj);
JSBool js_js_bindings_WebLayer_WebLayer_close(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_WebLayer_WebLayer_create(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_WebLayer_WebLayer_WebLayer(JSContext *cx, uint32_t argc, jsval *vp);
#endif

