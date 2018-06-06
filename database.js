const mysql = require('mysql');

let database = mysql.createConnection({
    host: 'localhost',
    user: 'cinema_app_user',
    password: 'IyIdBqs6ACmZhjVW',
    database: 'Cinema',
    insecureAuth: true
});

database.connect((error) => {

    if (error) return console.log(error);

    console.log('Connected to database');

});

module.exports = database;