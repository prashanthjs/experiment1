var userPkg = require('../../package.json');
var userRoutes = require('./routes');
var userServices = require('./services.config');
var userConfig = {
    app: {
        auth: {
            secret: 'dlkjfalsdjlk'
        },
        privileges: ['user-add']
    },
    routes: userRoutes,
    services: userServices,
    attributes: {
        pkg: userPkg
    }
};
module.exports = userConfig;
