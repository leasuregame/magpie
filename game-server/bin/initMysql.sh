database=$1
createdb=./config/schema/init.sql
createtables=./config/schema/tables.sql

mysql -uroot -p1 -e "set @dbname='$database'; drop database if exists $database; create database $database; use $database; source $createdb; GRANT ALL PRIVILEGES ON $database.* to dev@localhost IDENTIFIED BY '1';"
mysql -uroot -p1 -e "use $database; source $createtables;"