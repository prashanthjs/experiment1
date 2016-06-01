"use strict";
var Joi = require('joi');
var _ = require('lodash');
var commonValidation = require('../../../../common/validation/common.validation');
var createPayload = {
    _id: Joi.string().alphanum().required().min(2),
    privileges: Joi.array().items(Joi.string()),
    isLocked: Joi.boolean()
};
var updatePayload = {
    _id: Joi.string().alphanum().required().min(2),
    privileges: Joi.array().items(Joi.string()),
    isLocked: Joi.boolean()
};
_.merge(updatePayload, commonValidation);
_.merge(createPayload, commonValidation);
module.exports = {
    createPayload: createPayload,
    updatePayload: updatePayload
};
