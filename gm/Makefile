update pomelo-client:
	cd public/javascripts/lib && component install -f && component build -v

runserver1:
	cd ../game-server&&make convert-data
	forever start app.js

runserver2:
	cd ../game-server&&make convert-data
	NODE_ENV=production forever start app.js

stopserver:
	forever stop app.js

.PHONY: runserver1 runserver2
