const database = require('../startup/database')

exports.genresRepo = {
    getAll: function () {
        return new Promise((resolve) => {
            database.query('SELECT * FROM genre', (error, result) => {
                if (error) throw error
                resolve(result)
            })
        })
    },
    create: function(genre) {
        return new Promise((resolve) => {
            database.query('INSERT INTO genre SET ?', genre, (error, result) => {
                if (error) throw error
                resolve(result.insertId)
            })
        })
    },
    update: function(genre) {
        return new Promise((resolve) => {
            database.query('UPDATE genre SET title = ? WHERE ID = ?', [genre.title, genre.ID], (error, result) => {
                if (error) throw error
                resolve(result.insertId)
            })
        })
    },
    deleteById: function(ID) {
        return new Promise((resolve) => {
            database.query('DELETE FROM genre WHERE ID = ?', [ID], (error) => {
                if (error) throw error
                resolve()
            })
        })
    }
}