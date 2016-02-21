var Plugin = require('../amma-plugin-loader');
var pkg = require('./package.json');
var PluginLoader = Plugin.default;
var config = {
    services: {
        'dbParser': {
            cls: require('./services/db.parser').default,
            methods: [{
                    name: 'ammaDbParser',
                    methodName: 'getDbParser'
                }]
        },
    },
    routes: [],
    attributes: {
        pkg: pkg
    }
};
var plugin = new PluginLoader(config);
module.exports = plugin;
