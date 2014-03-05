#! /bin/sh

echo "magpie android client build debug"

MAGPIE_PATH="cocos2d-x-2.2.1/projects/Magpie"

function build_Test_debug
{
	echo "build_Test_debug"

	sh "$MAGPIE_PATH"/proj.android/build_native.sh test debug
}

if [ ! -n "$1" ]; then
	build_Test_debug
elif [ "$1" = "Test" ] || [ "$1" = "test" ]; then
	build_Test_debug
else
	echo "Example: sh $0 \"\" or \"Test\" or \"test\""
fi

echo "Done!"