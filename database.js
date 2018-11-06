const mysql = require('mysql');

let database = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    insecureAuth: true
});

database.connect((error) => {
    if (error) return console.log(error);
    console.log('Connected to database');
});

module.exports = database;