const database = require('../startup/database')

exports.ticketsRepo = {
    create: function (ticket) {
        return new Promise((resolve) => {
            database.query('INSERT INTO ticket SET ?', ticket, (error, result) => {
                if (error) throw error
                resolve(result.insertId)
            })
        })
    },
    reserveSeat: function (id) {
        return new Promise((resolve) => {
            database.query('UPDATE seatInstance SET status = 2 WHERE ID = ?', [id], (error, result) => {
                if (error) throw error
                resolve()
            })
        })
    }
}