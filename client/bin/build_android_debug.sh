#! /bin/sh

echo "magpie android client build debug"

MAGPIE_PATH="cocos2d-x-2.2.1/projects/Magpie"
CLENT_ROOT="$MAGPIE_PATH/../../.."
YY_LIBS_SOURCE="$MAGPIE_PATH"/proj.android/lib/yylib/armeabi
YY_LIBS_TARGET="$MAGPIE_PATH"/proj.android/libs/armeabi

function build_Test_debug
{
	echo "build_Test_debug"

	sh "$MAGPIE_PATH"/proj.android/build_native.sh yy debug
}

function cp_yy_libs
{
	echo "copy yy libs from $YY_LIBS_SOURCE => $YY_LIBS_TARGET"
	cp -rf "$YY_LIBS_SOURCE"/* "$YY_LIBS_TARGET"
}

if [ -d "$CLENT_ROOT" ]; then 
	echo 'cd to clent root dir'
	cd "$CLENT_ROOT"
fi

if [ ! -n "$1" ]; then
	build_Test_debug
	cp_yy_libs
elif [ "$1" = "Test" ] || [ "$1" = "test" ]; then
	build_Test_debug
	cp_yy_libs
else
	echo "Example: sh $0 \"\" or \"Test\" or \"test\""
fi

echo "Done!"