const database = require('../startup/database')

exports.getByUsername = function (username) {
    return new Promise((resolve) => {
        database.query('SELECT * FROM user WHERE username = ?', [username], (error, result) => {
            if (error) throw error
            if (result) resolve(result[0])
        })
    })
};

exports.create = function (user) {
    return new Promise((resolve) => {
        database.query('INSERT INTO user SET ?', user, function (error, result) {
            if (error) throw error
            if (result) resolve(result.insertId)
        })
    })
}