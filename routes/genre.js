const express = require('express');
const auth = require('../middleware/auth');
const authManager = require('../middleware/authenticationManager');
const database = require('../startup/database');
const { validate } = require('../models/genre');

const router = express.Router();

// Endpoint to get all genres
router.get('/', auth, (req, res) => {

    // Query datbase for all genres
    database.query('SELECT * FROM genre', (error, result) => {
        if (error) console.log(error);

        // Send response containing all the genres
        res.status(200).send(result);

    });

});

// Endpoint to post a new genre
router.post('/', authManager, (req, res) => {

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

    });

});

// Endpoint to put a new genre
router.put('/:ID', authManager, (req, res) => {

    // Validate client input
    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    // Update genre in database
    let genre = {
        ID: req.params.ID,
        title: req.body.title
    }
    database.query(`UPDATE genre SET title = '${genre.title}' WHERE ID = ${genre.ID}`, (error, result) => {
        if (error) console.log(error);

        // Return response containing the updated genre
        res.status(200).send(genre);

    });

});

// Endpoint to delete a genre
router.delete('/:ID', authManager, (req, res) => {

    // Check if genre with given ID exists
    database.query(`SELECT * FROM genre WHERE ID = ${req.params.ID}`, (error, result) => {
        if (error) console.log(error);

        if (!result[0]) return res.status(404).send(`Request terminated: no genre found with ID: ${req.params.ID}`);

        // Delete genre
        database.query(`DELETE FROM genre WHERE ID = ${req.params.ID}`, (error) => {
            if (error) console.log(error);

            // Return response containing the deleted genre
            res.status(200).send(result[0]);

        });

    });

});

module.exports = router;