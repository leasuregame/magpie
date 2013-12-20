/**
 * @module cocos2dx_extension
 */
var cc = cc || {};


/**
 * @class AssetsManager
 */
cc.AssetsManager = {

/**
 * @method setStoragePath
 * @param {const char*}
 */
setStoragePath : function () {},

/**
 * @method setPackageUrl
 * @param {const char*}
 */
setPackageUrl : function () {},

/**
 * @method checkUpdate
 * @return A value converted from C/C++ "bool"
 */
checkUpdate : function () {},

/**
 * @method getStoragePath
 * @return A value converted from C/C++ "const char*"
 */
getStoragePath : function () {},

/**
 * @method update
 */
update : function () {},

/**
 * @method setConnectionTimeout
 * @param {unsigned int}
 */
setConnectionTimeout : function () {},

/**
 * @method setVersionFileUrl
 * @param {const char*}
 */
setVersionFileUrl : function () {},

/**
 * @method getPackageUrl
 * @return A value converted from C/C++ "const char*"
 */
getPackageUrl : function () {},

/**
 * @method getConnectionTimeout
 * @return A value converted from C/C++ "unsigned int"
 */
getConnectionTimeout : function () {},

/**
 * @method getVersion
 * @return A value converted from C/C++ "std::string"
 */
getVersion : function () {},

/**
 * @method getVersionFileUrl
 * @return A value converted from C/C++ "const char*"
 */
getVersionFileUrl : function () {},

/**
 * @method deleteVersion
 */
deleteVersion : function () {},

/**
 * @method create
 * @return A value converted from C/C++ "cocos2d::extension::AssetsManager*"
 * @param {const char*}
 * @param {const char*}
 * @param {const char*}
 * @param {target object}
 * @param {errorCallback}
 * @param {progressCallback}
 * @param {successCallback}
 */
create : function () {},

/**
 * @method AssetsManager
 * @constructor
 */
AssetsManager : function () {},

};