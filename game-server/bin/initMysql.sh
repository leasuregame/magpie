db=$1

mysql -uroot -pleasure:GAME -e "drop database if exists $db;create database $db;use $db;source ./config/schema/init.sql;GRANT ALL PRIVILEGES ON $db.* to yy_leasuregame@localhost IDENTIFIED BY 'leasure405GAME';" 
mysql -uroot -pleasure:GAME -e "drop database if exists yy_userdb;create database yy_userdb;use yy_userdb;source ./config/schema/init.sql;GRANT ALL PRIVILEGES ON yy_userdb.* to yy_leasuregame@localhost IDENTIFIED BY 'leasure405GAME';"
mysql -uroot -pleasure:GAME -e "use yy_userdb;source ./config/schema/userdb.sql;"
mysql -uroot -pleasure:GAME -e "use $db;source ./config/schema/magpiedb.sql;"