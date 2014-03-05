#! /bin/sh

DIR="$1"

# ... use paths relative to current directory
COCOS2DX_ROOT="$DIR/../../.."
APP_ROOT="$DIR/.."
APP_ANDROID_ROOT="$DIR"
BINDINGS_JS_ROOT="$APP_ROOT/../../scripting/javascript/bindings/js"

echo start

echo cp magpie res to android assets
# copy res
cp -rf "$APP_ROOT"/Resources/res "$APP_ANDROID_ROOT"/assets
find "$APP_ANDROID_ROOT"/assets -name "*.ccb" -type f -exec rm {} \;

echo cp magpie src to android assets
# copy src
cp -rf "$APP_ROOT"/Resources/game/Android/Test/* "$APP_ANDROID_ROOT"/assets

echo end