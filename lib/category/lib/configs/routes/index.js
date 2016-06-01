"use strict";
var _ = require('lodash');
var categoryRoute = require('./category.route');
var imagesRoute = require('./images.route');
var imagesTempRoute = require('./images-temp.route');
module.exports = _.union(categoryRoute, imagesRoute, imagesTempRoute);
