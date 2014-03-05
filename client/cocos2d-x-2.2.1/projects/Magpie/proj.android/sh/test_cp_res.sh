#! /bin/sh

DIR="$1"
BUILD_MODE="$2"
COCOS2DX_ROOT="$DIR/../../.."
APP_ROOT="$DIR/.."
APP_ANDROID_ROOT="$DIR"
BINDINGS_JS_ROOT="$APP_ROOT/../../scripting/javascript/bindings/js"

function cp_res
{
	echo "cp magpie res to android assets"

	cp -rf "$APP_ROOT"/Resources/res "$APP_ANDROID_ROOT"/assets

	# delete *.ccb file
	find "$APP_ANDROID_ROOT"/assets -name "*.ccb" -type f -exec rm {} \;
}

function debug
{
	cp_res

	echo "cp magpie src to debug android assets"

	cp -rf "$APP_ROOT"/Resources/src "$APP_ANDROID_ROOT"/assets
	cp -rf "$APP_ROOT"/Resources/Android/Test/* "$APP_ANDROID_ROOT"/assets

	# copy bindings/*.js into assets' root
	cp -f "$BINDINGS_JS_ROOT"/* "$APP_ANDROID_ROOT"/assets
}

function releases
{
	cp_res

	echo "cp magpie src to releases android assets"

	cp -rf "$APP_ROOT"/Resources/game/Android/Test-Releases/* "$APP_ANDROID_ROOT"/assets
}

echo "msgpie android cp res"

if [ "$BUILD_MODE" = "debug" ] || [ "$BUILD_MODE" = "Debug" ]; then
	debug
else
	releases
fi

echo "Done!"