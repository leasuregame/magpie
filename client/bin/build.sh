#! /bin/sh

echo "magpie client build"

function build_AppStore
{
	echo "build_AppStore"

	if [ -f "cocos2d-x-2.2.1/projects/Magpie/Resources/game/AppStore/game.js" ]; then
		echo "game.js exist remove it"
		rm cocos2d-x-2.2.1/projects/Magpie/Resources/game/AppStore/game.js
	fi

	echo "obfuscate magpie appstore file to game.js"
	ant -buildfile cocos2d-x-2.2.1/projects/Magpie/Resources/bin/obfuscate/magpie_obfuscate_AppStore.xml

	if [ -f "cocos2d-x-2.2.1/projects/Magpie/Resources/game/AppStore/game.js" ]; then
		if [ -f "cocos2d-x-2.2.1/projects/Magpie/Resources/game/AppStore/game.jsc" ]; then
			echo "game.jsc exist remove it"
			rm cocos2d-x-2.2.1/projects/Magpie/Resources/game/AppStore/game.jsc
		fi

		echo "compile magpie appstore game.js to game.jsc"
		cocos2d-x-2.2.1/tools/cocos2d-console/console/cocos2d.py jscompile -s cocos2d-x-2.2.1/projects/Magpie/Resources/game/AppStore -d cocos2d-x-2.2.1/projects/Magpie/Resources/game/AppStore 
		echo "complete to game.jsc remove game.js"
		rm cocos2d-x-2.2.1/projects/Magpie/Resources/game/AppStore/game.js
	else
		echo "magpie appstore file game.js not exist"
	fi 
}

function build_TB
{
	echo "build_TB"

	if [ -f "cocos2d-x-2.2.1/projects/Magpie/Resources/game/TB/game.js" ]; then
		echo "game.js exist remove it"
		rm cocos2d-x-2.2.1/projects/Magpie/Resources/game/TB/game.js
	fi

	echo "obfuscate magpie tb file to game.js"
	ant -buildfile cocos2d-x-2.2.1/projects/Magpie/Resources/bin/obfuscate/magpie_obfuscate_TB.xml

	if [ -f "cocos2d-x-2.2.1/projects/Magpie/Resources/game/TB/game.js" ]; then
		if [ -f "cocos2d-x-2.2.1/projects/Magpie/Resources/game/TB/game.jsc" ]; then
			echo "game.jsc exist remove it"
			rm cocos2d-x-2.2.1/projects/Magpie/Resources/game/TB/game.jsc
		fi

		echo "compile magpie tb game.js to game.jsc"
		cocos2d-x-2.2.1/tools/cocos2d-console/console/cocos2d.py jscompile -s cocos2d-x-2.2.1/projects/Magpie/Resources/game/TB -d cocos2d-x-2.2.1/projects/Magpie/Resources/game/TB 
		echo "complete to game.jsc remove game.js"
		rm cocos2d-x-2.2.1/projects/Magpie/Resources/game/TB/game.js
	else
		echo "magpie tb file game.js not exist"
	fi 
}

if [ ! -n "$1" ]; then
	build_AppStore
	build_TB
elif [ "$1" = "AppStore" ] || [ "$1" = "appstore" ]; then
	build_AppStore
elif [ "$1" = "TB" ] || [ "$1" = "tb" ]; then
	build_TB
else
	echo "Example: sh $0 \"\" or \"AppStore\" or \"appstore\" or \"TB\" or \"tb\""
fi

echo "Done!"