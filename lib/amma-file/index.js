"use strict";
var pkg = require('./package.json');
var Plugin = require('../amma-plugin-loader');
var ServiceConfig = require('./lib/config/services.config');
var config = {
    services: ServiceConfig.default,
    attributes: {
        pkg: pkg
    }
};
var plugin = Plugin.default(config);
module.exports = plugin;
