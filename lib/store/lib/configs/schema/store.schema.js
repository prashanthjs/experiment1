"use strict";
var _ = require('lodash');
var Mongoose = require('mongoose');
var Timestamps = require('mongoose-timestamp');
var MongooseValidator = require('mongoose-validator');
var addressSchema = require('../../../../common/schema/address.schema');
var common = require('../../../../common/schema/common.schema');
var schemaJson = {
    _id: {
        type: String,
        unique: true,
        require: true,
        validate: MongooseValidator({
            validator: 'isAlphanumeric',
            message: 'should contain alpha-numeric characters only'
        })
    },
    title: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        validate: MongooseValidator({
            validator: 'isEmail',
            passIfEmpty: true,
            message: 'Not a valid email'
        })
    },
    website: {
        type: String
    },
    contactNumber: String,
    parent: String,
    address: addressSchema,
    description: String,
    isActive: {
        type: Boolean,
        'default': true
    },
    isLocked: {
        type: Boolean,
        'default': false
    }
};
schemaJson = _.merge(schemaJson, common);
var schema = new Mongoose.Schema(schemaJson);
schema.plugin(Timestamps);
module.exports = {
    collectionName: 'store',
    schema: schema
};
