const express = require('express');
const auth = require('../authentication');
const database = require('../database');
const { validate } = require('../models/genre');

const router = express.Router();

// Route to get all genres
router.get('/', auth, (req, res) => {

    // Query datbase for all genres
    database.query('SELECT * FROM genre', (error, result) => {
        if (error) console.log(error);

        // Send response containing all the genres
        res.status(200).send(result);

    });

});

// Route to post a new genre
router.post('/', auth, (req, res) => {

    // Validate client input
    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    // Add genre to database
    let genre = {
        title: req.body.title
    }
    const query = database.query('INSERT INTO genre SET ?', genre, (error, result) => {
        if (error) console.log(error);

        // Get inserted genre
        genre = {
            ID: result.insertId,
            title: genre.title
        }

        // Return response containing the created genre
        res.status(200).send(genre);

    })

});

module.exports = router;