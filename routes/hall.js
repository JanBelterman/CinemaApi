const express = require('express');
const auth = require('../middleware/authentication');
const authManager = require('../middleware/authenticationManager');
const database = require('../database');

const router = express.Router();

router.get('/', auth, (req, res) => {

    database.query('SELECT * FROM hall', (error, result) => {
        if (error) console.log(error);

        const halls = [];

        let i = 0;
        while (i < halls.length) {

            let hall = {
                ID: result[i].ID,
                Nr: result[i].Nr,
                seatRows: []
            }
            database.query(`SELECT * FROM seatRow WHERE hallID = ${hall.ID}`, (error, result) => {
                if (error) console.log(error);

                let j = 0;
                while (j < result.length) {

                    let seatRow = {
                        ID: result[j].ID,
                        hallID: result[j].hallID,
                        Nr: result[j].Nr,
                        seats: []
                    }
                    database.query(`SELECT * FROM seat WHERE seatRowID = ${seatRow.ID}`, (error, result) => {
                        if (error) console.log(error);

                        let k = 0;
                        while (k < result.length) {

                            let seat = {
                                ID: result[k].ID,
                                seatRowID: result[k].seatRowID,
                                seatNr: result[k].seatNr
                            }

                            seatRow.push(seat);
                            k++;

                        }

                    });

                    hall.seatRows.push(seatRow);
                    j++;

                }

            });

            halls.push(hall);
            i++;

        }

        res.status(200).send(halls);

    });

});

module.exports = router;