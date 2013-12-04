#ifndef __js_bindings_IAPHelp_h__
#define __js_bindings_IAPHelp_h__

#include "jsapi.h"
#include "jsfriendapi.h"


extern JSClass  *jsb_IAPHelp_class;
extern JSObject *jsb_IAPHelp_prototype;

JSBool js_js_bindings_IAPHelp_IAPHelp_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_js_bindings_IAPHelp_IAPHelp_finalize(JSContext *cx, JSObject *obj);
void js_register_js_bindings_IAPHelp_IAPHelp(JSContext *cx, JSObject *global);
void register_all_js_bindings_IAPHelp(JSContext* cx, JSObject* obj);
JSBool js_js_bindings_IAPHelp_IAPHelp_buy(JSContext *cx, uint32_t argc, jsval *vp);
#endif

