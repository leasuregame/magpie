#! /bin/sh

echo "magpie android client build"

MAGPIE_PATH="cocos2d-x-2.2.1/projects/Magpie"
COCOS2D_COMPILE_PATH="cocos2d-x-2.2.1/tools/cocos2d-console/console/cocos2d.py"

MAGPIE_RESOURCES_PATH="$MAGPIE_PATH/Resources"
MAGPIE_RESOURCES_ANDROID_PATH="$MAGPIE_PATH/Res_android"

TEST_RELEASES_PATH="$MAGPIE_RESOURCES_PATH/game/Android/Test-Releases"
TEST_RELEASES_OBFUSCATE="$MAGPIE_RESOURCES_PATH/bin/obfuscate/Android/magpie_obfuscate_Test.xml"

function init
{
	echo "magpie android build init"

	clear

	echo "cp Resources to Res_android"
	cp -RP "$MAGPIE_RESOURCES_PATH" "$MAGPIE_RESOURCES_ANDROID_PATH"

	cd "$MAGPIE_PATH"

	echo "delete all cc.log in Res_android"
	perl -pi -e "s/cc.log/\/\/cc.log/gi" `find Res_android -iname *.js`

	cd ../../../
}

function clear
{
	echo "build clear"

	echo "clear file"
	if [ -d "$MAGPIE_RESOURCES_ANDROID_PATH" ]; then
		echo "clear Res_android"
		rm -R "$MAGPIE_RESOURCES_ANDROID_PATH"
	fi
}

function build_Test
{
	echo "build_Test"

	if [ -f "$TEST_RELEASES_PATH/game.js" ]; then
		echo "game.js exist remove it"
		rm "$TEST_RELEASES_PATH"/game.js
	fi

	echo "obfuscate magpie test file to game.js"
	ant -buildfile "$TEST_RELEASES_OBFUSCATE"

	if [ -f "$TEST_RELEASES_PATH/game.js" ]; then
		if [ -f "$TEST_RELEASES_PATH/game.jsc" ]; then
			echo "game.jsc exist remove it"
			rm "$TEST_RELEASES_PATH"/game.jsc
		fi

		echo "compile magpie test game.js to game.jsc"
		"$COCOS2D_COMPILE_PATH" jscompile -s "$TEST_RELEASES_PATH" -d "$TEST_RELEASES_PATH"
		echo "complete to game.jsc remove game.js"
		rm "$TEST_RELEASES_PATH"/game.js
	else
		echo "magpie test file game.js not exist"
	fi

	sh "$MAGPIE_PATH"/proj.android/build_native.sh test
}

if [ ! -n "$1" ]; then
	init
	build_Test
	clear
elif [ "$1" = "Test" ] || [ "$1" = "test" ]; then
	init
	build_Test
	clear
else
	echo "Example: sh $0 \"\" or \"Test\" or \"test\""
fi

echo "Done!"