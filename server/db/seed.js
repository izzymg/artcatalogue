// SQL Statements to seed database

module.exports = [
  `CREATE TABLE IF NOT EXISTS entries (
    submission_id varchar(36) NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
];