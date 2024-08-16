const oracledb = require("oracledb");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Verify that environment variables are loaded
console.log("Database Config:", {
  user: process.env.USER_db,
  password: process.env.PASS_db,
  connectString: process.env.ConnectString,
});

// Initialize Oracle Client to use Thick mode
oracledb.initOracleClient({
  libDir: "O:\\Softwares\\instantclient-basic-windows.x64-23.4.0.24.05\\instantclient_23_4",
});

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function getConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.USER_db,
      password: process.env.PASS_db,
      connectString: process.env.ConnectString,
    });
    return connection;
  } catch (err) {
    console.error("Error getting connection:", err);
    throw err;
  }
}

async function runQuery(query, params = {}) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(query, params);
    await connection.commit();
    return result.rows;
  } catch (err) {
    console.error("Error running query:", err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

module.exports = { runQuery };
