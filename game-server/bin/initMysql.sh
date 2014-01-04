db=$1

mysql -uroot -p1easure114E -e "drop database if exists $db;create database $db;use $db;source ./config/schema/init.sql;GRANT ALL PRIVILEGES ON $db.* to dev@localhost IDENTIFIED BY '1';" 
mysql -uroot -p1easure114E -e "drop database if exists userdb;create database userdb;use userdb;source ./config/schema/init.sql;GRANT ALL PRIVILEGES ON userdb.* to dev@localhost IDENTIFIED BY '1';"
mysql -uroot -p1easure114E -e "use userdb;source ./config/schema/userdb.sql;"
mysql -uroot -p1easure114E -e "use $db;source ./config/schema/magpiedb.sql;"
