var Joi = require('joi');
module.exports = {
    addressLine1: Joi.string().required(),
    addressLine2: Joi.string().optional(),
    town: Joi.string().required(),
    county: Joi.string(),
    country: Joi.string().required(),
    postcode: Joi.string().required()
};
