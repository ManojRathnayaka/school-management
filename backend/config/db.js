import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config({ quiet: true });

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Qwer1234.",
  database: process.env.DB_NAME || "school_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});




