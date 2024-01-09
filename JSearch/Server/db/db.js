const pg = require("pg");
const Pool = pg.Pool;
const createTablesInPostgresDB = require("./db_table_creations");
const db_bulk_insert = require("./db_bulk_insert");
require("dotenv").config();

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

createTablesInPostgresDB(pool);

// Company
db_bulk_insert(pool, "Company", "./Crawler/Data/Companies/Companies.csv");

module.exports = pool;
