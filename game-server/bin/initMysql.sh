db=$1

mysql -uroot -p1 -e "drop database if exists $db;create database $db;use $db;source ./config/schema/init.sql;GRANT ALL PRIVILEGES ON $db.* to dev@localhost IDENTIFIED BY '1';" 
mysql -uroot -p1 -e "use $db;source ./config/schema/tables.sql;"