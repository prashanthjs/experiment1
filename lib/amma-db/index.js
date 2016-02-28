var pkg = require('./package.json');
var Plugin = require('../amma-plugin-loader');
var config = {
    services: [{
        cls: require('./lib/services/db').default,
        name: 'dbService',
            methods: [{
                    name: 'connectDb',
                    methodName: 'connectDb'
                },
                {
                    name: 'disconnectDb',
                    methodName: 'disconnectDb'
                }]
    }],
    attributes: {
        pkg: pkg
    }
};
var plugin = Plugin.default(config);
module.exports = plugin;
