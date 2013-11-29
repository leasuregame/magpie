#ifndef __jsb_TBAdapter_h__
#define __jsb_TBAdapter_h__

#include "jsapi.h"
#include "jsfriendapi.h"


extern JSClass  *jsb_TBAdapter_class;
extern JSObject *jsb_TBAdapter_prototype;

JSBool js_jsb_TBAdapter_TBAdapter_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_jsb_TBAdapter_TBAdapter_finalize(JSContext *cx, JSObject *obj);
void js_register_jsb_TBAdapter_TBAdapter(JSContext *cx, JSObject *global);
void register_all_jsb_TBAdapter(JSContext* cx, JSObject* obj);
JSBool js_jsb_TBAdapter_TBAdapter_TBSwitchAccount(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBUserID(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBCheckOrderFailed(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBUnipayForCoinWithOrder(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBSetAppID(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBSetAutoRotate(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBLogin(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBLogout(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBIsLogined(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBBuyGoodsFailed(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBCheckUpdateFinished(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_ShowMessage(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBSetDebug(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBSetScreenOrientation(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBLogoutHandle(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBBuyGoodsDidCancelByUser(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBCheckOrderResultHandle(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBCheckOrder(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBNickName(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBBuyGoodsDidEnterWebview(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBEnterGameCenter(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBEnterBBS(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBInitDidFinishWithUpdateCode(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBLeavedPlatformHandle(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBBuyGoodsSuccessWithOrder(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBSessionID(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBUnipayForCoinWhthOrder(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBLoginResultHandle(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBEnterUserCenter(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBCheckUpdate(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBInitPlatformWithAppID(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_jsb_TBAdapter_TBAdapter_TBAdapterInstance(JSContext *cx, uint32_t argc, jsval *vp);
#endif

