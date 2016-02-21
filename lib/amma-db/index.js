var Plugin = require('../amma-plugin-loader');
var pkg = require('./package.json');
var PluginLoader = Plugin.default;
var config = {
    services: {
        'dbService': {
            cls: require('./services/db').default,
            methods: [{
                    name: 'connectDb',
                    methodName: 'connectDb'
                },
                {
                    name: 'disconnectDb',
                    methodName: 'disconnectDb'
                },
            ]
        }
    },
    attributes: {
        pkg: pkg
    }
};
var plugin = new PluginLoader(config);
module.exports = plugin;
