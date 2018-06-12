const mysql = require('mysql');

let database = mysql.createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'cinema_app_user',
    password: process.env.DATABASE_PASSWORD || 'IyIdBqs6ACmZhjVW',
    database: process.env.DATABASE_NAME || 'Cinema',
    insecureAuth: true
});

database.connect((error) => {

    if (error) return console.log(error);

    console.log('Connected to database');

});

module.exports = database;