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

module.exports = router;