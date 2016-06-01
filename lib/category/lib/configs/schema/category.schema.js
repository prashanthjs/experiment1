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
            validator: 'isAlphanumeric',
            message: 'should contain alpha-numeric characters only'
        })
    },
    title: {
        type: String,
        require: true
    },
    parentCategory: String,
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
    collectionName: 'category',
    schema: schema
};
