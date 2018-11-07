const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin')
const database = require('../startup/database');
const { validate } = require('../models/showing');

const router = express.Router();

// Endpoint to get all showings of a certain movie
router.get('/:movieID', auth, (req, res) => {
    database.query(`SELECT * FROM showing WHERE movieID = ${req.params.movieID}`, (error, result) => {
        if (error) console.log(error);
        if (result.length === 0) return res.status(404).send('No showings found for this movie');
        return res.status(200).send(result);
    });
});

// Endpoint for creating a showing
router.post('/', [auth, admin], (req, res) => {
    // Validating showing
    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);
    // Adding showing
    database.query('INSERT INTO showing SET ?', req.body, (error, result) => {
        if (error) console.log(error);
        const showing = {
            ID: result.insertId,
            hallInstanceID: req.body.hallInstanceID,
            movieID: req.body.movieID,
            date: req.body.date
        };
        // Sending response
        res.status(200).send(showing);
    });
});

module.exports = router;