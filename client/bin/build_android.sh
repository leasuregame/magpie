#! /bin/sh

echo "magpie android client build"

MAGPIE-PATH="cocos2d-x-2.2.1/projects/Magpie"
COCOS2D-COMPILE-PATH="cocos2d-x-2.2.1/tools/cocos2d-console/console/cocos2d.py"

MAGPIE-RESOURCES-PATH="$MAGPIE-PATH/Resources"
MAGPIE-RESOURCES-ANDROID-PATH="$MAGPIE-PATH/Res_android"

TEST-RELEASES-PATH="$MAGPIE-RESOURCES-PATH/game/Android/Test-Releases"
TEST-RELEASES-OBFUSCATE="$MAGPIE-RESOURCES-PATH/bin/obfuscate/Android/magpie_obfuscate_Test.xml"

function init
{
	echo "magpie android build init"

	clear

	echo "cp Resources to Res_android"
	cp -RP "$MAGPIE-RESOURCES-PATH" "$MAGPIE-RESOURCES-ANDROID-PATH"

	cd "$MAGPIE-PATH"

	echo "delete all cc.log in Res_android"
	perl -pi -e "s/cc.log/\/\/cc.log/gi" `find Res_android -iname *.js`

	cd ../../../
}

function clear
{
	echo "build clear"

	echo "clear file"
	if [ -d "$MAGPIE-RESOURCES-ANDROID-PATH" ]; then
		echo "clear Res_android"
		rm -R "MAGPIE-RESOURCES-ANDROID-PATH"
	fi
}

function build_Test
{
	echo "build_AppStore"

	if [ -f "$TEST-RELEASES-PATH/game.js" ]; then
		echo "game.js exist remove it"
		rm "$TEST-RELEASES-PATH"/game.js
	fi

	echo "obfuscate magpie appstore file to game.js"
	ant -buildfile "$TEST-RELEASES-OBFUSCATE"

	if [ -f "$TEST-RELEASES-PATH/game.js" ]; then
		if [ -f "$TEST-RELEASES-PATH/game.jsc" ]; then
			echo "game.jsc exist remove it"
			rm "$TEST-RELEASES-PATH"/game.jsc
		fi

		echo "compile magpie appstore game.js to game.jsc"
		"$COCOS2D-COMPILE-PATH" jscompile -s "$TEST-RELEASES-PATH" -d "$TEST-RELEASES-PATH"
		echo "complete to game.jsc remove game.js"
		rm "$TEST-RELEASES-PATH"/game.js
	else
		echo "magpie appstore file game.js not exist"
	fi 
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