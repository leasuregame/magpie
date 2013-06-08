test:
	./node_modules/.bin/mocha \
		--compilers coffee:coffee-script \
		--require should \
		--reporter spec \
		--ui bdd \
		./src/test/$(files)

startTT:
	/data/ttserver/ttservctl start

stopTT:
	/data/ttserver/ttservctl stop

runserver:
	./node_modules/.bin/coffee ./src/test/test_battle_server.coffee

debug:
	node ./node_modules/node-inspector/bin/inspector.js & node --debug ./lib/test/test_battle_server.js

build:
	sh ./scripts/build.sh

.PHONY: test startTT stopTT runserver build