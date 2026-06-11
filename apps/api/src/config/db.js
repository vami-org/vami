import pg from "pg";
import env from "./env.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export default {
  query: (text, params) => pool.query(text, params),
  pool,
};
