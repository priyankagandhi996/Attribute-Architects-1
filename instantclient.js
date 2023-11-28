// SOURCE https://node-oracledb.readthedocs.io/en/latest/user_guide/installation.html#instosx
const oracledb = require('oracledb');
const fs = require('fs');
try {

  let libPath;
  if (process.platform === 'win32') {           // Windows
    libPath = 'C:\Users\priya\OneDrive\Desktop\DB\project\instantclient-basic-windows\instantclient_21_12';
  } else if (process.platform === 'darwin') {   // macOS
    console.log(process.env.HOME);
    libPath = process.env.HOME + '/Desktop/instantclient';
  }
  if (libPath && fs.existsSync(libPath)) {
    oracledb.initOracleClient({ libDir: libPath });
  }

}
catch (err) {
  console.error(err);
  process.exit(1);
}