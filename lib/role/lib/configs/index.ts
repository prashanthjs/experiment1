module.exports = {
    routes: require('./routes'),
    services:  require('./services.config'),
    attributes: {
        pkg: require('../../package.json')
    }
};