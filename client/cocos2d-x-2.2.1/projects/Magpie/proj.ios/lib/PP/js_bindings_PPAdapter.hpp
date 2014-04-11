#ifndef __js_bindings_PPAdapter_h__
#define __js_bindings_PPAdapter_h__

#include "jsapi.h"
#include "jsfriendapi.h"


extern JSClass  *jsb_PPAdapter_class;
extern JSObject *jsb_PPAdapter_prototype;

JSBool js_js_bindings_PPAdapter_PPAdapter_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_js_bindings_PPAdapter_PPAdapter_finalize(JSContext *cx, JSObject *obj);
void js_register_js_bindings_PPAdapter_PPAdapter(JSContext *cx, JSObject *global);
void register_all_js_bindings_PPAdapter(JSContext* cx, JSObject* obj);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPCheckGameUpdate(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPSetIsDeviceOrientationLandscapeLeft(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPVerifyingUpdatePassCallBack(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPCurrentUserId(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPShowLogin(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPSetCloseRechargeAlertMessage(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPClosePageViewCallBack(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPSetIsNSlogData(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPLogout(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPShowCenter(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPSetIsDeviceOrientationPortraitUpsideDown(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPCloseWebViewCallBack(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPSetIsOpenRecharge(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPSetIsDeviceOrientationPortrait(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPSetIsLogOutPushLoginView(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPGetUserInfoSecurity(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPSetRechargeAmount(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPCurrentUserName(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPPayResultCallBack(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPLogOffCallBack(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPSetIsLongComet(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPLoginStrCallBack(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPSetIsDeviceOrientationLandscapeRight(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPExchangeGoods(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPInit(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_js_bindings_PPAdapter_PPAdapter_PPAdapterInstance(JSContext *cx, uint32_t argc, jsval *vp);
#endif

