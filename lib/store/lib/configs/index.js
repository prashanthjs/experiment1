module.exports = {
    app: {
        privileges: ['store-add']
    },
    routes: require('./routes'),
    services: require('./services.config'),
    attributes: {
        pkg: require('../../package.json')
    }
};
