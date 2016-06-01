import _ = require('lodash');
import Mongoose = require('mongoose');
import Timestamps = require('mongoose-timestamp');
import MongooseValidator = require('mongoose-validator');
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
    privileges: [String],
    isLocked: {
        type: Boolean,
        "default": false
    }
};

schemaJson = _.merge(schemaJson, common);

const schema = new Mongoose.Schema(schemaJson);
schema.plugin(Timestamps);
module.exports = {
    collectionName: 'role',
    schema: schema
};
