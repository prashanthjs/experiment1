"use strict";
var Plugin = require('../amma-plugin-loader');
var config = require('./lib/configs');
var plugin = Plugin.default(config);
module.exports = plugin;
