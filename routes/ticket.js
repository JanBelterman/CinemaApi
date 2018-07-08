const express = require('express');
const auth = require('../middleware/authentication');
const database = require('../database');
const { validate } = require('../models/ticket');

const router = express.Router();

router.post('/', auth, (req, res) => {

    // Validate ticket
    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    // Add ticket
    database.query('INSERT INTO ticket SET ?', req.body, (error, result) => {
        if (error) console.log(error);

        // Send reponses
        const ticket = {
            ID: result.insertId,
            showingID: req.body.showingID,
            userID: req.body.userID,
            seatInstanceID: req.body.seatInstanceID
        }
        return res.status(200).send(ticket);

    });

});

module.exports = router;