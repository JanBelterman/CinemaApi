const express = require('express');
const jwt = require('jsonwebtoken');
const database = require('../database');
const { validate } = require('../models/login');

const router = express.Router();

router.post('/login', (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    database.query(`SELECT * FROM manager WHERE username = '${req.body.username}'`, (error, result) => {
        if (error) console.log(error);

        if (!result[0]) return res.status(401).send('Access denied. Not a valid manager');

        if (req.body.password !== result[0].password) return res.status(401).send('Access denied. Password is incorrect');

        const token = jwt.sign({ ID: result[0].ID}, 'SeCrEtJsOnWeBtOkEn');

        res.status(200).send(token);

    });

});

router.post('/register', (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    database.query(`SELECT * FROM manager WHERE username = '${req.body.username}'`, (error, result) => {
        if (error) console.log(error);

        if (result[0]) return res.status(405).send('Cannot register: Manager already exists');

        const manager = {
            username: req.body.username,
            password: req.body.password
        };

        database.query('INSERT INTO manager SET?', manager, (error, result) => {
            if (error) console.log(error);

            database.query(`SELECT * FROM manager WHERE ID = '${result.insertId}'`, (error, result) => {
                if (error) console.log(error);

                const token = jwt.sign({ ID: result[0].ID}, 'SeCrEtJsOnWeBtOkEn');

                res.status(200).send(token);

            });

        });

    });

});

module.exports = router;