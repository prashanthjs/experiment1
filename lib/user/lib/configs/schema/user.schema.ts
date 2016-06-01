import _ = require('lodash');
import Mongoose = require('mongoose');
import Timestamps = require('mongoose-timestamp');
import MongooseValidator = require('mongoose-validator');
const addressSchema = require('../../../../common/schema/address.schema');
const common = require('../../../../common/schema/common.schema');

let schemaJson = {
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
    isLocked: {
        type: Boolean,
        "default": false
    },
    notes: String,
    token: {
        type: [String],
        require: false,
        select: false
    },
    store: {
        type: String,
        require: true
    },
};

schemaJson = _.merge(schemaJson, common);

const schema = new Mongoose.Schema(schemaJson);
schema.plugin(Timestamps);
module.exports = {
    collectionName: 'user',
    schema: schema
};
