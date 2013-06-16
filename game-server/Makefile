build:
	sh ./bin/build.sh

clean: 
	rm -r ./app
	rm -r ./test

test: 
	./node_modules/.bin/mocha \
		--compilers coffee:coffee-script \
		--require should \
		--reporter spec \
		--ui bdd \
		./src/test/$(files)

testserver:
	node ./test/jasmine/app.js

startserver:
	sh ./bin/build.sh
	node app.js

startTT:
	/data/ttserver/ttservctl start

stopTT:
	/data/ttserver/ttservctl stop

createtables:
	cat ./bin/initMysql.sh | mysql -uroot -p1

.PHONY: build clean test startserver startTT stopTT