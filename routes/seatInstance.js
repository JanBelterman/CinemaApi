const express = require('express');
const auth = require('../middleware/auth');
const database = require('../startup/database');

const router = express.Router();

router.put('/:ID', auth, (req, res) => {

    let seatInstance = {
        ID: req.params.ID,
        seatRowInstanceID: req.body.seatRowInstanceID,
        seatID: req.body.seatID,
        status: req.body.status
    }
    database.query(`UPDATE seatInstance SET ? WHERE ID = ${req.params.ID}`, seatInstance, (error, result) => {
        if (error) console.log(error);

        res.status(200).send(seatInstance);

    });

});

module.exports = router;