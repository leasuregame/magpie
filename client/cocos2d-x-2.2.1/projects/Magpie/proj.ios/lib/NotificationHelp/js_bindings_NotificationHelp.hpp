#ifndef __js_bindings_NotificationHelp_h__
#define __js_bindings_NotificationHelp_h__

#include "jsapi.h"
#include "jsfriendapi.h"


extern JSClass  *jsb_NotificationHelp_class;
extern JSObject *jsb_NotificationHelp_prototype;

JSBool js_js_bindings_NotificationHelp_NotificationHelp_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_js_bindings_NotificationHelp_NotificationHelp_finalize(JSContext *cx, JSObject *obj);
void js_register_js_bindings_NotificationHelp_NotificationHelp(JSContext *cx, JSObject *global);
void register_all_js_bindings_NotificationHelp(JSContext* cx, JSObject* obj);
JSBool js_js_bindings_NotificationHelp_NotificationHelp_push(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NotificationHelp_NotificationHelp_start(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NotificationHelp_NotificationHelp_end(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NotificationHelp_NotificationHelp_remove(JSContext *cx, uint32_t argc, jsval *vp);
#endif

