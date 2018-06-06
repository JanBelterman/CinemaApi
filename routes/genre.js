const express = require('express');
const auth = require('../authentication');
const database = require('../database');
const validate = require('../models/genre');

const router = express.Router();

router.get('/', auth, (req, res) => {

    database.query('SELECT * FROM genre', (error, result) => {

        res.status(200).send(result);

    });

});

module.exports = router;