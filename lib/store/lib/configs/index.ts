const pkg = require('../../package.json');
const routes = require('./routes');
const services = require('./services.config');
const config = {
    routes: routes,
    services: services,
    attributes: {
        pkg: pkg
    }
};
module.exports = config;