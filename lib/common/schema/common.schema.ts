import Mongoose = require('mongoose');
module.exports = {
    addon: Mongoose.Schema.Types.Mixed,
    private: {
        type: Mongoose.Schema.Types.Mixed,
        require: false,
        select: false
    },
    cache: Mongoose.Schema.Types.Mixed,
    __v: {
        type: Number,
        select: false
    }
};