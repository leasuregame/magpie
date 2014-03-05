#! /bin/sh

DIR="$1"
BUILD_MODE="$2"
COCOS2DX_ROOT="$DIR/../../.."
APP_ROOT="$DIR/.."
APP_ANDROID_ROOT="$DIR"

function cp_res
{
	echo "cp magpie res to android assets"

	cp -rf "$APP_ROOT"/Resources/res "$APP_ANDROID_ROOT"/assets

	# delete *.ccb file
	find "$APP_ANDROID_ROOT"/assets -name "*.ccb" -type f -exec rm {} \;
}

function debug
{
	echo cp magpie src to debug android assets
	
	cp_res

	cp -rf "$APP_ROOT"/Resources/src "$APP_ANDROID_ROOT"/assets
	cp -rf "$APP_ROOT"/Resources/Android/Test/* "$APP_ANDROID_ROOT"/assets
}

function releases
{
	echo cp magpie src to releases android assets

	cp_res

	cp -rf "$APP_ROOT"/Resources/game/Android/Test-Releases/* "$APP_ANDROID_ROOT"/assets
}

echo "msgpie android cp res"

if [ "$BUILD_MODE" = "debug" ] || [ "$BUILD_MODE" = "Debug" ]; then
	debug
else
	releases
fi

echo "Done!"