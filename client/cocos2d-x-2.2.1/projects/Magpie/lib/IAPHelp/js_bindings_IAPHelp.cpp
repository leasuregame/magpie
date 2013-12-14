#include "js_bindings_IAPHelp.hpp"
#include "cocos2d_specifics.hpp"
#include "IAPHelp.h"

class JSSDKCallbackWrapper: public JSCallbackWrapper {
public:
    JSSDKCallbackWrapper() {}
    virtual ~JSSDKCallbackWrapper() {}
    
    void sdkCallback(CCObject * data) const {
        JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
        jsval retval = JSVAL_NULL;
        
        if(!jsCallback.isNullOrUndefined()) {
            PaymentData * paymentData = (PaymentData *)data;
            JSObject* jsobj = JS_NewObject(cx, NULL, NULL, NULL);
            
            jsval jsState = INT_TO_JSVAL(paymentData->state);
            jsval jsProduct = c_string_to_jsval(cx, paymentData->product);
            jsval jsReceipt = c_string_to_jsval(cx, paymentData->receipt);
            jsval jsMsg = c_string_to_jsval(cx, paymentData->msg);
            
            JS_SetProperty(cx, jsobj, "state", &jsState);
            JS_SetProperty(cx, jsobj, "product", &jsProduct);
            JS_SetProperty(cx, jsobj, "receipt", &jsReceipt);
            JS_SetProperty(cx, jsobj, "msg", &jsMsg);
            
            jsval jsData = OBJECT_TO_JSVAL(jsobj);
            
            if (jsThisObj.isNullOrUndefined()) {
                JS_CallFunctionValue(cx, NULL, jsCallback, 1, &jsData, &retval);
            }
            else {
                JS_CallFunctionValue(cx, JSVAL_TO_OBJECT(jsThisObj), jsCallback, 1, &jsData, &retval);
            }
        }
    }
};

template<class T>
static JSBool dummy_constructor(JSContext *cx, uint32_t argc, jsval *vp) {
	TypeTest<T> t;
	T* cobj = new T();
	js_type_class_t *p;
	uint32_t typeId = t.s_id();
	HASH_FIND_INT(_js_global_type_ht, &typeId, p);
	assert(p);
	JSObject *_tmp = JS_NewObject(cx, p->jsclass, p->proto, p->parentProto);
	js_proxy_t *pp = jsb_new_proxy(cobj, _tmp);
	JS_SET_RVAL(cx, vp, OBJECT_TO_JSVAL(_tmp));
    
	return JS_TRUE;
}

static JSBool empty_constructor(JSContext *cx, uint32_t argc, jsval *vp) {
	return JS_FALSE;
}


JSClass  *jsb_IAPHelp_class;
JSObject *jsb_IAPHelp_prototype;

JSBool js_js_bindings_IAPHelp_IAPHelp_buy(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
    
	if (argc == 3) {
		const char* arg0;
		std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
        
        JSSDKCallbackWrapper * tmpCobj = new JSSDKCallbackWrapper();
        tmpCobj->autorelease();
        tmpCobj->setJSCallbackThis(argv[1]);
        tmpCobj->setJSCallbackFunc(argv[2]);
        
        IAPHelp::buy(arg0, tmpCobj, callfuncO_selector(JSSDKCallbackWrapper::sdkCallback));
        
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}




void js_js_bindings_IAPHelp_IAPHelp_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (IAPHelp)", obj);
    js_proxy_t* nproxy;
    js_proxy_t* jsproxy;
    jsproxy = jsb_get_js_proxy(obj);
    if (jsproxy) {
        nproxy = jsb_get_native_proxy(jsproxy->ptr);
        
        IAPHelp *nobj = static_cast<IAPHelp *>(nproxy->ptr);
        if (nobj)
            delete nobj;
        
        jsb_remove_proxy(nproxy, jsproxy);
    }
}

static JSBool js_js_bindings_IAPHelp_IAPHelp_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
    IAPHelp *nobj = new IAPHelp();
    js_proxy_t* p = jsb_new_proxy(nobj, obj);
    JS_SET_RVAL(cx, vp, JSVAL_VOID);
    return JS_TRUE;
}

void js_register_js_bindings_IAPHelp_IAPHelp(JSContext *cx, JSObject *global) {
	jsb_IAPHelp_class = (JSClass *)calloc(1, sizeof(JSClass));
	jsb_IAPHelp_class->name = "IAPHelp";
	jsb_IAPHelp_class->addProperty = JS_PropertyStub;
	jsb_IAPHelp_class->delProperty = JS_PropertyStub;
	jsb_IAPHelp_class->getProperty = JS_PropertyStub;
	jsb_IAPHelp_class->setProperty = JS_StrictPropertyStub;
	jsb_IAPHelp_class->enumerate = JS_EnumerateStub;
	jsb_IAPHelp_class->resolve = JS_ResolveStub;
	jsb_IAPHelp_class->convert = JS_ConvertStub;
	jsb_IAPHelp_class->finalize = js_js_bindings_IAPHelp_IAPHelp_finalize;
	jsb_IAPHelp_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);
    
	JSPropertySpec *properties = NULL;
    
	JSFunctionSpec *funcs = NULL;
    
	static JSFunctionSpec st_funcs[] = {
		JS_FN("buy", js_js_bindings_IAPHelp_IAPHelp_buy, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FS_END
	};
    
	jsb_IAPHelp_prototype = JS_InitClass(
                                         cx, global,
                                         NULL, // parent proto
                                         jsb_IAPHelp_class,
                                         dummy_constructor<IAPHelp>, 0, // no constructor
                                         properties,
                                         funcs,
                                         NULL, // no static properties
                                         st_funcs);
	// make the class enumerable in the registered namespace
	JSBool found;
	JS_SetPropertyAttributes(cx, global, "IAPHelp", JSPROP_ENUMERATE | JSPROP_READONLY, &found);
    
	// add the proto and JSClass to the type->js info hash table
	TypeTest<IAPHelp> t;
	js_type_class_t *p;
	uint32_t typeId = t.s_id();
	HASH_FIND_INT(_js_global_type_ht, &typeId, p);
	if (!p) {
		p = (js_type_class_t *)malloc(sizeof(js_type_class_t));
		p->type = typeId;
		p->jsclass = jsb_IAPHelp_class;
		p->proto = jsb_IAPHelp_prototype;
		p->parentProto = NULL;
		HASH_ADD_INT(_js_global_type_ht, type, p);
	}
}

void register_all_js_bindings_IAPHelp(JSContext* cx, JSObject* obj) {
	// first, try to get the ns
	jsval nsval;
	JSObject *ns;
	JS_GetProperty(cx, obj, "lz", &nsval);
	if (nsval == JSVAL_VOID) {
		ns = JS_NewObject(cx, NULL, NULL, NULL);
		nsval = OBJECT_TO_JSVAL(ns);
		JS_SetProperty(cx, obj, "lz", &nsval);
	} else {
		JS_ValueToObject(cx, nsval, &ns);
	}
	obj = ns;
    
	js_register_js_bindings_IAPHelp_IAPHelp(cx, obj);
}

