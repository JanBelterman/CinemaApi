const express = require('express');
const auth = require('../middleware/authentication');
const authManager = require('../middleware/authenticationManager');
const database = require('../database');
const { validate } = require('../models/movie');

const router = express.Router();

router.get('/', auth, (req, res) => {

    database.query('SELECT * FROM movie', (error, result) => {
        if (error) console.log(error);

        res.status(200).send(result);

    });

});

router.get('/:ID', auth, (req, res) => {

    database.query(`SELECT * FROM movie WHERE ID = ${req.params.ID}`, (error, result) => {
        if (error) console.log(error);

        if (!result[0]) return res.status(404).send(`Request terminated: no movie found with ID: ${req.params.ID}`);

        res.status(200).send(result);

    });

});

module.exports = router;