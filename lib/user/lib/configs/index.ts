const userPkg = require('../../package.json');
const userRoutes = require('./routes');
const userServices = require('./services.config');
const userConfig = {
    app:{
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