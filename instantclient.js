// SOURCE https://node-oracledb.readthedocs.io/en/latest/user_guide/installation.html#instosx
const oracledb = require('oracledb');
const fs = require('fs');
try {

  let libPath;
  if (process.platform === 'win32') {           // Windows
    libPath = 'C:\\oracle\\instantclient_19_12';
  } else if (process.platform === 'darwin') {   // macOS
    libPath = process.env.HOME + '/Desktop/instantclient_19_8';
  }
  if (libPath && fs.existsSync(libPath)) {
    oracledb.initOracleClient({ libDir: libPath });
  }

}
catch (err) {
  console.error(err);
  process.exit(1);
}