#! /bin/sh

echo "magpie client build"

function init
{
	echo "build init"

	clear

	echo "cp Resources to Res"
	cp -RP cocos2d-x-2.2.1/projects/Magpie/Resources cocos2d-x-2.2.1/projects/Magpie/Res

	# cd cocos2d-x-2.2.1/projects/Magpie

	# echo "delete all cc.log"
	# perl -pi -e "s/cc.log/\/\/cc.log/gi" `find Res -iname *.js`

	# cd ../../../
}

function clear
{
	echo "build clear"

	echo "clear file"
	if [ -d "cocos2d-x-2.2.1/projects/Magpie/Res" ]; then
		echo "clear Res"
		rm -R cocos2d-x-2.2.1/projects/Magpie/Res
	fi
}

function build_AppStore
{
	echo "build_AppStore"

	if [ -f "cocos2d-x-2.2.1/projects/Magpie/Resources/game/AppStore-Releases/game.js" ]; then
		echo "game.js exist remove it"
		rm cocos2d-x-2.2.1/projects/Magpie/Resources/game/AppStore-Releases/game.js
	fi

	echo "obfuscate magpie appstore file to game.js"
	ant -buildfile cocos2d-x-2.2.1/projects/Magpie/Resources/bin/obfuscate/magpie_obfuscate_AppStore.xml

	if [ -f "cocos2d-x-2.2.1/projects/Magpie/Resources/game/AppStore-Releases/game.js" ]; then
		if [ -f "cocos2d-x-2.2.1/projects/Magpie/Resources/game/AppStore-Releases/game.jsc" ]; then
			echo "game.jsc exist remove it"
			rm cocos2d-x-2.2.1/projects/Magpie/Resources/game/AppStore-Releases/game.jsc
		fi

		echo "compile magpie appstore game.js to game.jsc"
		cocos2d-x-2.2.1/tools/cocos2d-console/console/cocos2d.py jscompile -s cocos2d-x-2.2.1/projects/Magpie/Resources/game/AppStore-Releases -d cocos2d-x-2.2.1/projects/Magpie/Resources/game/AppStore-Releases 
		echo "complete to game.jsc remove game.js"
		rm cocos2d-x-2.2.1/projects/Magpie/Resources/game/AppStore-Releases/game.js
	else
		echo "magpie appstore file game.js not exist"
	fi 
}

function build_TB
{
	echo "build_TB"

	if [ -f "cocos2d-x-2.2.1/projects/Magpie/Resources/game/TB-Releases/game.js" ]; then
		echo "game.js exist remove it"
		rm cocos2d-x-2.2.1/projects/Magpie/Resources/game/TB-Releases/game.js
	fi

	echo "obfuscate magpie tb file to game.js"
	ant -buildfile cocos2d-x-2.2.1/projects/Magpie/Resources/bin/obfuscate/magpie_obfuscate_TB.xml

	if [ -f "cocos2d-x-2.2.1/projects/Magpie/Resources/game/TB-Releases/game.js" ]; then
		if [ -f "cocos2d-x-2.2.1/projects/Magpie/Resources/game/TB-Releases/game.jsc" ]; then
			echo "game.jsc exist remove it"
			rm cocos2d-x-2.2.1/projects/Magpie/Resources/game/TB-Releases/game.jsc
		fi

		echo "compile magpie tb game.js to game.jsc"
		cocos2d-x-2.2.1/tools/cocos2d-console/console/cocos2d.py jscompile -s cocos2d-x-2.2.1/projects/Magpie/Resources/game/TB-Releases -d cocos2d-x-2.2.1/projects/Magpie/Resources/game/TB-Releases 
		echo "complete to game.jsc remove game.js"
		# rm cocos2d-x-2.2.1/projects/Magpie/Resources/game/TB-Releases/game.js
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