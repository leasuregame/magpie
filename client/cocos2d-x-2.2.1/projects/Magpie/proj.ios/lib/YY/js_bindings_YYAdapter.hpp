#ifndef __js_bindings_YYAdapter_h__
#define __js_bindings_YYAdapter_h__

#include "jsapi.h"
#include "jsfriendapi.h"


extern JSClass  *jsb_YYAdapter_class;
extern JSObject *jsb_YYAdapter_prototype;

JSBool js_js_bindings_YYAdapter_YYAdapter_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_js_bindings_YYAdapter_YYAdapter_finalize(JSContext *cx, JSObject *obj);
void js_register_js_bindings_YYAdapter_YYAdapter(JSContext *cx, JSObject *global);
void register_all_js_bindings_YYAdapter(JSContext* cx, JSObject* obj);
JSBool js_js_bindings_YYAdapter_YYAdapter_YYCreateUserRole(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_YYAdapter_YYAdapter_YYLogin(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_YYAdapter_YYAdapter_YYLogout(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_YYAdapter_YYAdapter_YYIsLogin(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_YYAdapter_YYAdapter_YYGetUser(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_YYAdapter_YYAdapter_YYSelectGameServer(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_YYAdapter_YYAdapter_YYInitWithAppId(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_YYAdapter_YYAdapter_YYModifyPassword(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_YYAdapter_YYAdapter_YYUpdateUserRole(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_YYAdapter_YYAdapter_YYGameConsumeOnServer(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_YYAdapter_YYAdapter_YYRegister(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_YYAdapter_YYAdapter_YYGetSdkVersion(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_YYAdapter_YYAdapter_YYAdapterInstance(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_YYAdapter_YYAdapter_YYAdapter(JSContext *cx, uint32_t argc, jsval *vp);
#endif

