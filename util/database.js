
const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'nodejs_learning'
});
module.exports = pool.promise();
