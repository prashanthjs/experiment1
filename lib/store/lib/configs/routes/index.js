"use strict";
var _ = require('lodash');
var storeRoute = require('./store.route');
var imagesRoute = require('./images.route');
var imagesTempRoute = require('./images-temp.route');
module.exports = _.union(storeRoute, imagesRoute, imagesTempRoute);
