// Database interactions
const mysql = require("mysql2/promise");
const uuid = require("uuid/v4");
const stream = require("stream");
const config = require("../config");

const allFields = `
  submission_id AS submissionId,
  first_name AS firstName,
  last_name AS lastName,
  section AS section,
  title AS title,
  site_map AS siteMap
`

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
async function insertForm({ firstName, lastName, title, section, siteMap }) {
  const submissionId = uuid();
  await db.query({
    sql: `INSERT INTO entries SET
            submission_id = ?,
            first_name = ?,
            last_name = ?,
            section = ?,
            title = ?,
            site_map = ?`,
    values: [submissionId, firstName, lastName, section, title, siteMap,],
  });
  return submissionId;
}

/**
 * Fetches a form by its unique ID and returns all fields.
*/
async function getForm(submissionId) {
  const [res] = await db.execute({
    sql: `SELECT ${allFields} FROM entries WHERE submission_id = ?`,
    values: [submissionId],
  });
  return res[0];
}

/**
 * Returns CSV data for all form data
*/
async function getCsv() {
  const [res] = await db.execute({
    sql: `SELECT ${allFields} FROM entries`
  });

  const rstr = new stream.Readable;
  rstr.setEncoding("utf-8");

  const csv = [];
  csv.push([
    "Submission ID",
    "First Name",
    "Last Name",
    "Section",
    "Title",
    "Site MAP Number",
  ].join(","));
  res.forEach((data) => {
    const csvRow = [
      `"${data.submissionId}"`,
      `"${data.firstName}"`,
      `"${data.lastName}"`,
      `"${data.section}"`,
      `"${data.title}"`,
      `"${data.siteMap}"`
    ];
    csv.push(csvRow.join(","));
  });

  // Join lines by Windows style carriage return
  rstr.push(csv.join("\r\n"));
  rstr.push(null);
  return rstr;
}

module.exports = {
  db,
  insertForm,
  getForm,
  getCsv,
};