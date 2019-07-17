// => node modules
const mysql = require('mysql');
const util = require('util');

// => db connection
const dbConfig = {
  connectionLimit: 10,
  host: 'localhost',
  user: 'grauboti',
  password: 'Adelant3',
  database: 'scarecrow'
}
const sql = mysql.createPool(dbConfig);

sql.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
})
sql.query = util.promisify(sql.query);
module.exports = sql;
