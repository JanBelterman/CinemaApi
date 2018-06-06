const express = require('express');
const jwt = require('jsonwebtoken');
const database = require('../database');
const { validate } = require('../models/user');

const router = express.Router();

router.post('/login', (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    database.query(`SELECT * FROM user WHERE username = '${req.body.username}'`, (error, result) => {

        if (!result[0]) return res.status(401).send('Access denied. Not a valid user');

        if (req.body.password !== result[0].password) return res.status(401).send('Access denied. Password is incorrect');

        const user = {
            ID: result[0].ID
        };

        const token = jwt.sign(user, 'SeCrEtJsOnWeBtOkEn');

        res.status(200).send(token);

    });

});

router.post('/register', (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    database.query(`SELECT * FROM user WHERE username = '${req.body.username}'`, (error, result) => {

        if (result[0]) return res.status(405).send('Cannot register: User already exists');

        const user = {
            username: req.body.username,
            password: req.body.password
        };

        database.query('INSERT INTO user SET?', user, (error, result) => {

            database.query(`SELECT * FROM user WHERE ID = '${result.insertId}'`, (error, result) => {

                const user = {
                    ID: result[0].ID
                };

                const token = jwt.sign(user, 'SeCrEtJsOnWeBtOkEn');

                res.status(200).send(token);

            });

        });

    });

});

module.exports = router;