MOCHA = ./node_modules/.bin/mocha

build:
	sh ./bin/build.sh

convert-data:
	node ./bin/convertXmlToJson.js 

clean: 
	rm -r ./app
	rm -r ./test

test: 
	./node_modules/.bin/mocha \
		--compilers coffee:coffee-script \
		--require should \
		--reporter spec \
		--ui bdd \
		--recursive \
		./src/test/$(files)

test-dao: build
	XUNIT_FILE="test/TESTS-xunit.xml" \
	$(MOCHA) -R xunit-file  --require should --recursive ./test/dao/$(files)

test-mapping: build
	./node_modules/.bin/mocha \
		--compilers coffee:coffee-script \
		--require should \
		--reporter spec \
		--ui bdd \
		--recursive \
		./test/mapping/$(files)

test-domain: build
	./node_modules/.bin/mocha \
		--compilers coffee:coffee-script \
		--require should \
		--reporter spec \
		--ui bdd \
		--recursive \
		./test/domain/$(files)

test-battle: build
	./node_modules/.bin/mocha \
		--compilers coffee:coffee-script \
		--require should \
		--reporter spec \
		--ui bdd \
		--recursive \
		./test/battle/$(files)

test-api: build
	node ./test/jasmine/app.js

runserver: build
	./node_modules/.bin/pomelo start development

restartserver: build
	./node_modules/.bin/pomelo stop
	./node_modules/.bin/pomelo start production --daemon

createtables:
	sh ./bin/initMysql.sh

inittables: 
	mysql -udev -p1 < ./config/schema/tables.sql;

loaddata:
	node ./bin/dao.js all development

.PHONY: build clean test testserver runserver startTT stopTT loaddata