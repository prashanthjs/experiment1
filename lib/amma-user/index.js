var pkg = require('./package.json');
var Plugin = require('../amma-plugin-loader');
var Services = require('./lib/configs/services.config');
var config = {
    routes: require('./lib/configs/routes'),
    services: Services.default,
    attributes: {
        pkg: pkg
    }
};
var plugin = Plugin.default(config);
module.exports = plugin;
