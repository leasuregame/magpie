#! /bin/sh

echo "magpie ios client build"

MAGPIE-PATH="cocos2d-x-2.2.1/projects/Magpie"
COCOS2D-COMPILE-PATH="cocos2d-x-2.2.1/tools/cocos2d-console/console/cocos2d.py"

MAGPIE-RESOURCES-PATH="$MAGPIE-PATH/Resources"
MAGPIE-RESOURCES-IOS-PATH="$MAGPIE-PATH/Res_ios"

APPSTORE-RELEASES-PATH="$MAGPIE-RESOURCES-PATH/game/IOS/AppStore-Releases"
APPSTORE-RELEASES-OBFUSCATE="$MAGPIE-RESOURCES-PATH/bin/obfuscate/IOS/magpie_obfuscate_AppStore.xml"

TB-RELEASES-PATH="$MAGPIE-RESOURCES-PATH/game/IOS/TB-Releases"
TB-RELEASES-OBFUSCATE="$MAGPIE-RESOURCES-PATH/bin/obfuscate/IOS/magpie_obfuscate_TB.xml"

function init
{
	echo "magpie ios build init"

	clear

	echo "cp Resources to Res_ios"
	cp -RP "$MAGPIE-RESOURCES-PATH" "$MAGPIE-RESOURCES-IOS-PATH"

	cd "$MAGPIE-PATH"

	echo "delete all cc.log in Res_ios"
	perl -pi -e "s/cc.log/\/\/cc.log/gi" `find Res_ios -iname *.js`

	cd ../../../
}

function clear
{
	echo "build clear"

	echo "clear file"
	if [ -d "$MAGPIE-RESOURCES-IOS-PATH" ]; then
		echo "clear Res_ios"
		rm -R "MAGPIE-RESOURCES-IOS-PATH"
	fi
}

function build_AppStore
{
	echo "build_AppStore"

	if [ -f "$AppStore-Releases-Path/game.js" ]; then
		echo "game.js exist remove it"
		rm "$AppStore-Releases-Path"/game.js
	fi

	echo "obfuscate magpie appstore file to game.js"
	ant -buildfile "$AppStore-Releases-Obfuscate"

	if [ -f "$AppStore-Releases-Path/game.js" ]; then
		if [ -f "$AppStore-Releases-Path/game.jsc" ]; then
			echo "game.jsc exist remove it"
			rm "$AppStore-Releases-Path"/game.jsc
		fi

		echo "compile magpie appstore game.js to game.jsc"
		"$COCOS2D-COMPILE-PATH" jscompile -s "$AppStore-Releases-Path" -d "$AppStore-Releases-Path"
		echo "complete to game.jsc remove game.js"
		rm "$AppStore-Releases-Path"/game.js
	else
		echo "magpie appstore file game.js not exist"
	fi 
}

function build_TB
{
	echo "build_TB"

	if [ -f "$TB-RELEASES-PATH/game.js" ]; then
		echo "game.js exist remove it"
		rm "$TB-RELEASES-PATH"/game.js
	fi

	echo "obfuscate magpie tb file to game.js"
	ant -buildfile "TB-RELEASES-OBFUSCATE"

	if [ -f "$TB-RELEASES-PATH/game.js" ]; then
		if [ -f "$TB-RELEASES-PATH/game.jsc" ]; then
			echo "game.jsc exist remove it"
			rm "TB-RELEASES-PATH"/game.jsc
		fi

		echo "compile magpie tb game.js to game.jsc"
		"$COCOS2D-COMPILE-PATH" jscompile -s "$TB-RELEASES-PATH" -d "$TB-RELEASES-PATH"
		echo "complete to game.jsc remove game.js"
		rm "$TB-RELEASES-PATH"/game.js
	else
		echo "magpie tb file game.js not exist"
	fi 
}

if [ ! -n "$1" ]; then
	init
	build_AppStore
	build_TB
	clear
elif [ "$1" = "AppStore" ] || [ "$1" = "appstore" ]; then
	init
	build_AppStore
	clear
elif [ "$1" = "TB" ] || [ "$1" = "tb" ]; then
	init
	build_TB
	clear
else
	echo "Example: sh $0 \"\" or \"AppStore\" or \"appstore\" or \"TB\" or \"tb\""
fi

echo "Done!"