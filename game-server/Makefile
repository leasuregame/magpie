MOCHA = ./node_modules/.bin/mocha

build:
	sh ./bin/build.sh

convert-data: build
	node ./bin/convertXmlToJson.js $(platform)

start: convert-data
	pomelo start -e production --daemon

start-yy: build
	node ./bin/convertXmlToJson.js YY
	pomelo start -e production --daemon	

stop:
	pomelo stop

restart: stop start

start-webserver:
	cd ../web-server && forever start app.js && cd ../game-server

stop-webserver:
	cd ../web-server && forever stop app.js && cd ../game-server

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
	$(MOCHA) -R xunit-file  --reporter spec \ --ui bdd \ --require should --recursive ./test/dao/$(files)

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
	pomelo start -e development

debug: 
	./node_modules/.bin/node-inspector --web-port=9095 &

restartserver: build
	./node_modules/.bin/pomelo stop
	./node_modules/.bin/pomelo start production --daemon

newdb:
	sh ./bin/initMysql.sh yy_db_area_1

inittables: 
	mysql -uroot -p1easure114E -e "drop database if exists $(db);create database $(db);use $(db);source ./config/schema/init.sql;GRANT ALL PRIVILEGES ON $(db).* to dev@localhost IDENTIFIED BY '1';" 
	mysql -uroot -p1easure114E -e "drop database if exists userdb;create database userdb;use userdb;source ./config/schema/init.sql;GRANT ALL PRIVILEGES ON userdb.* to dev@localhost IDENTIFIED BY '1';"
	mysql -uroot -p1easure114E -e "use userdb;source ./config/schema/userdb.sql;"
	mysql -uroot -p1easure114E -e "use $(db);source ./config/schema/magpiedb.sql;"

loaddata-user:
	node ./bin/loadUserData.js 

loaddata:
	node ./bin/dao.js all development

data-for-test: build
	node ./data/test/loadUserData.js production
	node ./data/test/dao.js robot production

pfm-data:
	node ./pfmTest/userData.js
	node ./pfmTest/playerData.js
	

.PHONY: build clean test testserver runserver startTT stopTT loaddata
