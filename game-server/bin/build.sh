
#echo ${PWD}

echo 'compiler coffee files...'
./node_modules/.bin/coffee -cb -o ./ ./src

echo 'cp .js files'
cd src
find . -type f \( -name '*.js' \) -exec sh -c '
  mkdir -p "$0/${1%/*}";
  cp -p "$1" "$0/$1"
' ../../game-server {} \;
cd ..

# for i in `find ./src -name \*.js`
# do
# dir=${i:5}
# cp -R $i .$dir
# done

echo 'copy tables data...'
cp -r ./src/app/test/tables ./test/battle/tables

echo 'Done!'
