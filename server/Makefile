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

build:
	sh ./scripts/build.sh

.PHONY: test startTT stopTT runserver build