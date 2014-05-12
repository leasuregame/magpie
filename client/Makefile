# magpie client makefile

build: build-ios build-android

build-ios:
	sh ./bin/build_ios.sh

build-ios-appstore:
	sh ./bin/build_ios.sh appstore

build-ios-pp:
	sh ./bin/build_ios.sh pp

build-ios-91:
	sh ./bin/build_ios.sh 91

build-ios-tb:
	sh ./bin/build_ios.sh tb

build-ios-yy:
	sh ./bin/build_ios.sh yy

build-android:
	sh ./bin/build_android.sh

build-android-test:
	sh ./bin/build_android.sh test

build-android-debug:
	sh ./bin/build_android_debug.sh

build-android-debug-test:
	sh ./bin/build_android_debug.sh test

clean-android:
	sh ./cocos2d-x-2.2.1/projects/Magpie/proj.android/build_native.sh clean

packet:
	sh ./bin/packet.sh