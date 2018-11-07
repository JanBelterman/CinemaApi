const express = require('express')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const { validate } = require('../models/genre')
const { genresRepo } = require('../repos/genre')

const router = express.Router()

router.get('/', auth, async (req, res) => {
    const genres = await genresRepo.getAll()
    res.status(200).send(genres)
})

router.post('/', [auth, admin], async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const genre = {
        ID: await genresRepo.create(req.body),
        title: req.body.title
    }
    res.status(200).send(genre)
})

router.put('/:ID', [auth, admin], async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    let genre = {
        ID: req.params.ID,
        title: req.body.title
    }
    await genresRepo.update(genre)
    res.status(200).send(genre)
})

router.delete('/:ID', [auth, admin], async (req, res) => {
    await genresRepo.deleteById(req.params.ID)
    res.status(200).send('Deleted')
})

module.exports = router