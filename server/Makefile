test:
	./node_modules/.bin/mocha \
		--compilers coffee:coffee-script \
		--require should \
		--reporter spec \
		--ui bdd \
		$(files)

startTT:
	/data/ttserver/ttservctl start

stopTT:
	/data/ttserver/ttservctl stop

runserver:
	./node_modules/.bin/coffee ./test/test_battle_server.coffee

.PHONY: test startTT stopTT runserver