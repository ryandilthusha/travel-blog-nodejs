// Import the 'dotenv' package to be able to use environment variables from the .env file
require('dotenv').config();

// Import the 'pg' library, which allows us to interact with PostgreSQL databases
const { Pool } = require('pg');

// Create a new pool of clients using the connection information from the .env file
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// A function that accepts SQL query and optional parameters.
// It returns a promise which resolves with the query results or rejects with an error.
const query = (sql, values = []) => 
{
  return new Promise((resolve, reject) => 
  {
    pool.query(sql, values)

      .then(res => resolve(res))
      
      .catch(err => reject(err));
  });
};

// Export the 'query' function to be used in other parts of the application
module.exports = { query };
