var _ = require('lodash');
var Mongoose = require('mongoose');
var Timestamps = require('mongoose-timestamp');
var MongooseValidator = require('mongoose-validators');
var addressSchema = require('../../../../common/schema/address.schema');
var common = require('../../../../common/schema/common.schema');
var schemaJson = {
    _id: {
        type: String,
        unique: true,
        require: true,
        validate: MongooseValidator.isAlphanumeric()
    },
    title: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        validate: MongooseValidator.isEmail()
    },
    url: {
        type: String,
        validate: MongooseValidator.isURL()
    },
    contactNumber: String,
    parent: String,
    address: addressSchema,
    description: String,
    isActive: {
        type: Boolean,
        'default': true
    }
};
schemaJson = _.merge(schemaJson, common);
var schema = new Mongoose.Schema(schemaJson);
schema.plugin(Timestamps);
module.exports = {
    collectionName: 'whitelabel',
    schema: schema
};
