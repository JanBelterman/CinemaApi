const joi = require('joi');

function validate(user) {

    const schema = {
        username: joi.string().required(),
        password: joi.string().required()
    };

    return joi.validate(user, schema);

}

module.exports.validate = validate;