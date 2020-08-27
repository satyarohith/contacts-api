const mysql = require('mysql2/promise');
const creds = JSON.parse(process.env.__NIM_SQL);

async function main(args) {
  try {
    const connection = await mysql.createConnection({
      host: creds.host,
      user: creds.user,
      database: creds.database,
      password: creds.password,
      ssl: {
        ca: creds.serverCaCert,
        cert: creds.clientCert,
        key: creds.clientKey
      }
    });

    // Create table if it doesn't exist.
    const [rows, fields] = await connection.query(
      'CREATE TABLE IF NOT EXISTS contacts(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, name TEXT(10) NOT NULL, email TEXT(10) NOT NULL)'
    );

    const {add = false, list = true} = args;

    if (add) {
      const {name, email} = args;
      const [rows, fields] = await connection.query(
        `INSERT INTO contacts(name, email) VALUES ("${name}", "${email}")`
      );

      return {body: {id: rows.insertId, email, name}};
    } else if (list) {
      const [rows, fields] = await connection.query(`SELECT * FROM contacts`);

      return {body: rows};
    }
  } catch (error) {
    return {error};
  }
}

module.exports.main = main;
