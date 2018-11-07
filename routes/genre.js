const express = require('express')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const database = require('../startup/database')
const { validate } = require('../models/genre')

const router = express.Router()

router.get('/', auth, (req, res) => {
    database.query('SELECT * FROM genre', (error, result) => {
        if (error) throw error
        res.status(200).send(result)
    })
})

router.post('/', [auth, admin], (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(412).send(error.details[0].message)
    let genre = {
        title: req.body.title
    }
    const query = database.query('INSERT INTO genre SET ?', genre, (error, result) => {
        if (error) throw error
        genre = {
            ID: result.insertId,
            title: genre.title
        }
        res.status(200).send(genre)
    })
})

router.put('/:ID', [auth, admin], (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(412).send(error.details[0].message)
    let genre = {
        ID: req.params.ID,
        title: req.body.title
    }
    database.query(`UPDATE genre SET title = '${genre.title}' WHERE ID = ${genre.ID}`, (error, result) => {
        if (error) throw error
        res.status(200).send(genre)
    })
})

router.delete('/:ID', [auth, admin], (req, res) => {
    database.query(`SELECT * FROM genre WHERE ID = ${req.params.ID}`, (error, result) => {
        if (error) throw error
        if (!result[0]) return res.status(404).send(`Request terminated: no genre found with ID: ${req.params.ID}`)
        database.query(`DELETE FROM genre WHERE ID = ${req.params.ID}`, (error) => {
            if (error) console.log(error)
            res.status(200).send(result[0])
        })
    })
})

module.exports = router