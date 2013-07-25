PATH=/usr/local/bin:$PATH

npm install

make build

XUNIT_FILE="test/TESTS-dao.xml" ./node_modules/.bin/mocha -R xunit-file  --require should --recursive ./test/dao
XUNIT_FILE="test/TESTS-domain.xml" ./node_modules/.bin/mocha -R xunit-file  --require should --recursive ./test/domain
XUNIT_FILE="test/TESTS-battle.xml" ./node_modules/.bin/mocha -R xunit-file  --require should --recursive ./test/battle
XUNIT_FILE="test/TESTS-mapping.xml" ./node_modules/.bin/mocha -R xunit-file  --require should --recursive ./test/mapping