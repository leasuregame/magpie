MOCHA = ./node_modules/.bin/mocha

build:
	sh ./bin/build.sh

convert-data: build
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

newdb:
	sh ./bin/initMysql.sh magpie_area_1
	sh ./bin/initMysql.sh magpie_area_2

inittables: 
	mysql -udev -p1 -e "drop database if exists $(db);create database $(db);use $(db);source ./config/schema/init.sql;GRANT ALL PRIVILEGES ON $(db).* to dev@localhost IDENTIFIED BY '1';" 
	mysql -udev -p1 -e "drop database if exists userdb;create database userdb;use userdb;source ./config/schema/init.sql;GRANT ALL PRIVILEGES ON userdb.* to dev@localhost IDENTIFIED BY '1';"
	mysql -udev -p1 -e "use userdb;source ./config/schema/userdb.sql;"
	mysql -udev -p1 -e "use $(db);source ./config/schema/magpiedb.sql;"

loaddata-user:
	node ./bin/loadUserData.js 

loaddata:
	node ./bin/dao.js all development
	

.PHONY: build clean test testserver runserver startTT stopTT loaddata