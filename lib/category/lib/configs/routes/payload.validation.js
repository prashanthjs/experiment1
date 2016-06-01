"use strict";
var Joi = require('joi');
var _ = require('lodash');
var commonValidation = require('../../../../common/validation/common.validation');
var createPayload = {
    _id: Joi.string().alphanum().required().min(2),
    title: Joi.string().required(),
    parentCategory: Joi.string(),
    description: Joi.string(),
    isActive: Joi.boolean()
};
var updatePayload = {
    _id: Joi.string().alphanum().required().min(2),
    title: Joi.string().required(),
    parentCategory: Joi.string().allow('').optional(),
    description: Joi.string(),
    isActive: Joi.boolean()
};
_.merge(updatePayload, commonValidation);
_.merge(createPayload, commonValidation);
module.exports = {
    createPayload: createPayload,
    updatePayload: updatePayload
};
