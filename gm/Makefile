update pomelo-client:
	cd public/javascripts/lib && component install -f && component build -v

runserver1:
	cp -f ../game-server/config/mysql.json ./config
	cd ../game-server&&make convert-data
	forever start app.js

runserver2:
	cp -f ../game-server/config/mysql.json ./config
	cd ../game-server&&make convert-data
	NODE_ENV=production forever start app.js

stopserver:
	forever stop app.js

.PHONY: runserver1 runserver2

