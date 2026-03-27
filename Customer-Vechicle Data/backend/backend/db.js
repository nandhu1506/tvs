const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Nandhu1506',
    database: 'tvs'
});

db.connect(err => {
    if (err) console.error('DB connection error:', err);
    else console.log('Connected to MySQL database');
});

module.exports = db;