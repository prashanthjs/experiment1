import _ = require('lodash');
const categoryRoute = require('./category.route');
const imagesRoute = require('./images.route');
const imagesTempRoute = require('./images-temp.route');
module.exports = _.union(categoryRoute, imagesRoute, imagesTempRoute);