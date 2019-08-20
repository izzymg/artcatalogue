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
  const submissionId = uuid();
  await db.query({
    sql: `INSERT INTO entries SET
            submission_id = ?,
            first_name = ?,
            last_name = ?`,
    values: [submissionId, firstName, lastName,],
  });
  return submissionId;
}

/**
 * Fetches a form by its unique ID and returns all fields.
*/
async function getForm(submissionId) {
  const [res] = await db.execute({
    sql: `SELECT
          submission_id AS submissionId,
          first_name AS firstName,
          last_name AS lastName
          FROM entries WHERE submission_id = ?`,
    values: [submissionId],
  });
  return res[0];
}

module.exports = {
  db,
  insertForm,
  getForm,
};