echo ${PWD}

sh ./bin/initMysql.sh magpie_area_1

node ./bin/loadUserData.js
node ./bin/dao.js $1
# if [ "$1" = "user" ]; then
# 	node ./bin/loadUserData.js
# else
# 	node ./bin/dao.js $1
# fi