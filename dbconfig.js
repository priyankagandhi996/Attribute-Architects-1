/*
dbconfig.js

Sets the information needed by Oracle to connect to the database.
Protocol, host, port, etc. can be checked in SQLDeveloper by right
clicking on your Oracle Connection and choosing "Properties."

NEVER commit your username and password to the remote repository.
*/

module.exports = {
    user          : "username",
    password      : "password", 
    connectString : "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=CSDB.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))" 
};