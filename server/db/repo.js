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
  items.value as value
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
                title = ?,
                value = ?,
                medium = ?`,
        values: [uid, item.title, item.value, item.medium],
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

const getEntry = async function() {
  const [results] = await db.execute({
    sql: `SELECT ${entryFields}, ${itemFields} FROM entries LEFT JOIN items ON items.entry_uid = entries.uid`,
    nestTables: true,
  });

  // Filter out duplicates from left join and nest flat relationship into their data
  if(results && results.length > 0) {
    // res.entries | res.items
    let nested = [];
    results.forEach((res) => {
      const lastItem = nested[nested.length - 1];
      if(lastItem && lastItem.uid == res.entries.uid) {
        // Push item data onto the entry
        if(lastItem.items) {
          lastItem.items.push(res.items);
        } else {
          lastItem.items = [res.items];
        }
      } else {
        // Create a new flat entry
        const obj = { ...res.entries };
        obj.items = [res.items];
        nested.push(obj);
      }
    });
    return nested;
  } else {
    return null;
  }
}

module.exports = {
  db,
  insertForm,
  getEntries,
  getEntry,
};