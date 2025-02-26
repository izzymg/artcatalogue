// Database interactions
const mysql = require("mysql2/promise");
const uuid = require("uuid/v4");
const config = require("../config");

const entryFields = `
  uid,
  first_name AS firstName,
  last_name AS lastName,
  entries.title AS title,
  section AS section,
  site_map AS siteMap
`;

const itemFields = `
  items.medium as medium,
  items.title as itemTitle,
  items.id as itemId,
  items.value as value,
  items.nfs as nfs,
  items.dimensions as dimensions
`;

// Start database connection

const { url, } = config.database;
console.log("Establishing database connection");

/**
 * Raw SQL connection pool object
*/
const db = mysql.createPool(url);

// Add IP
const insertIp = async function (ip) {
  return await db.execute({
    sql: "INSERT INTO ips SET ip = ?",
    values: [ip],
  });
}

// Check for an IP's existence
const getIp = async function(ip) {
  const [res] = await db.execute({
    sql: "SELECT created FROM ips WHERE ip = ?",
    values: [ip],
  });
  if(res && res.length > 0) {
    return res[0];
  }
  return null;
}

// Purge IPs over an hour old
const cleanIps = async function() {
  return await db.execute({
    sql: "DELETE FROM ips WHERE created < DATE_ADD(NOW(), INTERVAL -1 HOUR)",
  });
}

/**
 * Inserts a new ArtSite form into the database. Returns its unique ID. 
*/
const insertForm = async function({ firstName, lastName, title, section, siteMap, items }) {
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
                id = ?,
                title = ?,
                value = ?,
                nfs = ?,
                medium = ?,
                dimensions = ?`,
        values: [uid, item.id, item.title, item.value, item.nfs || false, item.medium, item.dimensions],
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

const getEntries = async function() {
  const [res] = await db.execute({
    sql: `SELECT ${entryFields} FROM entries`
  });
  return res;
}

const getEntry = async function(uid) {
  const [results] = await db.execute({
    sql: `SELECT ${entryFields}, ${itemFields} FROM entries
      LEFT JOIN items ON items.entry_uid = entries.uid WHERE entries.uid = ?`,
    values: [uid],
    nestTables: true,
  });

  if(results && results.length > 0) {
    // Flatten SQL duplicates into nest
    const obj = results[0].entries;
    obj.items = [];
    results.forEach(res => {
      obj.items.push(res.items);
    });
    return obj;
  }
  return null;
}

module.exports = {
  db,
  insertForm,
  getEntries,
  getEntry,
  cleanIps,
  getIp,
  insertIp,
};