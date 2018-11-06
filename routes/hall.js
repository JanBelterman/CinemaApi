const express = require('express');
const auth = require('../middleware/auth');
const authManager = require('../middleware/authenticationManager');
const database = require('../startup/database');

const router = express.Router();

router.get('/', auth, async (req, res) => {

    function getHalls() {

        return new Promise((resolve, reject) => {

            let halls = [];

            // Query database for all halls
            database.query('SELECT * FROM hall', (error, result) => {
                if (error) console.log(error);

                // For every hall
                let hallCounter = 0;
                while (hallCounter < result.length) {

                    halls.push({
                        ID: result[hallCounter].ID,
                        hallNr: result[hallCounter].hallNr,
                        seatRows: []
                    });

                    hallCounter++;

                }

                resolve(halls);

            });

        });

    }

    function getSeatRows(hall) {

        return new Promise((resolve, reject) => {

            let seatRows = [];

            // Query all seat rows within a certain hall
            database.query(`SELECT * FROM seatRow WHERE hallID = ${hall.ID}`, (error, result) => {
                if (error) console.log(error);

                // For all seat rows
                let seatRowCounter = 0;
                while (seatRowCounter < result.length) {

                    seatRows.push({
                        ID: result[seatRowCounter].ID,
                        hallID: result[seatRowCounter].hallID,
                        rowNr: result[seatRowCounter].rowNr,
                        seats: []
                    });

                    seatRowCounter++;

                }

                resolve(seatRows);

            });

        });

    }

    function getSeats(seatRow) {

        return new Promise((resolve, reject) => {

            let seats = [];

            // Query all seats within that seat row
            database.query(`SELECT * FROM seat WHERE seatRowID = ${seatRow.ID}`, (error, result) => {
                if (error) console.log(error);

                // For all seats
                let seatCounter = 0;
                while (seatCounter < result.length) {

                    // Add that seat to the seats of the seat row
                    seats.push({
                        ID: result[seatCounter].ID,
                        seatRowID: result[seatCounter].seatRowID,
                        seatNr: result[seatCounter].seatNr
                    });

                    seatCounter++;

                }

                resolve(seats);

            });

        });

    }

    let halls = await getHalls();

    let i = 0;
    while (i < halls.length) {

        halls[i].seatRows = await getSeatRows(halls[i]);

        let j = 0;
        while (j < halls[i].seatRows.length) {

            halls[i].seatRows[j].seats = await getSeats(halls[i].seatRows[j]);

            j++;

        }

        i++;

    }

    return res.status(200).send(halls);

});

router.get('/:ID', auth, async (req, res) => {

    function getHall(hall) {
        
        return new Promise((resolve, reject) => {

            // Query the all halls for a hall with the correct ID
            database.query(`SELECT * FROM hall WHERE ID = ${hall.ID}`, (error, result) => {
                if (error) console.log(error);

                // Check if there is a hall found
                if (!result[0]) return res.status(412).send(`Request terminated: no hall found with ID: ${hall.ID}`);

                // Get the hall
                hall = {
                ID: result[0].ID,
                hallNr: result[0].hallNr,
                seatRows: []
                }

                resolve(hall);

            });

        });

    }

    function getSeatRows(hall) {
        
        return new Promise((resolve, reject) => {

            // Query all seat rows within a certain hall
            database.query(`SELECT * FROM seatRow WHERE hallID = ${hall.ID}`, (error, result) => {
                if (error) console.log(error);

                let seatRows = [];

                // For all seat rows
                let i = 0;
                while (i < result.length) {

                    // Get that seat row
                    let seatRow = {
                        ID: result[i].ID,
                        hallID: result[i].hallID,
                        rowNr: result[i].rowNr,
                        seats: []
                    }

                    // Add that seat row to the hall
                    seatRows.push(seatRow);
                    i++;

                }

                resolve(seatRows);

            });

        });

    }

    function getSeats(seatRow) { 
        
        return new Promise((resolve, reject) => {

            // Query all seats within that seat row
            database.query(`SELECT * FROM seat WHERE seatRowID = ${seatRow.ID}`, (error, result) => {
                if (error) console.log(error);

                let seats = [];

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
                    seats.push(seat);
                    j++;

                }

                resolve(seats);

            });

        });

    }

    let hall = {
        ID: req.params.ID,
        hallNr: 0,
        seatRows: []
    }

    hall = await getHall(hall);

    let seatRows = await getSeatRows(hall);
    hall.seatRows = seatRows

    let counter = 0;
    while (counter < hall.seatRows.length) {

        hall.seatRows[counter].seats = await getSeats(hall.seatRows[counter]);

        counter++;

    }

    // Return response containing the hall
    return res.status(200).send(hall);


});

router.post('/', authManager, async (req, res) => {

    function insertHall(hall) {

        return new Promise((resolve, reject) => {

            database.query(`INSERT INTO hall (hallNr) VALUES ('${hall.hallNr}')`, (error, result) => {
                if (error) console.log(error);
        
                resolve(result.insertId);

            });

        });

    }

    function insertSeatRow(seatRow, hallID) {

        return new Promise((resolve, reject) => {

            database.query(`INSERT INTO seatRow (hallID, rowNr) VALUES (${hallID}, '${seatRow.rowNr}')`, (error, result) => {
                if (error) console.log(error);
                
                resolve(result.insertId);

            });

        });

    }

    function insertSeats(seatRow) {

        return new Promise((resolve, reject) => {

            let i = 0;
            while (i < seatRow.seats.length) {

                database.query(`INSERT INTO seat (seatRowID, seatNr) VALUES (${seatRow.ID}, '${seatRow.seats[i].seatNr}')`, (error, result) => {
                    if (error) console.log(error);

                });

                i++;

            }

            resolve();

        });

    }

    let hall = req.body;

    hall.ID = await insertHall(hall);

    let counter = 0;
    while (counter < hall.seatRows.length) {

        hall.seatRows[counter].ID = await insertSeatRow(hall.seatRows[counter], hall.ID);

        await insertSeats(hall.seatRows[counter]);

        counter++;

    }

    return res.status(200).send('Hall added');

    });

module.exports = router;