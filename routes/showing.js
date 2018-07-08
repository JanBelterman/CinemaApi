const express = require('express');
const auth = require('../middleware/authentication');
const authManager = require('../middleware/authenticationManager');
const database = require('../database');

const router = express.Router();

// Endpoint to get all showings of a certain movie
router.get('/:movieID', auth, (req, res) => {

    database.query(`SELECT * FROM showing WHERE movieID = ${req.params.movieID}`, (error, result) => {
        if (error) console.log(error);

        if (result.length == 0) return res.status(404).send('No showings found for this movie');

        return res.status(200).send(result);

    });

});

module.exports = router;