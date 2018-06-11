const express = require('express');
const auth = require('../middleware/authentication');
const authManager = require('../middleware/authenticationManager');
const database = require('../database');

const router = express.Router();

router.get('/', auth, (req, res) => {

    // Query database for all halls
    database.query('SELECT * FROM hall', (error, result) => {
        if (error) console.log(error);

        // Array which is going to store all halls
        const halls = [];

        // For every hall
        let i = 0;
        while (i < halls.length) {

            // Get the hall
            let hall = {
                ID: result[i].ID,
                Nr: result[i].Nr,
                seatRows: []
            }
            // Query all seat rows within a certain hall
            database.query(`SELECT * FROM seatRow WHERE hallID = ${hall.ID}`, (error, result) => {
                if (error) console.log(error);

                // For all seat rows
                let j = 0;
                while (j < result.length) {

                    // Get that seat row
                    let seatRow = {
                        ID: result[j].ID,
                        hallID: result[j].hallID,
                        Nr: result[j].Nr,
                        seats: []
                    }
                    // Query all seats within that seat row
                    database.query(`SELECT * FROM seat WHERE seatRowID = ${seatRow.ID}`, (error, result) => {
                        if (error) console.log(error);

                        // For all seats
                        let k = 0;
                        while (k < result.length) {

                            // Get that seat
                            let seat = {
                                ID: result[k].ID,
                                seatRowID: result[k].seatRowID,
                                seatNr: result[k].seatNr
                            }

                            // Add that seat to the seats of the seat row
                            seatRow.push(seat);
                            k++;

                        }

                    });

                    // Add that seat row to the hall
                    hall.seatRows.push(seatRow);
                    j++;

                }

            });

            // Add that hall to the array of halls
            halls.push(hall);
            i++;

        }

        // Return a response with all halls
        res.status(200).send(halls);

    });

});

router.get('/:ID', auth, (req, res) => {

    // Query the all halls for a hall with the correct ID
    database.query(`SELECT * FROM hall WHERE ID = ${req.params.ID}`, (error, result) => {
        if (error) console.log(error);

        // Check if there is a hall found
        if (!result[0]) return res.status(412).send(`Request terminated: no hall found with ID: ${req.params.ID}`);

        // Get the hall
        let hall = {
            ID: result[0].ID,
            Nr: result[0].Nr,
            seatRows: []
        }
        // Query all seat rows within a certain hall
        database.query(`SELECT * FROM seatRow WHERE hallID = ${hall.ID}`, (error, result) => {
            if (error) console.log(error);

            // For all seat rows
            let i = 0;
            while (i < result.length) {

                // Get that seat row
                let seatRow = {
                    ID: result[i].ID,
                    hallID: result[i].hallID,
                    Nr: result[i].Nr,
                    seats: []
                }
                // Query all seats within that seat row
                database.query(`SELECT * FROM seat WHERE seatRowID = ${seatRow.ID}`, (error, result) => {
                    if (error) console.log(error);

                    // For all seats
                    let j = 0;
                    while (j < result.length) {

                        // Get that seat
                        let seat = {
                            ID: result[j].ID,
                            seatRowID: result[j].seatRowID,
                            seatNr: result[j].seatNr
                        }

                        // Add that seat to the seats of the seat row
                        seatRow.push(seat);
                        i++;

                    }

                });
            
                // Add that seat row to the hall
                hall.seatRows.push(seatRow);
                k++;

            }

        });

    });

    // Return response containing the hall
    return res.status(200).send(hall);

});

module.exports = router;