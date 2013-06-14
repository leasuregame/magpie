#echo ${PWD} 
#cd ..

echo 'compiler coffee files...'
./node_modules/.bin/coffee -cb -o ./lib ./src

echo 'cp .js files'
for i in `find ./src -name \*.js`
do
sDIR=`echo $i|rev |awk -F'/' '{print $2;}'|rev`
sFname=`echo $i|rev |awk -F'/' '{print $1;}'|rev`
cp $i ./lib/$sDIR/$sFname
done

echo 'copy tables data...'
cp -r ./src/test/tables ./lib/test/tables

echo 'Done!'
