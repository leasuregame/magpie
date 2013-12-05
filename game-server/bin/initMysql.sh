db=$1

mysql -uroot -p1 -e "drop database if exists $db;create database $db;use $db;source ./config/schema/init.sql;GRANT ALL PRIVILEGES ON $db.* to dev@localhost IDENTIFIED BY '1';" 
mysql -uroot -p1 -e "drop database if exists userdb1;create database userdb1;use userdb1;source ./config/schema/init.sql;GRANT ALL PRIVILEGES ON userdb1.* to dev@localhost IDENTIFIED BY '1';"
mysql -uroot -p1 -e "use userdb1;source ./config/schema/userdb.sql;"
mysql -uroot -p1 -e "use $db;source ./config/schema/magpiedb.sql;"
