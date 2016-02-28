var Joi = require('joi');
var createPayload = {
    _id: Joi.string().alphanum().required().min(2),
    name: Joi.object().required().keys({
        firstName: Joi.string().alphanum().required(),
        lastName: Joi.string().alphanum().required(),
    }),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().required(),
    dob: Joi.date().format('YYYY-MM-DD'),
    role: Joi.string().required(),
    gender: Joi.any().tags(['male', 'female', 'other']),
    address: Joi.object().keys({
        addressLine1: Joi.string().required(),
        addressLine2: Joi.string().optional(),
        town: Joi.string().required(),
        county: Joi.string(),
        country: Joi.string().required(),
        postcode: Joi.string().required()
    })
};
var updatePayload = {
    name: Joi.object().keys({
        firstName: Joi.string().alphanum().required(),
        lastName: Joi.string().alphanum().required(),
    }).required(),
    email: Joi.string().email().required(),
    role: Joi.string().required(),
    contactNumber: Joi.string().required(),
    dob: Joi.date().format('YYYY-MM-DD').required(),
    gender: Joi.any().tags(['male', 'female', 'other']).required(),
    address: Joi.object().keys({
        addressLine1: Joi.string().required(),
        addressLine2: Joi.string(),
        town: Joi.string().required(),
        county: Joi.string(),
        country: Joi.string().required(),
        postcode: Joi.string().required()
    })
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = {
    createPayload: createPayload,
    updatePayload: updatePayload
};
