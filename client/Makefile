# magpie client makefile

build: build-ios build-android

build-ios:
	sh ./bin/build_ios.sh

build-appstore:
	sh ./bin/build_ios.sh appstore

build-tb:
	sh ./bin/build_ios.sh tb

build-android:
	sh ./bin/build_andorid.sh

build-android-debug:
	sh ./bin/build_andorid.sh debug

build-test:
	sh ./bin/build_andorid.sh test

packet:
	sh ./bin/packet.sh