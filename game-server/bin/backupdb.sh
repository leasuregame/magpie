#!/bin/bash

echo ${PWD}

cd /Users/arthur/magpie/game-server/bin

node ./read_db_info.js $1 | sh