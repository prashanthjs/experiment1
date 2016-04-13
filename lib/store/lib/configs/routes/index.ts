import _ = require('lodash');
const storeRoute = require('./store.route');
const imagesRoute = require('./images.route');
const imagesTempRoute = require('./images-temp.route');
module.exports = _.union(storeRoute, imagesRoute, imagesTempRoute);