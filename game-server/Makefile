build:
	sh ./bin/build.sh

clean: 
	rm -r ./app
	#rm -r ./test

test: 
	./node_modules/.bin/mocha \
		--compilers coffee:coffee-script \
		--require should \
		--reporter spec \
		--ui bdd \
		./src/test/$(files)

testserver:
	node ./test/jasmine/app.js

runserver:
	sh ./bin/build.sh
	./node_modules/.bin/pomelo start development

starttt:
	./bin/ttservctl start

stoptt:
	./bin/ttservctl stop

createtables:
	cat ./bin/initMysql.sh | mysql -uroot -p1

loaddata:
	node ./bin/loaddata.js

.PHONY: build clean test testserver runserver startTT stopTT loaddata