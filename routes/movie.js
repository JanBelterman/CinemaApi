const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin')
const database = require('../startup/database');
const { validate } = require('../models/movie');

const router = express.Router();

router.get('/', (req, res) => {

    database.query('SELECT * FROM movie', async (error, result) => {
        if (error) console.log(error);
        // include genres
        if (req.query.include === 'genre') {
            for (let i = 0; i < result.length; i++) {
                result[i].genre = await getGenre(result[i].genreID);
            }
        }
        res.status(200).send(result);

    });

});

function getGenre(id) {
    return new Promise((resolve, reject) => {
        database.query(`SELECT * FROM genre WHERE ID = ${id}`, (error, result) => {
            if (error) console.log(error);
            if (result == null || result.length <= 0) return resolve("No genre");
            resolve(result[0].title);
        })
    });
}

router.get('/:ID', auth, (req, res) => {

    database.query(`SELECT * FROM movie WHERE ID = ${req.params.ID}`, (error, result) => {
        if (error) console.log(error);

        if (!result[0]) return res.status(404).send(`Request terminated: no movie found with ID: ${req.params.ID}`);

        res.status(200).send(result);

    });

});

router.post('/', [auth, admin], (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    database.query(`INSERT INTO movie SET ?`, req.body, (error, result) => {
        if (error) console.log(error);

        res.status(200).send({
            ID: result.insertId,
            title: req.body.title,
            description: req.body.description,
            runtime: req.body.runtime,
            genreID: req.body.genreID,
            director: req.body.director,
            production: req.body.production,
            releaseDate: req.body.releaseDate,
            rating: req.body.rating,
            imageURL: req.body.imageURL
        })

    });

});

router.put('/:ID', [auth, admin], (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    let movie = {
        ID: req.params.ID,
        title: req.body.title,
        description: req.body.description,
        runtime: req.body.runtime,
        genreID: req.body.genreID,
        director: req.body.director,
        production: req.body.production,
        releaseDate: req.body.releaseDate,
        rating: req.body.rating,
        imageURL: req.body.imageURL
    }

    let sql =
        `UPDATE movie
        SET title = '${movie.title}',
        description = '${movie.description}',
        runtime = ${movie.runtime},
        genreID = ${movie.genreID},
        director = '${movie.director}',
        production = '${movie.production}',
        releaseDate = '${movie.releaseDate}',
        rating = ${movie.rating},
        imageURL = '${movie.imageURL}'
        WHERE ID = ${movie.ID}`;

    database.query(sql, req.body, (error, result) => {
        if (error) console.log(error);

        res.status(200).send(movie);

    });

});

module.exports = router;