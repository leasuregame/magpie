#! /bin/sh

echo "magpie ios client build"

MAGPIE_PATH="cocos2d-x-2.2.1/projects/Magpie"
COCOS2D_COMPILE_PATH="cocos2d-x-2.2.1/tools/cocos2d-console/console/cocos2d.py"

MAGPIE_RESOURCES_PATH="$MAGPIE_PATH/Resources"
MAGPIE_RESOURCES_IOS_PATH="$MAGPIE_PATH/Res_ios"

APPSTORE_RELEASES_PATH="$MAGPIE_RESOURCES_PATH/game/IOS/AppStore-Releases"
APPSTORE_RELEASES_OBFUSCATE="$MAGPIE_RESOURCES_PATH/bin/obfuscate/IOS/magpie_obfuscate_AppStore.xml"

PP_RELEASES_PATH="$MAGPIE_RESOURCES_PATH/game/IOS/PP-Releases"
PP_RELEASES_OBFUSCATE="$MAGPIE_RESOURCES_PATH/bin/obfuscate/IOS/magpie_obfuscate_PP.xml"

ND_RELEASES_PATH="$MAGPIE_RESOURCES_PATH/game/IOS/91-Releases"
ND_RELEASES_OBFUSCATE="$MAGPIE_RESOURCES_PATH/bin/obfuscate/IOS/magpie_obfuscate_91.xml"

TB_RELEASES_PATH="$MAGPIE_RESOURCES_PATH/game/IOS/TB-Releases"
TB_RELEASES_OBFUSCATE="$MAGPIE_RESOURCES_PATH/bin/obfuscate/IOS/magpie_obfuscate_TB.xml"

YY_RELEASES_PATH="$MAGPIE_RESOURCES_PATH/game/IOS/YY-Releases"
YY_RELEASES_OBFUSCATE="$MAGPIE_RESOURCES_PATH/bin/obfuscate/IOS/magpie_obfuscate_YY.xml"

function init
{
	echo "magpie ios build init"

	clear

	echo "cp Resources to Res_ios"
	cp -RP "$MAGPIE_RESOURCES_PATH" "$MAGPIE_RESOURCES_IOS_PATH"

	cd "$MAGPIE_PATH"

	echo "delete all cc.log in Res_ios"
	perl -pi -e "s/cc.log/\/\/cc.log/gi" `find Res_ios -iname *.js`

	cd ../../../
}

function clear
{
	echo "build clear"

	echo "clear file"
	if [ -d "$MAGPIE_RESOURCES_IOS_PATH" ]; then
		echo "clear Res_ios"
		rm -R "$MAGPIE_RESOURCES_IOS_PATH"
	fi
}

function build_AppStore
{
	echo "build_AppStore"

	if [ -f "$APPSTORE_RELEASES_PATH/game.js" ]; then
		echo "game.js exist remove it"
		rm "$APPSTORE_RELEASES_PATH"/game.js
	fi

	echo "obfuscate magpie appstore file to game.js"
	ant -buildfile "$APPSTORE_RELEASES_OBFUSCATE"

	if [ -f "$APPSTORE_RELEASES_PATH/game.js" ]; then
		if [ -f "$APPSTORE_RELEASES_PATH/game.jsc" ]; then
			echo "game.jsc exist remove it"
			rm "$APPSTORE_RELEASES_PATH"/game.jsc
		fi

		echo "compile magpie appstore game.js to game.jsc"
		"$COCOS2D_COMPILE_PATH" jscompile -s "$APPSTORE_RELEASES_PATH" -d "$APPSTORE_RELEASES_PATH"
		echo "complete to game.jsc remove game.js"
		rm "$APPSTORE_RELEASES_PATH"/game.js
	else
		echo "magpie appstore file game.js not exist"
	fi 
}

function build_PP
{
	echo "build_PP"

	if [ -f "$PP_RELEASES_PATH/game.js" ]; then
		echo "game.js exist remove it"
		rm "$PP_RELEASES_PATH"/game.js
	fi

	echo "obfuscate magpie pp file to game.js"
	ant -buildfile "$PP_RELEASES_OBFUSCATE"

	if [ -f "$PP_RELEASES_PATH/game.js" ]; then
		if [ -f "$PP_RELEASES_PATH/game.jsc" ]; then
			echo "game.jsc exist remove it"
			rm "$PP_RELEASES_PATH"/game.jsc
		fi

		echo "compile magpie pp game.js to game.jsc"
		"$COCOS2D_COMPILE_PATH" jscompile -s "$PP_RELEASES_PATH" -d "$PP_RELEASES_PATH"
		echo "complete to game.jsc remove game.js"
		rm "$PP_RELEASES_PATH"/game.js
	else
		echo "magpie pp file game.js not exist"
	fi 
}

function build_91
{
	echo "build_91"

	if [ -f "$ND_RELEASES_PATH/game.js" ]; then
		echo "game.js exist remove it"
		rm "$ND_RELEASES_PATH"/game.js
	fi

	echo "obfuscate magpie 91 file to game.js"
	ant -buildfile "$ND_RELEASES_OBFUSCATE"

	if [ -f "$ND_RELEASES_PATH/game.js" ]; then
		if [ -f "$ND_RELEASES_PATH/game.jsc" ]; then
			echo "game.jsc exist remove it"
			rm "$ND_RELEASES_PATH"/game.jsc
		fi

		echo "compile magpie 91 game.js to game.jsc"
		"$COCOS2D_COMPILE_PATH" jscompile -s "$ND_RELEASES_PATH" -d "$ND_RELEASES_PATH"
		echo "complete to game.jsc remove game.js"
		rm "$ND_RELEASES_PATH"/game.js
	else
		echo "magpie 91 file game.js not exist"
	fi 
}

function build_TB
{
	echo "build_TB"

	if [ -f "$TB_RELEASES_PATH/game.js" ]; then
		echo "game.js exist remove it"
		rm "$TB_RELEASES_PATH"/game.js
	fi

	echo "obfuscate magpie tb file to game.js"
	ant -buildfile "$TB_RELEASES_OBFUSCATE"

	if [ -f "$TB_RELEASES_PATH/game.js" ]; then
		if [ -f "$TB_RELEASES_PATH/game.jsc" ]; then
			echo "game.jsc exist remove it"
			rm "$TB_RELEASES_PATH"/game.jsc
		fi

		echo "compile magpie tb game.js to game.jsc"
		"$COCOS2D_COMPILE_PATH" jscompile -s "$TB_RELEASES_PATH" -d "$TB_RELEASES_PATH"
		echo "complete to game.jsc remove game.js"
		rm "$TB_RELEASES_PATH"/game.js
	else
		echo "magpie tb file game.js not exist"
	fi 
}

function build_YY
{
	echo "build_YY"

	if [ -f "$YY_RELEASES_PATH/game.js" ]; then
		echo "game.js exist remove it"
		rm "$YY_RELEASES_PATH"/game.js
	fi

	echo "obfuscate magpie yy file to game.js"
	ant -buildfile "$YY_RELEASES_OBFUSCATE"

	if [ -f "$YY_RELEASES_PATH/game.js" ]; then
		if [ -f "$YY_RELEASES_PATH/game.jsc" ]; then
			echo "game.jsc exist remove it"
			rm "$YY_RELEASES_PATH"/game.jsc
		fi

		echo "compile magpie yy game.js to game.jsc"
		"$COCOS2D_COMPILE_PATH" jscompile -s "$YY_RELEASES_PATH" -d "$YY_RELEASES_PATH"
		echo "complete to game.jsc remove game.js"
		rm "$YY_RELEASES_PATH"/game.js
	else
		echo "magpie yy file game.js not exist"
	fi 
}

if [ ! -n "$1" ]; then
	init
	build_AppStore
	build_PP
	build_91
	build_TB
	build_YY
	clear
elif [ "$1" = "AppStore" ] || [ "$1" = "appstore" ]; then
	init
	build_AppStore
	clear
elif [ "$1" = "PP" ] || [ "$1" = "pp" ]; then
	init
	build_PP
	clear
elif [ "$1" = "91" ] || [ "$1" = "ND" ] || [ "$1" = "nd" ]; then
	init
	build_91
	clear
elif [ "$1" = "TB" ] || [ "$1" = "tb" ]; then
	init
	build_TB
	clear
elif [ "$1" = "YY" ] || [ "$1" = "yy" ]; then
	init
	build_YY
	clear
else
	echo "|----Example:"
	echo "|----sh $0 \"\""
	echo "|----sh $0 \"AppStore\" or \"appstore\""
	echo "|----sh $0 \"PP\" or \"pp\""
	echo "|----sh $0 \"91\" or \"ND\" or \"nd\""
	echo "|----sh $0 \"TB\" or \"tb\""
	echo "\----sh $0 \"YY\" or \"yy\""
fi

echo "Done!"