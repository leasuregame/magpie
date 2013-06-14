
#echo ${PWD}

echo 'compiler coffee files...'
./node_modules/.bin/coffee -cb -o ./ ./src

echo 'cp .js files'
for i in `find ./src -name \*.js`
do
sDIR=`echo $i|rev |awk -F'/' '{print $2;}'|rev`
sFname=`echo $i|rev |awk -F'/' '{print $1;}'|rev`
cp $i ./app/$sDIR/$sFname
done

echo 'copy tables data...'
cp -r ./src/app/test/tables ./app/test/tables
cp -r ./src/app/manager/mysql ./app/manager/mysql

echo 'Done!'
