PATH=/usr/local/bin:/opt/node/bin:$PATH

npm install
npm install forever -g

rm -r ./test ./app
make build

XUNIT_FILE="test/TESTS-dao.xml" ./node_modules/.bin/mocha -R xunit-file  --require should --recursive ./test/dao
XUNIT_FILE="test/TESTS-domain.xml" ./node_modules/.bin/mocha -R xunit-file  --require should --recursive ./test/domain
XUNIT_FILE="test/TESTS-battle.xml" ./node_modules/.bin/mocha -R xunit-file  --require should --recursive ./test/battle
XUNIT_FILE="test/TESTS-mapping.xml" ./node_modules/.bin/mocha -R xunit-file  --require should --recursive ./test/mapping

make newdb
./node_modules/.bin/pomelo start development --daemon
./node_modules/.bin/forever start ./test/jasmine/app.js

#java -jar selenium-server-standalone-2.33.0.jar
node ./test/jasmine/runner.js


# stop test server and game server
./node_modules/.bin/forever stop 0
./node_modules/.bin/pomelo stop