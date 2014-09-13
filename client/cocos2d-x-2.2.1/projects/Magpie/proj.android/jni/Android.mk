LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE := cocos2djs_shared

LOCAL_MODULE_FILENAME := libcocos2djs

LOCAL_SRC_FILES := magpie/main.cpp \
				   ../lib/UM/MobClickCpp.cpp \
                   ../lib/UM/js_bindings_MobClickCpp.cpp \
                   ../lib/YY/YYClient.cpp \
                   ../lib/YY/yy_client_js_bindings.cpp \
                   ../../Classes/Android/YY/AppDelegate.cpp \
                   ../lib/YY/web_browser_js_bindings.cpp \
                   ../lib/YY/WebBrowser.cpp

LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../Classes/Android/YY \
					$(LOCAL_PATH)/../../../../cocos2dx/platform/android/jni \
					$(LOCAL_PATH)/../lib/UM \
					$(LOCAL_PATH)/../lib/YY

LOCAL_WHOLE_STATIC_LIBRARIES := cocos2dx_static
LOCAL_WHOLE_STATIC_LIBRARIES += cocosdenshion_static
LOCAL_WHOLE_STATIC_LIBRARIES += chipmunk_static
LOCAL_WHOLE_STATIC_LIBRARIES += spidermonkey_static
LOCAL_WHOLE_STATIC_LIBRARIES += scriptingcore-spidermonkey

LOCAL_EXPORT_CFLAGS := -DCOCOS2D_DEBUG=2 -DCOCOS2D_JAVASCRIPT

include $(BUILD_SHARED_LIBRARY)

$(call import-module,cocos2dx)
$(call import-module,CocosDenshion/android)
$(call import-module,external/chipmunk)
$(call import-module,scripting/javascript/spidermonkey-android)
$(call import-module,scripting/javascript/bindings)
