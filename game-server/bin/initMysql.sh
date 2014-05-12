db=$1

# mysql -uroot -pleasure:GAME -e "drop database if exists $db;create database $db;use $db;source ./config/schema/init.sql;GRANT ALL PRIVILEGES ON $db.* to yy_leasuregame@localhost IDENTIFIED BY 'leasure405GAME';" 
mysql -uroot -pleasure:GAME -e "drop database if exists yy_db_area_1;create database yy_db_area_1;use yy_db_area_1;source ./config/schema/areadb.sql;GRANT ALL PRIVILEGES ON yy_db_area_1.* to yy_leasuregame@localhost IDENTIFIED BY 'leasure405GAME';"
mysql -uroot -pleasure:GAME -e "drop database if exists yy_userdb;create database yy_userdb;use yy_userdb;source ./config/schema/userdb.sql;GRANT ALL PRIVILEGES ON yy_userdb.* to yy_leasuregame@localhost IDENTIFIED BY 'leasure405GAME';"
mysql -uroot -pleasure:GAME -e "drop database if exists yy_sharedb; create database yy_sharedb; use yy_sharedb; source ./config/schema/sharedb.sql; GRANT ALL PRIVILEGES ON yy_sharedb.* to yy_leasuregame@localhost IDENTIFIED BY 'leasure405GAME';"
