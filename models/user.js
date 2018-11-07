const jwt = require('jsonwebtoken')
const joi = require('joi')
const config = require('config')

exports.genAuthToken = function(ID, isAdmin) {
    return jwt.sign({ ID: ID, isAdmin: isAdmin }, config.get('jwtPrivateKey'))
}

exports.validate = function(login) {
    const schema = {
        username: joi.string().required(),
        password: joi.string().required()
    }
    return joi.validate(login, schema)
}