var pkg = require('../../package.json');
var routes = require('./routes');
var services = require('./services.config');
var config = {
    routes: routes,
    services: services,
    attributes: {
        pkg: pkg
    }
};
module.exports = config;
