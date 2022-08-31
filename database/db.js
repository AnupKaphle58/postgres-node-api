import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  password: "1234",
  database: "library",
  host: "localhost",
  port: 5432,
});

export default pool;
