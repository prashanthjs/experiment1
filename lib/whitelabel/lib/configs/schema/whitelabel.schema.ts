import _ = require('lodash');
import Mongoose = require('mongoose');
import Timestamps = require('mongoose-timestamp');
import MongooseValidator = require('mongoose-validators');
const addressSchema = require('../../../../common/schema/address.schema');
const common = require('../../../../common/schema/common.schema');


let schemaJson = {
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

const schema = new Mongoose.Schema(schemaJson);
schema.plugin(Timestamps);
module.exports = {
    collectionName: 'whitelabel',
    schema: schema
};
