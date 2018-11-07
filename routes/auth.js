const express = require('express')
const bcrypt = require('bcryptjs')
const { validate, genAuthToken } = require('../models/user')
const { getByUsername } = require('../repos/users')

const router = express.Router()

// Endpoint for logging in
router.post('/', async (req, res) => {

    // Validating request
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // User exists?
    let user = await getByUsername(req.body.username);
    if (!user) return res.status(400).send('Invalid username or password')

    // Password correct?
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send("Invalid username or password")

    // Response
    res.status(200).send({
        username: req.body.username,
        token: genAuthToken(user.ID, user.isAdmin)
    })

})

module.exports = router