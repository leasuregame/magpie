#ifndef __js_bindings_NDAdapter_h__
#define __js_bindings_NDAdapter_h__

#include "jsapi.h"
#include "jsfriendapi.h"


extern JSClass  *jsb_NDAdapter_class;
extern JSObject *jsb_NDAdapter_prototype;

JSBool js_js_bindings_NDAdapter_NDAdapter_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_js_bindings_NDAdapter_NDAdapter_finalize(JSContext *cx, JSObject *obj);
void js_register_js_bindings_NDAdapter_NDAdapter(JSContext *cx, JSObject *global);
void register_all_js_bindings_NDAdapter(JSContext* cx, JSObject* obj);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDLogout(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDEnterPlatform(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDUniPayAsyn(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDSwitchAccount(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDLogin(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDInit(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDNickName(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDLoginUin(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDSetAutoRotation(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDIsLogined(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDHideToolBar(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDEnterAccountManage(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDLoginEx(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDUserFeedback(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDUniPay(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDGetCurrentLoginState(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDSetScreenOrientation(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDSetDebugMode(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDSessionId(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDGuestRegist(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDShowToolBar(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDPause(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDAdapterInstance(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_NDAdapter_NDAdapter_NDAdapter(JSContext *cx, uint32_t argc, jsval *vp);
#endif

