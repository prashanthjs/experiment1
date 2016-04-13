const userPkg = require('../../package.json');
const userRoutes = require('./routes');
const userServices = require('./services.config');
const userConfig = {
    routes: userRoutes,
    services: userServices,
    attributes: {
        pkg: userPkg
    }
};
module.exports = userConfig;