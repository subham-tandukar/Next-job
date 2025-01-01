// Modified dbConnect function
import mysql from "mysql2/promise";
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Create a single MySQL connection pool
let pool;
if (!global.mysqlPool) {
  global.mysqlPool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    connectionLimit: 10, // Adjust the connection limit as needed
  });
}
pool = global.mysqlPool;

export async function dbQuery(query, params = []) {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    throw new Error("Database query failed: " + error.message);
  }
}
