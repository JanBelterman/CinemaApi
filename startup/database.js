const mysql = require('mysql');
const config = require('config');

let database = mysql.createConnection({
    host: config.get('databaseHost'),
    user: config.get('databaseUser'),
    password: config.get('databasePassword'),
    database: config.get('databaseName'),
    insecureAuth: true
});

database.connect((error) => {
    if (error) return console.log(error);
    console.log('Connected to database');
});

module.exports = database;