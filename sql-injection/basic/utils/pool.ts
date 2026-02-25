import pg from "pg";

export const pool = new pg.Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "postgres",
  password: process.env.DB_PASSWORD || "123456",
  port: parseInt(process.env.DB_PORT || "5432"),
});

export default pool;