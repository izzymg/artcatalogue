// Database interactions
const mysql = require("mysql2/promise");
const seed = require("./seed");
const uuid = require("uuid/v4");

module.exports = function(url = "mysql://root@localhost/artsite", shouldSeed = false) {

  // Start database connection
  console.log("Establishing database connection");
  const db = mysql.createPool(url);
  try {
    if(shouldSeed) {
      console.log("Seeding database");
      seed.forEach(async(sql) => db.execute({ sql, }));
    }
  } catch(error) {
    throw new Error(`Database connection failure\n${error}`);
  }

  /**
   * Inserts a new ArtSite form into the database. Returns its unique ID. 
   * @param {*} param0 
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

  return { insertForm, db, };
}