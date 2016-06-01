"use strict";
var _ = require('lodash');
var Mongoose = require('mongoose');
var Timestamps = require('mongoose-timestamp');
var MongooseValidator = require('mongoose-validator');
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
    privileges: [String],
    isLocked: {
        type: Boolean,
        "default": false
    }
};
schemaJson = _.merge(schemaJson, common);
var schema = new Mongoose.Schema(schemaJson);
schema.plugin(Timestamps);
module.exports = {
    collectionName: 'role',
    schema: schema
};
