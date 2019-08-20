// Database interactions
const mysql = require("mysql2/promise");
const seed = require("./seed");
const uuid = require("uuid/v4");
const config = require("../config");

// Start database connection

const { url, } = config.database;
console.log("Establishing database connection");

/**
 * Raw SQL connection pool object
*/
const db = mysql.createPool(url);

/**
 * Inserts a new ArtSite form into the database. Returns its unique ID. 
*/
async function insertForm({ firstName, lastName, }) {
  const id = uuid();
  await db.query({
    sql: `INSERT INTO entries SET
            submission_id = ?,
            first_name = ?,
            last_name = ?`,
    values: [id, firstName, lastName,],
  });
  return id;
}

module.exports = {
  db,
  insertForm,
};