const express = require('express')
const bcrypt = require('bcryptjs')
const { validate, genAuthToken } = require('../models/user')
const { getByUsername, create } = require('../repos/users')

const router = express.Router()

// Endpoint for registering new users
router.post('/', async (req, res) => {
    
    // Validating request
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // Check if user already registered
    let user = await getByUsername(req.body.username)
    if (user) return res.status(400).send("User already registered")

    // Create user
    const salt = await bcrypt.genSalt(10)
    user = {
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, salt)
    }
    user.ID = await create(user)
    
    // Response
    res.status(200).send({
        username: user.username,
        token: genAuthToken(user.ID, false)
    })

})

module.exports = router