const joi = require('joi');

function validate(login) {

    const schema = {
        username: joi.string().required(),
        password: joi.string().required()
    };

    return joi.validate(login, schema);

}

module.exports.validate = validate;