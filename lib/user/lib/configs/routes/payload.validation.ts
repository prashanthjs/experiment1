import Joi = require('joi');
import _ = require('lodash');
const addressValidation = require('../../../../common/validation/address.validation');
const commonValidation = require('../../../../common/validation/common.validation');

const createPayload = {
    _id: Joi.string().alphanum().required().min(2),
    name: Joi.object().required().keys({
        firstName: Joi.string().alphanum().required(),
        lastName: Joi.string().alphanum().required(),
    }),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().required(),
    dob: Joi.date().iso(),
    role: Joi.string(),
    gender: Joi.any().tags(['male', 'female', 'other']),
    isActive: Joi.boolean().required(),
    notes: Joi.string(),
    address: addressValidation
};


const updatePayload = {
    _id: Joi.string().alphanum().required().min(2),
    name: Joi.object().keys({
        firstName: Joi.string().alphanum().required(),
        lastName: Joi.string().alphanum().required(),
    }).required(),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().required(),
    role: Joi.string(),
    dob: Joi.date().iso().required(),
    gender: Joi.any().tags(['male', 'female', 'other']).required(),
    isActive: Joi.boolean().required(),
    notes: Joi.string(),
    address: addressValidation
};

_.merge(updatePayload, commonValidation);
_.merge(createPayload, commonValidation);
module.exports = {
    createPayload: createPayload,
    updatePayload: updatePayload
};
