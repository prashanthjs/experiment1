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
            validator: 'isAlphanumeric'
        })
    },
    name: {
        firstName: {
            type: String,
            require: true,
            validate: MongooseValidator({
                validator: 'isAlphanumeric'
            })
        },
        lastName: {
            type: String,
            require: true,
            validate: MongooseValidator({
                validator: 'isAlphanumeric'
            })
        }
    },
    password: {
        type: String,
        require: true,
        select: false
    },
    email: {
        type: String,
        unique: true,
        require: true,
        validate: MongooseValidator({
            validator: 'isEmail'
        })
    },
    contactNumber: {
        type: String,
        require: true
    },
    dob: Date,
    gender: {
        type: String,
        require: false,
        validate: MongooseValidator({
            validator: 'matches',
            arguments: ['^(male|female|other)$'],
            message: 'Gender should be either male, female or other'
        })
    },
    role: String,
    address: addressSchema,
    isActive: {
        type: Boolean,
        'default': true
    },
    notes: String,
    token: {
        type: [String],
        require: false,
        select: false
    }
};
schemaJson = _.merge(schemaJson, common);
var schema = new Mongoose.Schema(schemaJson);
schema.plugin(Timestamps);
module.exports = {
    collectionName: 'user',
    schema: schema
};
