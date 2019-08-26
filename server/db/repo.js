// Database interactions
const mysql = require("mysql2/promise");
const uuid = require("uuid/v4");
const stream = require("stream");
const config = require("../config");

const allFields = `
  uid,
  first_name AS firstName,
  last_name AS lastName,
  entries.title AS entryTitle,
  section AS section,
  site_map AS siteMap,
  items.title AS itemTitle,
  items.value AS itemValue
`;

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
async function insertForm({ firstName, lastName, title, section, siteMap, items }) {
  const uid = uuid();
  const conn = await db.getConnection();
  try {
    await conn.query("START TRANSACTION");
    await conn.query({
      sql: `INSERT INTO entries SET
              uid = ?,
              first_name = ?,
              last_name = ?,
              section = ?,
              title = ?,
              site_map = ?`,
      values: [uid, firstName, lastName, section, title, siteMap,],
    });
    items.forEach(async(item) => {
      await conn.query({
        sql: `INSERT INTO items SET
                entry_uid = ?,
                title = ?,
                value = ?`,
        values: [uid, item.title, item.value],
      });
    });
    await conn.query("COMMIT");
  } catch(error) {
    await conn.query("ROLLBACK");
    throw error;
  } finally {
    await conn.release();
  }
  return uid;
}

/**
 * Fetches a form by its unique ID and returns all fields.
*/
async function getForm(uid) {
  const [res] = await db.execute({
    sql: `SELECT ${allFields} FROM entries WHERE uid = ?`,
    values: [uid],
  });
  return res[0];
}

/**
 * Returns CSV data for all form data
*/
async function getCsv() {
  const [res] = await db.execute({
    sql: `SELECT ${allFields} FROM items LEFT JOIN entries ON entries.uid = items.entry_uid`
  });

  const rstr = new stream.Readable;
  rstr.setEncoding("utf-8");

  const csv = [];
  csv.push([
    "Entry ID",
    "Entry Title",
    "First Name",
    "Last Name",
    "Section",
    "Site MAP Number",
    "Item title",
    "Item value"
  ].join(","));
  res.forEach((data) => {
    const csvRow = [
      `"${data.uid}"`,
      `"${data.entryTitle}"`,
      `"${data.firstName}"`,
      `"${data.lastName}"`,
      `"${data.section}"`,
      `"${data.siteMap}"`,
      `"${data.itemTitle}"`,
      `"$${data.itemValue ? data.itemValue / 100 : 0}"`,
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