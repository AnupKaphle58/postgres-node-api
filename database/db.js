import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: "",
  password: "",
  database: "library",
  host: "localhost",
  port: 5432,
});

export default pool;
