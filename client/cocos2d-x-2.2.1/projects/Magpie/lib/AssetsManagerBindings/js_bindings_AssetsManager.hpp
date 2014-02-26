#ifndef __js_bindings_AssetsManager_h__
#define __js_bindings_AssetsManager_h__

#include "jsapi.h"
#include "jsfriendapi.h"


extern JSClass  *jsb_AssetsManager_class;
extern JSObject *jsb_AssetsManager_prototype;

JSBool js_cocos2dx_extension_AssetsManager_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_cocos2dx_extension_AssetsManager_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_extension_AssetsManager(JSContext *cx, JSObject *global);
void register_all_cocos2dx_extension_AssetsManager(JSContext* cx, JSObject* obj);
JSBool js_cocos2dx_extension_AssetsManager_setStoragePath(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_cocos2dx_extension_AssetsManager_setPackageUrl(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_cocos2dx_extension_AssetsManager_checkUpdate(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_cocos2dx_extension_AssetsManager_getStoragePath(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_cocos2dx_extension_AssetsManager_update(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_cocos2dx_extension_AssetsManager_setConnectionTimeout(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_cocos2dx_extension_AssetsManager_setVersionFileUrl(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_cocos2dx_extension_AssetsManager_getPackageUrl(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_cocos2dx_extension_AssetsManager_getConnectionTimeout(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_cocos2dx_extension_AssetsManager_getVersion(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_cocos2dx_extension_AssetsManager_getVersionFileUrl(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_cocos2dx_extension_AssetsManager_deleteVersion(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_cocos2dx_extension_AssetsManager_getInstance(JSContext *cx, uint32_t argc, jsval *vp);
JSBool js_cocos2dx_extension_AssetsManager_AssetsManager(JSContext *cx, uint32_t argc, jsval *vp);
#endif
