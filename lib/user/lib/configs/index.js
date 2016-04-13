var userPkg = require('../../package.json');
var userRoutes = require('./routes');
var userServices = require('./services.config');
var userConfig = {
    routes: userRoutes,
    services: userServices,
    attributes: {
        pkg: userPkg
    }
};
module.exports = userConfig;
