const joi = require('joi');

function validate(genre) {

    const schema = {
        title: joi.string().required()
    };

    return joi.validate(genre, schema);

}

module.exports.validate = validate;