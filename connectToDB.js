/*
connectToDB.js

Establishes the connection to Oracle and keeps that connection open by checking it every minute.

After running npm start on your application, you will know if the connection
is successful if the console reads "Oracle connection established."
*/

const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');
const libPath = require('./instantclient.js')

async function openConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log('Oracle connection established');
    // Keep the connection open by running a keep-alive query
    setInterval(async () => {
      await connection.execute(`SELECT 1 FROM DUAL`);
      // console.log('Keep database alive: successful');
      return connection;
    }, 60000); // Checks on 1 minute intervals
    return connection;
  } catch (err) {
    console.error('Error establishing connection:', err);
  }
}

module.exports = openConnection();